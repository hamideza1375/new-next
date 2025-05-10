'use client';
import Image from "next/image";

export default function _Banner() {
    return (
        <div className="w-full flex gap-4 h-auto flex-wrap bg-purple-50 py-2 ">
            <div className="flex flex-1 border-2 rounded relative h-72 min-w-80">
                <Image alt="" src="/image/baner1.png" fill className="rounded" />
            </div>
            <div className="flex flex-1 border-2 rounded relative h-72 min-w-80">
                <Image alt="" src="/image/baner2.png" fill className="rounded" />
            </div>
        </div>
    );
}
