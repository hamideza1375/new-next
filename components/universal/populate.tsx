'use client';
import { fontSans } from '@/config/fonts';
import { useProductsContext } from '@/hook/context/appContext/useProductsContext';
import { cn } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

// 🔹 Define types
interface Product {
  _id: string;
  title: string;
  imageUrl: string;
  price?: number;
  popular?: boolean;
  offer?: {
    exp: number;
    value: number;
  };
}

interface PopulateProps {
  data?: Product[];
  more?: boolean;
  bg?: string;
}

const Populate = ({ data = [], more = false, bg }: PopulateProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [change, setChange] = useState(false);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDown(true);
    setChange(true);
    if (ref.current) {
      setStartX(e.pageX - ref.current.offsetLeft);
      setScrollLeft(ref.current.scrollLeft);
    }
  };

  const onMouseFalse = () => {
    setIsDown(false);
    setChange(true);
  };

  const onMouseLeave = () => {
    if (!isDown) return;
    setIsDown(false);
    setChange(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 3;
    ref.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!change && ref.current) {
        ref.current.scrollLeft -= 2;
      }
    }, 100);
    return () => clearInterval(interval);
  }, [change]);

  const { setProducts } = useProductsContext();

  useEffect(() => {
    setProducts(data);
  }, [data]);

  return (
    <div
      className={cn(
        'light:bg-[#f0f0f088] rounded mx-1 mt-1',
        more ? 'bg-[#222]' : 'dark:bg-background',
        bg
      )}>
      <GOBACK />
      <div className="flex items-center gap-1 pl-2">
        <p className={"p-4 pb-5 font-light"}>
          {!more ? 'محبوب ترین' : 'بیشتر'}
        </p>
        <div className="w-fill border flex-1 h-0 border-[#444] rounded mt-1 ml-4"></div>
      </div>
      <div
        onScroll={() => {}}
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          marginInline: 10,
          minHeight: 100,
        }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseFalse}
        onMouseMove={onMouseMove}
        onTouchMove={onMouseFalse}
        onMouseLeave={onMouseLeave}
        ref={ref}>
        {data?.map(
          (item) =>
            (more || item.popular) && (
              <div
                key={item._id}
                className="w-80 min-w-80"
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  height: 160,
                  marginBlock: 8,
                  userSelect: 'none',
                }}>
                <Image
                  draggable="false"
                  src={`/media/product?url=${item.imageUrl}`}
                  alt={item.title}
                  width={370}
                  height={160}
                  className="rounded-t-lg max-h-full min-w-full"
                />
                <Link
                  draggable="false"
                  className="select-none"
                  href={`/product/${item._id}`}>
                  <div
                    className="absolute bottom-0 h-7 bg-slate-400 bg-opacity-20 backdrop-blur z-30 w-full flex justify-between p-3 px-4 items-center rounded-sm text-sm text-[#ccc]">
                    <p className={fontSans.className}>{item.title}</p>
                    <div className="relative">
                      <p className="text-xs text-danger-700 -left-1 -top-2.5 absolute decoration-danger-400 line-through">
                        {item.offer?.exp &&
                        item.offer.exp > new Date().getTime()
                          ? Number(item.price).toLocaleString('fa') + 'ت'
                          : ''}
                      </p>
                      <p>
                        {item.price
                          ? Number(
                              !item.offer?.exp ||
                              item.offer.exp <= new Date().getTime()
                                ? item.price
                                : item.price -
                                  (item.price / 100) * item.offer.value
                            ).toLocaleString('fa') + ' ت'
                          : 'رایگان'}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            )
        )}
      </div>
      {!more && (
        <div className="border-b-2 mt-7 p-2 m-auto border-[#203] shadow-[#8587] shadow-sm divide-y-medium w-[88%] rounded-xl" />
      )}
      <br />
    </div>
  );
};

export default Populate;

// GOBACK Component
const GOBACK = () => {
  const pathname = usePathname();
  useEffect(() => {
    let count = 0;

    const handleBackButton = (event: PopStateEvent) => {
      if (pathname === '/') {
        event.preventDefault();
        count++;
        setTimeout(() => {
          count = 0;
        }, 2000);
        if (count === 1) {
          toast.dark('برای خروج دوباره کلیک کنید', {
            position: 'bottom-center',
            hideProgressBar: true,
            autoClose: 3000,
            closeButton: false,
            className:
              'rounded-lg text-center w-[210px] mx-auto -mt-5',
          });
        }
        history.pushState({}, '');
      }
    };

    if (
      navigator?.userAgent?.match(/Android|iPhone|iPod|Blackberry|Mobile|Tablet/i) &&
      (window.matchMedia('(display-mode:standalone)').matches ||
        window.matchMedia('(display-mode:fullscreen)').matches)
    ) {
      history.pushState({}, '');
      window.addEventListener('popstate', handleBackButton);
    }

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [pathname]);

  return null;
};