'use clien'

import { Button, Textarea } from "@nextui-org/react";
import SetStar from '@/components/product/SetStar';

export default function SendComment() {
	 return (
		  <div className="flex flex-col h-[350px] w-[90%] border m-2 rounded max-xl:hidden ">
				<form dir="rtl" className="flex flex-col gap-6 pt-10 h-full px-6 ">
					 <Textarea className="text-right" placeholder="پیام..." variant="bordered" />

					 <div className="flex justify-center">
						{/* <SetStar/> */}
					 </div>

					 <Button className="">ارسال</Button>
				</form>
		  </div>
	 );
}