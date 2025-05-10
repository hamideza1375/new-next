'use client';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();

    return (
        <main className="flex h-full flex-col items-center justify-center gap-2 min-h-[180px] ">
            <h2 className="text-xl font-semibold">404 Not Found</h2>
            <p>صفحه ی مورد نظر پیدا نشد</p>
            <p onClick={() => router.replace('/')}
                className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400 cursor-pointer ">
                صفحه اصلی
            </p>
        </main>
    );
}
