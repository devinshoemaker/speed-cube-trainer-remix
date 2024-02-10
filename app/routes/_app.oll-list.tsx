import { LoaderFunctionArgs } from '@remix-run/node';
import AlgorithmCard from '~/components/algorithm-card';
import { olls } from '~/lib/cases';
import { requireUserId } from '~/session.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);
  return null;
};

export default function OllList() {
  return (
    <div
      id="page-container"
      className="w-full p-4 flex flex-col items-center max-w-sm gap-4"
    >
      {olls.map((oll) => (
        <AlgorithmCard algorithmCase={oll} key={oll.name} />
      ))}
    </div>
  );
}
