'use client';
import { useRef } from 'react';
import _Card from './_Card';
import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
// import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline';

export default function _Populars() {
    const scrollRef = useRef(null);

    const handleMouseDown = e => {
        const startX = e.pageX - scrollRef.current.offsetLeft;
        const scrollLeft = scrollRef.current.scrollLeft;

        const handleMouseMove = e => {
            const x = e.pageX - scrollRef.current.offsetLeft;
            const walk = (x - startX) * 2; // مقدار اسکرول را تنظیم کنید
            scrollRef.current.scrollLeft = scrollLeft - walk;
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            draggable={false}
            className="bg-slate-400 flex w-full h-96 rounded-md mx-auto select-none flex-nowrap mb-2 max-sm:flex-col-reverse ">
            <div
                ref={scrollRef}
                className="flex w-full flex-nowrap overflow-auto gap-4 p-8 max-sm:p-6 max-sm:pt-1 cursor-grab"
                onMouseDown={handleMouseDown}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // برای مخفی کردن نوار اسکرول در فایرفاکس
            >
                {Array.from({ length: 12 }).map((item, index) => (
                    <div key={index} className="flex">
                        <_Card />
                    </div>
                ))}
            </div>
            <style jsx>{`
                .flex::-webkit-scrollbar {
                    display: none; // برای مخفی کردن نوار اسکرول در کروم و سایر مرورگرها
                }
            `}</style>

            <div>
                <div className="flex w-full justify-between max-sm:pt-5 pt-6 px-5 sm:flex-col-reverse h-full ">

                    <div className="flex gap-4 h-12 items-center justify-between w-24 pb-4 sm:mb-5 sm:-ml-1 sm:mr-2">
                        <div className="rounded-full bg-slate-500 bg-opacity-20 backdrop-invert backdrop-opacity-20 ">
                            <ArrowLeftCircleIcon className="w-11 h-11 text-slate-200 cursor-pointer" />
                        </div>
                        <div className="rounded-full bg-slate-500 bg-opacity-20 backdrop-invert backdrop-opacity-20">
                            <ArrowRightCircleIcon className="w-11 h-11 text-slate-200 cursor-pointer" />
                        </div>
                    </div>

                    <div className="h-1rounded-md flex flex-grow sm:hidden "></div>

                    <p className="text-white whitespace-nowrap pb-4 text-right text-2xl text-bold max-sm:text-xl ">
                        محبوب ترین
                    </p>
                </div>
            </div>
        </div>
    );
}
