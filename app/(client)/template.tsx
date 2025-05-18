'use client';
import '@/styles/globals.css';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: {children: React.ReactNode;}) {
    const pathname = usePathname();

    return (
        <div
            dir="rtl"
            style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                overflow: 'hidden',
                maxHeight:
                    !pathname.startsWith('/product') || pathname.startsWith('/product/questions')
                        ? 'calc(100vh)'
                        : '100vh',
                overscrollBehavior: 'none',
                overscrollBehaviorBlock: 'none',
                overscrollBehaviorY: 'none'
            }}>
            {children}
        </div>
    );
}
