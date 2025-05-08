'use client';
import truncate from '@/utils/truncate';
import { useState } from 'react';

// 🔹 Define props type
interface TruncateProps {
  children?: string;
  length: number;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
  [key: string]: any; // For spreading other props
}

export const Truncate = ({ children = '', length, onClick = () => {}, ...props }: TruncateProps) => {
  const [show, setShow] = useState(false);

  return (
    <div
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      {...props}
      style={{ cursor: 'pointer', ...props.style }}
      onClick={() => {
        setShow(!show);
        onClick();
      }}
    >
      <p>{!show ? truncate(children, length) : children}</p>
      <p className="hidden">{children.slice(length)}</p>
    </div>
  );
};