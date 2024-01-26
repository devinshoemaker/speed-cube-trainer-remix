import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";

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

  const parsedCredentials = z
    .object({
      email: z.string().email({ message: "Email is invalid" }),
      password: z
        .string()
        .min(1, { message: "Password is required" })
        .min(6, { message: "Password is too short" }),
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
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        method="post"
      >
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          id="email"
          placeholder="you@example.com"
          required
        />

        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          id="password"
          placeholder="••••••••"
        />

        <input type="hidden" name="redirectTo" value={redirectTo} />
        <button
          className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
          type="submit"
        >
          Sign Up
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="remember" className="ml-2 block text-sm">
              Remember me
            </label>
          </div>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              className="text-blue-500 underline"
              to={{
                pathname: "/login",
                search: searchParams.toString(),
              }}
            >
              Sign in
            </Link>
          </div>
        </div>

        {actionData?.errors?.email ? (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {actionData.errors.email}
          </p>
        ) : null}

        {actionData?.errors?.password ? (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {actionData.errors.password}
          </p>
        ) : null}
      </Form>
    </div>
  );
}
