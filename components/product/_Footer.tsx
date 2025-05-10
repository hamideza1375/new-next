import { PaperAirplaneIcon } from '@heroicons/react/16/solid';
import { AcmeLogo } from './icons/AcmeLogo';
import { Instagram } from './icons/Instagram';
import Image from 'next/image';
import Link from 'next/link';

export default function _Footer() {
    return (
        <footer className="w-full flex flex-col min-h-72 mt-auto bg-gray-800 rounded ">
            <div
                dir="ltr"
                className="flex min-w-full h-full text-white justify-between px-6 pt-10 pb-2 flex-wrap ">
                <div className="flex min-w-full h-full justify-between ">
                    <div className="flex flex-col justify-between">
                        <div className="p-2 pl-1 flex items-center ">
                            <p className="font-bold text-inherit ">BRAND</p>
                            <AcmeLogo />
                        </div>

                        <div className="justify-start gap-5 hidden max-sm:flex">
                            <PaperAirplaneIcon className="border border-gray-800 bg-sky-500 rounded-3xl p-1 w-10 h-10 -rotate-[63deg] cursor-pointer" />
                            <div className="w-10 h-10 rounded-full bg-pink-600 flex justify-center items-center  ">
                                <Instagram className="w-8 h-8" />
                            </div>
                        </div>

                        <div className="flex gap-6 items-center max-sm:scale-95 ">
                            <Image alt="" src="/image/c2.png" width={55} height={30} />
                            <Image alt="" src="/image/c1.svg" className="mt-4" width={55} height={30} />
                        </div>
                    </div>

                    <div className="justify-center gap-5 w-72 h-16 hidden sm:flex ">
                        <PaperAirplaneIcon className="border border-gray-800 bg-sky-500 rounded-3xl p-1 w-11 h-11 -rotate-[63deg] cursor-pointer" />
                        <div className="w-11 h-11 rounded-full bg-pink-600 flex justify-center items-center  ">
                            <Instagram className="w-9 h-9" />
                        </div>
                    </div>

                    <div className="flex flex-col justify-between pr-2">
                        <div className="text-right ">
                            <h3 className="text-lg font-semibold">لینک‌های مهم</h3>
                            <ul className="mt-2">
                                <li>
                                    <Link href="/popular" className="hover:underline">
                                        محبوب‌ترین
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/discounts" className="hover:underline">
                                        تخفیف‌ها
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about" className="hover:underline">
                                        درباره ما
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="hover:underline">
                                        قوانین سایت
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="flex gap-0.5 text-right pb-4 max-sm:-mr-1 ">
                            <p>۰۹۱۵۴۷۲۴۵۶۷</p>
                            <p>:تلفن</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
