'use client';

import { Button } from '@nextui-org/react';
import StarRating from '@/components/product/StarRating';
import SendComment from './SendComment';

export default function Comments() {
   return (
      <div className="w-full flex flex-col h-[400px] overflow-auto">
         <div className="w-full h-10 border flex justify-between items-center px-4">
            <p className="text-sm ">نظرات کاربران:</p>

            <div className="flex justify-center ">
               <StarRating rating={5} />
            </div>

            <Button variant="bordered" color="primary" size="sm" className="scale-90 px-4 xl:hidden ">
               ارسال نظر
            </Button>
         </div>

         <div className="w-full flex flex-col h-[400px] overflow-auto overflow-x-hidden xl:flex-row  ">
            <div className="w-full h-full flex flex-col gap-4 p-3">
               {Array.from({
                  length: 10
               }).map((item, index) => (
                  <div className="w-full min-h-36 border rounded max-w-[1000px] ml-auto"></div>
               ))}
            </div>

            <SendComment />
         </div>
      </div>
   );
}
