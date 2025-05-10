'use client'

import { Button } from "@nextui-org/react";
import Image from "next/image";

export default function ProductInfo() {
    // ProductDetait
    return (
        <div className="w-full flex border flex-wrap">
            <div className="flex flex-col w-24 gap-4 items-center justify-around max-[385px]:flex-row max-[385px]:w-full ">
                <Image width={60} height={60} src="/image/c2.png" alt='' />
                <Image width={60} height={60} src="/image/c2.png" alt='' />
                <Image width={60} height={60} src="/image/c2.png" alt='' />
            </div>

            <div className="flex flex-col relative h-72 min-w-72 flex-grow ">
                <Image fill src={'/image/a.png'} alt='' />
            </div>

            <div className="gap-2 flex flex-col w-60 max-sm:w-auto items-center justify-between p-3 py-5 ">
                <p className="text-center font-serif font-bold text-lg leading-8 ">
                    {`این محصول از خوانوتادهی بذبلصسبی لخاتالصبص لالالن ساسبصق لالس ثیتثهلختب صتاثللثع باباث
                      این محصول از خوانوتادهی بذبلصسبی لخاتالصبص لالالن ساسبصق لالس ثیتثهلختب صتاثللثع باباث
                      این محصول از خوانوتادهی بذبلصسبی لخاتالصبص لالالن ساسبصق لالس ثیتثهلختب صتاثللثع باباث`.slice(
                        0,
                        180
                    ) + '...'}
                </p>

                <Button variant="shadow" color="primary" className="min-w-32">
                    خرید
                </Button>
            </div>
        </div>
    );
}