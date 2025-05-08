import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// 🔹 Define props type
interface PortalProps {
  children: React.ReactNode;
}

const Portal: React.FC<PortalProps> = ({ children }) => {
  const ref = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const element = document.querySelector<HTMLElement>('#loading');
    ref.current = element;
    setMounted(true);
  }, []);

  return mounted && ref.current
    ? createPortal(<div>{children}</div>, ref.current)
    : null;
};

export default Portal;