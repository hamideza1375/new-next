import _Navbar from '@/components/product/_Navbar';

export default function RootLayout({ children }) {
    return (
        <div className='w-full min-h-screen flex-col overflow-hidden' >
            <_Navbar />
            <div className="flex w-full h-[calc(100vh_-_65px)] flex-col overflow-auto">{children}</div>;
        </div>
    );
}
