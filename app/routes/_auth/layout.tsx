import { LoaderFunctionArgs, redirect } from '@remix-run/node';

import { getUserId } from '~/session.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) {
    redirect('/timer');
  }

  return null;
};
