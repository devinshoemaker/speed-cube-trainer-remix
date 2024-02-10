import { Outlet } from '@remix-run/react';

import SideMenu from './side-menu';

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
