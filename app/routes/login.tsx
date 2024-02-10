import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction
} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams
} from '@remix-run/react';
import { useEffect, useRef } from 'react';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Icons } from '~/components/ui/icons';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { cn } from '~/lib/utils';
import { verifyLogin } from '~/models/user.server';
import { createUserSession, getUserId } from '~/session.server';
import { safeRedirect } from '~/utils';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect('/timer');
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/timer');
  const remember = formData.get('remember');

  const passwordRequired = z
    .object({
      email: z.string().email({ message: 'Email is invalid' }),
      password: z.string().min(1, { message: 'Password is required' })
    })
    .safeParse(Object.fromEntries(formData));

  if (!passwordRequired.success) {
    return json({ errors: passwordRequired.error.formErrors.fieldErrors });
  }

  const parsedCredentials = z
    .object({
      email: z.string().email({ message: 'Email is invalid' }),
      password: z.string().min(6, { message: 'Password is too short' })
    })
    .safeParse(Object.fromEntries(formData));

  if (parsedCredentials.success) {
    const { email, password } = parsedCredentials.data;
    const user = await verifyLogin(email, password);

    if (!user) {
      return json(
        { errors: { email: 'Invalid email or password', password: null } },
        { status: 400 }
      );
    }

    return createUserSession({
      redirectTo,
      remember: remember === 'on' ? true : false,
      request,
      userId: user.id
    });
  } else {
    return json({ errors: parsedCredentials.error.formErrors.fieldErrors });
  }
};

export const meta: MetaFunction = () => [{ title: 'Login' }];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/timer';
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors;
  const navigation = useNavigation();
  const pending = navigation.state === 'submitting';
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-sm w-full space-y-4">
        <div id="header" className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Log In</h1>
        </div>

        <div id="login-form" className={cn('grid gap-6')}>
          <Form method="post">
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="email">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={pending}
                />
              </div>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="password">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  placeholder="password"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="password"
                  autoCorrect="off"
                  disabled={pending}
                />
              </div>

              <input type="hidden" name="redirectTo" value={redirectTo} />
              <Button disabled={pending}>
                {pending ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Sign In with Email
              </Button>
              <Button>
                <Link to="/register">Sign Up</Link>
              </Button>
              <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
              >
                {errors?.email ? (
                  <p className="text-sm text-red-500">{errors?.email}</p>
                ) : null}
                {errors?.password ? (
                  <p className="text-sm text-red-500">{errors?.password}</p>
                ) : null}
              </div>
            </div>
          </Form>
        </div>
      </div>
    </main>
  );
}
