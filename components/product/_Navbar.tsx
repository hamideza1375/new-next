'use client'
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@nextui-org/react';
import Link from 'next/link';
import {useState} from 'react';
import {AcmeLogo} from './icons/AcmeLogo'

export default function _Navbar() {

	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	const menuItems = ['محصولات', 'تخفیف ها', 'محبوب و پرفروش', 'ارتباط با ما', 'مجوز ها ی ما', 'خروج'];


	return <Navbar
		 classNames={{
			  wrapper: ['min-w-full', 'justify-between']
		 }}
		 dir="rtl"
		 className="border-b-2"
		 onMenuOpenChange={setIsMenuOpen}>
		 <NavbarContent>
			  <NavbarMenuToggle
					aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
					className="sm:hidden" />
			  <NavbarBrand>
					<AcmeLogo />
					<p className="font-bold text-inherit ">BRAND</p>
			  </NavbarBrand>
		 </NavbarContent>

		 <NavbarContent className="hidden md:flex gap-5 font-serif -mr-12 ml-6 " justify="center">
			  <NavbarItem>
					<Link color="foreground" href="#">
						 محصولات
					</Link>
			  </NavbarItem>
			  <NavbarItem isActive>
					<Link href="#" aria-current="page">
						 تخفیف ها
					</Link>
			  </NavbarItem>
			  <NavbarItem>
					<Link color="foreground" href="#">
						 محبوب و پرفروش
					</Link>
			  </NavbarItem>
		 </NavbarContent>

		 <NavbarMenu>
			  {menuItems.map((item, index) => (
					<NavbarMenuItem key={`${item}-${index}`}>
						 <Link
							  color={index === 2
									? 'primary'
									: index === menuItems.length - 1
										 ? 'danger'
										 : 'foreground'}
							  className="w-full font-sans text-[16px]"
							  href="#">
							  {item}
						 </Link>
					</NavbarMenuItem>
			  ))}
		 </NavbarMenu>

		 <NavbarContent as="div" className="items-center" justify="end">
			  <Input
					classNames={{
						 base: 'max-w-full sm:max-w-[22rem] h-10 -mr-2 ml-2 ',
						 mainWrapper: 'h-full',
						 input: 'text-small',
						 inputWrapper: 'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20'
					}}
					placeholder="جستجو..."
					size="sm"
					startContent={<MagnifyingGlassIcon className="w-5" />}
					type="search" />
			  <Dropdown placement="bottom-end">
					<DropdownTrigger>
						 <Avatar
							  isBordered
							  as="button"
							  className="transition-transform"
							  color="secondary"
							  name="Jason Hughes"
							  size="sm"
							  src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
					</DropdownTrigger>
					<DropdownMenu aria-label="Profile Actions" variant="flat">
						 <DropdownItem key="profile" className="h-14 gap-2">
							  <p className="font-semibold">Signed in as</p>
							  <p className="font-semibold">zoey@example.com</p>
						 </DropdownItem>
						 <DropdownItem key="settings">My Settings</DropdownItem>
						 <DropdownItem key="team_settings">Team Settings</DropdownItem>
						 <DropdownItem key="analytics">Analytics</DropdownItem>
						 <DropdownItem key="system">System</DropdownItem>
						 <DropdownItem key="configurations">Configurations</DropdownItem>
						 <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
						 <DropdownItem key="logout" color="danger">
							  Log Out
						 </DropdownItem>
					</DropdownMenu>
			  </Dropdown>
		 </NavbarContent>

		 {/* or */}

		 {/* <Button as={Link} color="primary" href="#" variant="flat">
					ورود/ثبت نام
			  </Button> */}
	</Navbar>;
}