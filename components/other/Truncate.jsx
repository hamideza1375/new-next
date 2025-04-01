'use client'
import truncate from '@/utils/truncate';
import { useState } from 'react';

export const Truncate = ({ children='', length,onClick=()=>{}, ...props }) => {
  const [show, setShow] = useState(false);
  return (
    <div
    onMouseEnter={()=>setShow(true)}
    onMouseLeave={()=>setShow(false)}
      {...props}
      style={{ cursor: 'pointer', ...props.style }}
      onClick={() => { setShow(!show); onClick(); }}
    >
     <p>{!show ? truncate(children, length) : children}</p>
     <p className='hidden' >{children.slice(length)}</p>
    </div>
  );
};
