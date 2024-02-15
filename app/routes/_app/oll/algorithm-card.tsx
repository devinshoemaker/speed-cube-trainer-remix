import { Link } from '@remix-run/react';

import { Case } from './cases';

export default function AlgorithmCard({
  algorithmCase,
  isLink = false
}: {
  algorithmCase: Case;
  isLink?: boolean;
}) {
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

      <div id="status-buttons" className="flex justify-between pt-4">
        {/* TODO turn this into a radio? */}
        <button>Not Learned</button>
        <button>Learning</button>
        <button>Learned</button>
      </div>
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
