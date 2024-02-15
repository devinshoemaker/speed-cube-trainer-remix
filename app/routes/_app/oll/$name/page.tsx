import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import Timer from '../../-components/timer';
import AlgorithmCard from '../algorithm-card';
import { olls } from '../cases';

export async function loader({ params }: LoaderFunctionArgs) {
  const oll = olls.find((oll) => oll.name === params.name);
  if (oll) {
    return json({ oll });
  }

  return redirect('/oll');
}

export default function OllPage() {
  const { oll } = useLoaderData<typeof loader>();

  return (
    <div id="oll-page" className="h-full w-full flex flex-col items-center">
      <div className="max-w-sm pt-4">
        <AlgorithmCard algorithmCase={oll} />
      </div>
      <Timer />
    </div>
  );
}
