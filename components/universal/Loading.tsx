'use client';
import { Spinner } from '@nextui-org/react';
import { Portal } from './Portal';
import { useEffect, useState } from 'react';

let timeoutId: NodeJS.Timeout | null = null;

interface LoadingProps {
  show: boolean;
  timeout?: number; // Optional timeout prop with default value
}

export function Loading({ show, timeout = 12000 }: LoadingProps) {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setDisabled(false);
    
    if (show) {
      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      // Set new timeout
      timeoutId = setTimeout(() => {
        setDisabled(true);
      }, timeout);
    }

    return () => {
      setDisabled(false);
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
  }, [show, timeout]);

  if (!show || disabled) {
    return null;
  }

  return (
    <Portal>
      <div
        style={{
          position: 'fixed',
          top: '10px',
          zIndex: 1000,
          alignSelf: 'center',
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
        role="status"
        aria-live="polite"
        aria-label="Loading indicator"
      >
        <Spinner color="primary" />
      </div>
    </Portal>
  );
}