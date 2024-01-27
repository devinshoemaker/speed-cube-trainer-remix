import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Icons } from "~/components/ui/icons";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { createUser, getUserByEmail } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  const passwordRequired = z
    .object({
      email: z.string().email({ message: "Email is invalid" }),
      password: z.string().min(1, { message: "Password is required" }),
    })
    .safeParse(Object.fromEntries(formData));

  if (!passwordRequired.success) {
    return json({ errors: passwordRequired.error.formErrors.fieldErrors });
  }

  const parsedCredentials = z
    .object({
      email: z.string().email({ message: "Email is invalid" }),
      password: z.string().min(6, { message: "Password is too short" }),
    })
    .safeParse(Object.fromEntries(formData));

  if (parsedCredentials.success) {
    const { email, password } = parsedCredentials.data;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return json(
        {
          errors: {
            email: "A user already exists with this email",
            password: null,
          },
        },
        { status: 400 },
      );
    }

    const user = await createUser(email, password);

    return createUserSession({
      redirectTo,
      remember: false,
      request,
      userId: user.id,
    });
  } else {
    return json({ errors: parsedCredentials.error.formErrors.fieldErrors });
  }
};

export const meta: MetaFunction = () => [{ title: "Sign Up" }];

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();
  const errors = actionData?.errors;
  const navigation = useNavigation();
  const pending = navigation.state === "submitting";
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
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an Account
          </h1>
        </div>

        <div id="login-form" className={cn("grid gap-6")}>
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
                Sign Up with Email
              </Button>
              <Button>
                <Link to="/login">Sign In</Link>
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

        <p id="tos" className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            to="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
