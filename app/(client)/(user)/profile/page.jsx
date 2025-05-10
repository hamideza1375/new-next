'use client';
import { Button, Card, CardFooter, CardHeader } from '@nextui-org/react';
import Image from 'next/image';



function ProfileCard() {
    return (
        <Card isFooterBlurred className="w-full h-full relative bg-gray-100 ">
            <CardHeader className="h-[68px] bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                <div className="flex flex-grow gap-2 items-center">
                    <Image
                        width={40}
                        height={45}
                        alt="Breathing app icon"
                        className="rounded-full w-10 h-11 bg-black"
                        src="/image/b.png"
                    />
                    <div className="flex flex-col">
                        <p className="text-tiny text-white/60">پنل گاربری</p>
                        <p className="text-tiny text-white/60 mt-1">- - - - - - - - - - - - - - - -</p>
                    </div>
                </div>
                <Button radius="full" size="sm" className="text-md pt-1">
                   
                </Button>
            </CardHeader>
            <CardFooter dir="rtl" className="w-full h-full flex justify-center items-center">
                <div
                    dir="rtl"
                    className="h-[470px] max-[1220px]:h-[calc(100vh_-_155px)] max-w-[95%] rounded-lg bg-gray-50 bg-opacity-50 backdrop-grayscale backdrop-blur-3xl shadow-md flex flex-wrap justify-center p-10 overflow-hidden max-[1220px]:overflow-y-auto ">
                    <div className="flex flex-col w-[300px] max-w-full h-[400px] border-1 border-[#ccc] max-xl:w-[400px] max-[1220px]:h-[300px] ">
                        <ImageProfile />
                        <div className="flex gap-4 justify-center pb-2 min-[1220px]:pb-6 min-[1220px]:-mt-4">
                            <div className="w-5 h-5 bg-amber-500 rounded-full"></div>
                            <div className="w-5 h-5 bg-orange-500 rounded-full"></div>
                            <div className="w-5 h-5 bg-green-400 rounded-full"></div>
                            <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex flex-col w-[540px] max-w-full h-[400px] border-1 border-[#ccc] max-xl:w-[400px] min-[1220px]:border-r-0">
                        <_Form />
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}


export default function Profile() {
  return (
      <div className="flex flex-1 flex-col">
          <ProfileCard />
      </div>
  );
}

function ImageProfile() {
    return (
        <Card
            isFooterBlurred
            radius="lg"
            className="border-none flex flex-col items-center justify-center rounded my-auto mx-auto w-[250px] ">
            <Image
                alt="Woman listing to music"
                className="object-fill rounded min-[1220px]:min-h-72"
                height={250}
                src="/image/c.png"
                width={250}
            />
            <CardFooter className="justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-2 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                <p className="text-tiny text-white/80">Available soon.</p>
            </CardFooter>
        </Card>
    );
}

function _Form() {
    return (
        <div className="flex flex-col items-center w-full h-full ">
            <p className="text-xl font-bold py-9">مشخصات</p>

            <div className='w-full mt-3 grid grid-cols-2 justify-center gap-9 pr-5 max-[1280px]:pr-7 max-[1280px]:grid-cols-1 ' >
                <div className='flex gap-1 text-right' ><p className='font-bold text-[17px]' >نام کاربری: </p><p className='text-[16px]'>محمد بالاشی</p></div>
                <div className='flex gap-1 text-right ' ><p className='font-bold text-[16.5px] min-[1220px]:-mr-2' >ایمیل:</p><p className='text-[13px] mt-0.5'>mohamad.hadary74@gmail.com</p></div>
                <div className='flex gap-1 text-right ' ><p className='font-bold text-[17px]' >تلفن: </p><p className='text-[16px]'>۰۹۱۲۹۵۲۵۵۷۶</p></div>
            </div>
        </div>
    );
}
