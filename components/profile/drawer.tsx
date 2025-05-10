'use client';
import Navbar from '@/components/sign/navbar';
import { HomeModernIcon } from '@heroicons/react/16/solid';
import { Listbox, ListboxItem, cn } from '@nextui-org/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';

interface DrawerProps {
  children: React.ReactNode;
}

export const _Drawer = ({ children }: DrawerProps) => {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    // Initialize with actual window width
    setWindowWidth(window.innerWidth);
    setIsOpen(window.innerWidth >= 768);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsOpen(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDrawer = () => setIsOpen(prevState => !prevState);

  return (
    <>
      <Navbar 
        onClick={toggleDrawer} 
        style={{
          backgroundColor: '#cae9', 
          boxShadow: '1px 1px 2px #ccca'
        }} 
      />
      <div dir="rtl" className="w-full h-[calc(100vh_-_58px)] flex">
        <Drawer
          zIndex={windowWidth >= 768 ? -1 : 10}
          overlayOpacity={windowWidth >= 768 ? 0 : 0.2}
          open={isOpen}
          onClose={windowWidth >= 768 ? () => {} : toggleDrawer}
          direction="left"
          style={{ boxShadow: '1px 1px 2px #ddd' }}
        >
          <_List />
        </Drawer>
        <div className="flex flex-col flex-1 p-1 min-h-full overflow-auto">
          {children}
        </div>
        <div className="w-[250px] flex h-full max-md:hidden"></div>
      </div>
    </>
  );
};

function _List() {
  const iconClasses = 'text-xl text-default-500 pointer-events-none flex-shrink-0 w-6 h-6';
  const pathname = usePathname();

  interface MenuItem {
    key: string;
    href: string;
    title: string;
    showDivider?: boolean;
    isDanger?: boolean;
  }

  const menuItems: MenuItem[] = [
    { key: 'spacer', href: '#', title: '', showDivider: false },
    { key: 'profile', href: '/profile', title: 'پروفایل', showDivider: false },
    { key: 'pre-purchases', href: '/profile/pre-purchases', title: 'خرید های قبل', showDivider: false },
    { key: 'tickets', href: '/profile/tickets', title: 'صندوق تیکت‌ها', showDivider: false },
    { key: 'send-ticket', href: '/profile/tickets/send', title: 'ارسال تیکت', showDivider: false },
    { 
      key: 'change-characteristics', 
      href: '/profile/change-characteristics', 
      title: 'تغییر مشخصات', 
      showDivider: true 
    },
    { 
      key: 'logout', 
      href: '/profile/logout', 
      title: 'خروج از حساب', 
      isDanger: true 
    },
  ];

  return (
    <Listbox variant="bordered" aria-label="منوی ناوبری" className="flex flex-col gap-9">
      {menuItems.map((item) => (
        <ListboxItem
          key={item.key}
          as={Link}
          href={item.href}
          className={cn(
            'rounded-xl w-[95%] font-bold p-2.5',
            item.isDanger 
              ? 'text-danger' 
              : 'text-[#ccc] hover:bg-default-100',
            !item.isDanger && pathname === item.href && 'bg-cyan-300 text-white'
          )}
          color={item.isDanger ? 'danger' : 'default'}
          showDivider={item.showDivider}
          startContent={
            item.href !== '#' && (
              <HomeModernIcon 
                className={cn(
                  iconClasses,
                  item.isDanger 
                    ? 'text-danger' 
                    : pathname === item.href 
                      ? 'text-[#79b]' 
                      : 'text-default-500'
                )} 
              />
            )
          }
        >
          {item.title}
        </ListboxItem>
      ))}
    </Listbox>
  );
}