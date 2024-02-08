import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { requireUserId } from '~/session.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);
  return redirect('/timer');
};
