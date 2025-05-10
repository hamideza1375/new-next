'use client';
import Image from 'next/image';
import Card2 from '@/components/product/Card2';
import _Banner from '@/components/product/_Banner';
import _BreadCrumbs from '@/components/product/_BreadCrumbs';
import _Footer from '@/components/product/_Footer';
import _Offers from '@/components/product/_Offers';
import _Populars from '@/components/product/_Populars';

export default function App() {

    return (
        <div className="flex flex-1 flex-col overflow-scroll overflow-x-hidden px-1 ">

            <div className="w-full relative flex min-h-80 ">
                <div className="w-[65%] relative flex flex-col min-h-72  ">
                    <Image alt="" fill src={'/image/a.png'} />
                </div>
                <div className="w-[35%] relative flex flex-col min-h-72  ">
                    <Image alt="" fill src={'/image/b.png'} />
                </div>
            </div>

            <div className="w-full flex flex-col h-auto ">
                
                {/* <_BreadCrumbs/> */}

                <div className='w-3/4 h-1 -mt-[0.5px] translate-y-[6px] bg-danger-400 rounded-t-[50px] shadow-md shadow-[#900d] mx-auto mb-4' ></div>

                <div className="grid mb-2 grid-flow-row grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 justify-around bg-purple-50 p-5 ">
                    {Array.from({ length: 4 }).map((item, index) => (
                        <Card2 key={index} />
                    ))}
                </div>

                <div className="min-w-full">
                    <_Offers />
                </div>

                <div className="min-w-full">
                    <_Banner />
                </div>

                <div className="min-w-full">
                    <_Populars />
                </div>
            </div>

                <_Footer />
        </div>
    );

    
}
