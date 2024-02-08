import { Outlet } from '@remix-run/react';
import SideMenu from '~/components/SideMenu';

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
