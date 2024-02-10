import { LoaderFunctionArgs } from '@remix-run/node';
import { useEffect, useRef, useState } from 'react';

import { requireUserId } from '~/session.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);
  return null;
};

export default function Timer() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.code === 'Space') {
        if (running) {
          stopTimer();
        } else {
          startTimer();
        }
      }
    }

    document.addEventListener('keyup', handleKeyDown);

    return () => {
      document.removeEventListener('keyup', handleKeyDown);
    };
  }, [running]);

  function startTimer() {
    setRunning(true);
    setTime(0);
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 10);
    }, 10);
  }

  function stopTimer() {
    setRunning(false);
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
  }

  function formatTime() {
    const minutes = Math.floor((time / 1000 / 60) % 60);
    const seconds = Math.floor((time / 1000) % 60);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${minutes < 10 ? '0' : ''}${minutes}:${
      seconds < 10 ? '0' : ''
    }${seconds}:${milliseconds < 10 ? '0' : ''}${milliseconds}`;
  }

  return (
    <button
      className="flex flex-col justify-center items-center h-full"
      onClick={() => (running ? stopTimer() : startTimer())}
      data-testid="timer"
    >
      <div className="flex text-8xl w-fit">
        <span>{formatTime()}</span>
      </div>
    </button>
  );
}
