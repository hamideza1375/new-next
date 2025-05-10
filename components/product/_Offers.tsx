'use client';
import { useRef } from 'react';
import _Card from './_Card';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline';

export default function _Offers() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!scrollRef.current) return;
        
        const startX = e.pageX - scrollRef.current.offsetLeft;
        const scrollLeft = scrollRef.current.scrollLeft;

        const handleMouseMove = (e: MouseEvent) => {
            if (!scrollRef.current) return;
            const x = e.pageX - scrollRef.current.offsetLeft;
            const walk = (x - startX) * 2;
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
            className="bg-danger-400 flex w-full h-96 rounded-md mx-auto select-none flex-nowrap max-sm:flex-col-reverse"
        >
            <div
                ref={scrollRef}
                className="flex flex-nowrap overflow-auto gap-4 p-8 max-sm:p-6 max-sm:pt-1 cursor-grab"
                onMouseDown={handleMouseDown}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="flex">
                        <_Card />
                    </div>
                ))}
            </div>
            <style jsx>{`
                .flex::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            <div className="w-full">
                <div className="flex w-full justify-between max-sm:pt-5 pt-6 px-5 sm:flex-col-reverse h-full">
                    <div className="flex gap-4 h-12 items-center justify-between w-24 pb-4 sm:mb-5 sm:-ml-1 sm:mr-2">
                        <div className="rounded-full bg-pink-500 bg-opacity-20 backdrop-invert backdrop-opacity-20">
                            <ArrowLeftCircleIcon 
                                className="w-11 h-11 text-pink-200 cursor-pointer" 
                                onClick={() => {
                                    if (scrollRef.current) {
                                        scrollRef.current.scrollLeft -= 200;
                                    }
                                }}
                            />
                        </div>
                        <div className="rounded-full bg-pink-500 bg-opacity-20 backdrop-invert backdrop-opacity-20">
                            <ArrowRightCircleIcon 
                                className="w-11 h-11 text-pink-200 cursor-pointer" 
                                onClick={() => {
                                    if (scrollRef.current) {
                                        scrollRef.current.scrollLeft += 200;
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="h-1 rounded-md flex flex-grow sm:hidden"></div>

                    <p className="text-white whitespace-nowrap pb-4 text-right text-2xl font-bold max-sm:text-xl">
                        تخفیف ها
                    </p>
                </div>
            </div>
        </div>
    );
}