'use client';
import { Button } from '@nextui-org/react';
import { useEffect, useState } from 'react';

// 🔹 Define props type
interface TimerProps {
  onClick?: () => Promise<void>;
  expires?: number;
  disabled?: boolean;
}

export function Timer({ onClick, expires = 180, disabled = false }: TimerProps) {
  const [time, setTime] = useState<number>(expires);

  useEffect(() => {
    if (expires > 0) setTime(expires);
    const timer = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : prevTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [expires]);

  const minutes = Math.floor(time / 60).toString().padStart(2, '0');
  const seconds = (time % 60).toString().padStart(2, '0');

//   const handleClick = async () => {
//     if (time <= 0 && onClick) {
//       try {
//         await onClick();
//         setTime(180);
//       } catch (error) {
//         console.error('Error in Timer onClick:', error);
//       }
//     }
//   };

  return (
    <Button
      disabled={disabled || time > 0}
      style={{
        color: time <= 0 ? '#fff' : '#fff7',
        cursor: time <= 0 ? 'pointer' : 'auto',
      }}
      className="mt-2 -mb-0.5 ml-0.5"
    //   onClick={handleClick}
      >
      {`${minutes}:${seconds}`}
    </Button>
  );
}