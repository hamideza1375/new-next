'use client';
import { Button } from '@nextui-org/react';
import { useEffect, useState } from 'react';

export function Timer({ onClick, expires, disabled }) {
    const [time, setTime] = useState(180);

    useEffect(() => {
        if(expires > 0) setTime(expires);
        const timer = setInterval(() => {
            setTime(prevTime => (prevTime > 0 ? prevTime - 1 : prevTime));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const minutes = Math.floor(time / 60)
        .toString()
        .padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');

    return (
        <Button
            disabled={disabled}
            style={{ color: time <= 0 ? '#fff' : '#fff7', cursor: time <= 0 ? 'pointer' : 'auto' }}
            className="mt-2 -mb-0.5 ml-0.5"
            // onClick={async () => {
            //     if (time <= 0) {
            //         try {
            //             await onClick();
            //             setTime(180);
            //         } catch (error) {}
            //     }
            // }}
            >{`${minutes}:${seconds}`}</Button>
    );
}
