import AlgorithmCard from '../algorithm-card';
import { olls } from '../cases';

export default function OllListPage() {
  return (
    <div
      id="page-container"
      className="w-full p-4 flex flex-col items-center max-w-sm gap-4"
    >
      {olls.map((oll) => (
        <AlgorithmCard
          algorithmCase={oll}
          key={oll.name}
          isLink={true}
          data-testid={`oll-${oll.name}`}
        />
      ))}
    </div>
  );
}
