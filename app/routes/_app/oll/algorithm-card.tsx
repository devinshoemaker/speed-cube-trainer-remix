import { Link, useFetcher } from '@remix-run/react';

import { Case } from './cases';

export default function AlgorithmCard({
  algorithmCase,
  isLink = false
}: {
  algorithmCase: Case;
  isLink?: boolean;
}) {
  const fetcher = useFetcher();
  return (
    <div
      id="algorithm-card"
      data-testid="algorithm-card"
      className="rounded p-4 w-full bg-slate-700 shadow"
    >
      {isLink ? (
        <Link
          id="info-row"
          to={`/oll/${algorithmCase.name}`}
          className="flex items-center justify-between"
        >
          <AlgorithmCardContent algorithmCase={algorithmCase} />
        </Link>
      ) : (
        <div id="info-row" className="flex items-center justify-between">
          <AlgorithmCardContent algorithmCase={algorithmCase} />
        </div>
      )}

      <fetcher.Form method="post" action={`/oll/${algorithmCase.name}`}>
        <ul className="flex justify-between pt-4">
          <li>
            <input
              type="radio"
              name="oll-status"
              id="not-learned"
              value="not-learned"
              className="peer hidden"
              defaultChecked={algorithmCase.status === 'not-learned'}
              onChange={(e) =>
                fetcher.submit(e.currentTarget.form, { method: 'POST' })
              }
            />
            <label
              htmlFor="not-learned"
              className="peer-checked:bg-blue-500 peer-checked:rounded p-2"
            >
              Not Learned
            </label>
          </li>
          <li>
            <input
              type="radio"
              name="oll-status"
              id="learning"
              value="learning"
              className="peer hidden"
              defaultChecked={algorithmCase.status === 'learning'}
              onChange={(e) =>
                fetcher.submit(e.currentTarget.form, { method: 'POST' })
              }
            />
            <label
              htmlFor="learning"
              className="peer-checked:bg-blue-500 peer-checked:rounded p-2"
            >
              Learning
            </label>
          </li>
          <li>
            <input
              type="radio"
              name="oll-status"
              id="learned"
              value="learned"
              className="peer hidden"
              defaultChecked={algorithmCase.status === 'learned'}
              onChange={(e) =>
                fetcher.submit(e.currentTarget.form, { method: 'POST' })
              }
            />
            <label
              htmlFor="learned"
              className="peer-checked:bg-blue-500 peer-checked:rounded p-2"
            >
              Learned
            </label>
          </li>
        </ul>
      </fetcher.Form>
    </div>
  );
}

function AlgorithmCardContent({ algorithmCase }: { algorithmCase: Case }) {
  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center">
          <label id="case-name" className="text-3xl pr-4">
            {algorithmCase.name}
          </label>
          <label id="case-group">{algorithmCase.group}</label>
        </div>
        <label id="case-algorithm">{algorithmCase.algorithm}</label>
      </div>

      <img src={algorithmCase.image} alt="" width="100" height="100" />
    </>
  );
}
