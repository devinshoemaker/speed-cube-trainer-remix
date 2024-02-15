import { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

import { requireUserId } from '~/session.server';

import SideMenu from './-components/side-menu';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);
  return null;
};

export default function AppLayout() {
  return (
    <div className="flex">
      <SideMenu />
      <main className="min-h-screen w-full flex flex-col items-center">
        <Outlet />
      </main>
    </div>
  );
}
