'use client';
import { Button, Card, CardFooter, CardHeader } from '@nextui-org/react';
import { useState } from 'react';
import {CardBalance1} from '@/components/admin/card-balance1';
import {CardBalance2} from '@/components/admin/card-balance2';
import { VictoryTooltip } from '@/components/admin/VictoryTooltip';



function DashboardCard() {

  const [payments, setpayments] = useState([
    {id:'1', price: 1000000, date:'2023/2/9'},
    {id:'2', price: 1500000, date:'2023/2/9'},
    {id:'3', price: 3500000, date:'2023/2/10'},
    {id:'4', price: 1800000, date:'2023/2/11'},
    {id:'5', price: 6000000, date:'2023/2/12'},
    {id:'6', price: 7900000, date:'2023/2/13'},
    {id:'7', price: 11000000, date:'2023/2/14'},
    {id:'7', price: 9000000, date:'2023/2/15'},
  ])

    return (
        <Card isFooterBlurred className="w-full h-full relative bg-gray-100 ">
            <CardHeader className="h-[68px] bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                <div className="flex flex-grow gap-2 items-center">
                    
						  <div className='w-10 h-12 rounded-full bg-gray-500 flex justify-center items-center ' ><p className='text-white text-3xl mt-1.5' >$</p></div>

                    <div className="flex flex-col">
                        <p className="text-tiny text-white/60">صندوق خرید ها</p>
                        <p className="text-tiny text-white/60">جمع خرید امروز: ۹۴۴.۰۰۰</p>
                    </div>
                </div>
                <Button radius="full" size="sm" className="text-md pt-1">
                    نمایش
                </Button>
            </CardHeader>
            <CardFooter dir="rtl" className="w-full h-full flex justify-center items-center">
                <div
                    dir="rtl"
                    className="h-[470px] max-[1220px]:h-[calc(100vh_-_155px)] max-w-[95%] rounded-lg bg-gray-50 bg-opacity-50 backdrop-grayscale backdrop-blur-3xl shadow-md flex flex-wrap justify-center p-10 overflow-hidden max-[1220px]:overflow-y-auto ">
                    <div className="flex flex-col justify-around w-[300px] max-w-full h-[400px] border-1 border-[#ccc] max-xl:w-[400px] max-[1220px]:h-[300px] ">
                        <CardBalance1 data={payments}/>
                        <CardBalance2 data={payments} />
                    </div>
                    <div className="flex flex-col w-[540px] max-w-full h-[400px] border-1 border-[#ccc] max-xl:w-[400px] max-xl:h-[350px] min-[1220px]:border-r-0">

                    <div className="h-full flex flex-col justify-center items-center">
                        <div className="w-[96%] h-[96%]">
                            <VictoryTooltip data={payments} />
                        </div>
                    </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}


export default function Profile() {
  return (
      <div className="flex flex-1 flex-col">
          <DashboardCard />
      </div>
  );
}
