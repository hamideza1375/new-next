"use client"
import { HomeIcon } from "@heroicons/react/24/solid";
import { Navbar as _Navbar, NavbarBrand } from "@nextui-org/react";

export default function Navbar(props: any) {
	return (
	  <_Navbar style={{backgroundColor:'#dbf3',boxShadow:'1px 1px 2px #ccca', height: 58}} className='backdrop-invert backdrop-blur-3xl backdrop-opacity-40 ' classNames={{ wrapper: ['min-w-full', 'justify-between']}} {...props}>
		 <NavbarBrand >
			<HomeIcon className='w-6 h-6' />
			<p className="font-bold text-inherit mt-1.5 mr-1">ACME</p>
		 </NavbarBrand>
 
	  </_Navbar>
	);
 }