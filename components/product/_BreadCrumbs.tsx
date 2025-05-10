import { BreadcrumbItem, Divider } from "@nextui-org/react";
import Link from "next/link";

export default function _BreadCrumbs() {
	return (
		<>
		<Divider/>
		<div className="w-full h-2 bg-purple-100" ></div>
		 <div className="flex justify-center gap-3 p-2 bg-pink-400 bg-opacity-20 backdrop-invert backdrop-opacity-20 rounded ">
				<Link className="border border-[#a7a] text-[#607] p-[1px] pb-0 pt-[2.5px] box-content w-12 text-center text-[13px] bg-[#eee4] rounded-[3px] " as={BreadcrumbItem as any} href='/products/1' >شال</Link>
				<Link className="border border-[#fff] text-white p-[1px] pb-0 pt-[2px] box-content w-12 text-center text-[13px] bg-[#222] rounded-[3px] " as={BreadcrumbItem  as any} href='/products/1' >روسری</Link>
				<Link className="border border-[#a7a] text-[#607] p-[1px] pb-0 pt-[2.5px] box-content w-12 text-center text-[13px] bg-[#eee4] rounded-[3px] " as={BreadcrumbItem  as any} href='/products/1' >چادر</Link>
				<Link className="border border-[#a7a] text-[#607] p-[1px] pb-0 pt-[2.5px] box-content w-12 text-center text-[13px] bg-[#eee4] rounded-[3px] " as={BreadcrumbItem  as any} href='/products/1' >عینک</Link>
				<Link className="border border-[#a7a] text-[#607] p-[1px] pb-0 pt-[2.5px] box-content w-12 text-center text-[13px] bg-[#eee4] rounded-[3px] " as={BreadcrumbItem  as any} href='/products/1' >کفش</Link>
		 </div>
		</>
	);
}

