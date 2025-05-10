'use client'
import { Button, Checkbox, Chip, Input } from "@nextui-org/react";
import { LoadCanvasTemplateNoReload, loadCaptchaEnginge, validateCaptcha } from 'react-simple-captcha';

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ChangeCharacteristics() {

    const [captchaValue, setCaptchaValue] = useState('');
    const [reload, setReload] = useState(false);

    useEffect(() => {
        loadCaptchaEnginge(4, '#fff', '#000', 'lower');
        setCaptchaValue('');
    }, [reload]);

   const onSubmit =()=>{
        if (validateCaptcha(captchaValue, false)) {}
    }

    return (
        <div className="w-full flex flex-col flex-1 items-center justify-center ">
            <form className="flex flex-col w-96 h-[450px] -mt-10 gap-6 backdrop-blur-3xl backdrop-invert backdrop-opacity-40 shadow-md bg-purple-100 bg-opacity-50 p-10 rounded " >
               
            <h1 className="font-serif mx-auto text-2xl -mt-2 " >ورود</h1>


                <Input variant="faded" className="rounded"/>
                <Input variant="faded" className="rounded"/>


                <div className="flex flex-row-reverse items-center gap-2 self-start ">
                    <LoadCanvasTemplateNoReload reloadText="↻" reloadColor="silver" />

                    <Chip className="cursor-pointer" onClick={() => setReload(r => !r)}>
                        ↻
                    </Chip>

                    <Input className='text-sm'
                        value={captchaValue}
                        autoComplete="off"
                        maxLength={4}
                        type="text"
                        placeholder="کد روبرو را وارد کنید"
                        onChange={event => setCaptchaValue(event.target.value)}
                        isInvalid={(captchaValue?.length == 4 || !captchaValue?.length ) ? !validateCaptcha(captchaValue, false) : false}
                    />
                </div>
                
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
