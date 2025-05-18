'use client'
import { Button, Checkbox, Input } from "@nextui-org/react";
import Link from "next/link";

export default function Login() {
    return (
        <div className="w-full flex flex-col flex-1 items-center ">
            <form className="flex flex-col w-96 h-[450px] mt-12 gap-6 backdrop-blur-3xl backdrop-invert backdrop-opacity-40 shadow-md bg-purple-100 bg-opacity-50 p-10 rounded " >
               
            <h1 className="font-serif mx-auto text-2xl -mt-2 " >ورود</h1>


                <Input variant="faded" className="rounded"/>
                <Input variant="faded" className="rounded"/>
                <Input variant="faded" className="rounded"/>
                
                <div className="flex gap-0.5 items-center" >
                <Checkbox />
                <p className="font-serif" >به خاطر سپردن</p>
                </div>

                <Link className="text-blue-500" href='' >فراموشی رمز ورود</Link>
                <Button color="secondary" >ارسال</Button>
            </form>
        </div>
    );
}
