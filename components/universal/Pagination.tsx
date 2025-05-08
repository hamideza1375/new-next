'use client';
import React, { useEffect } from 'react';
import { Pagination as _Pagination, cn } from '@nextui-org/react';

// Define the type for your data items (update this according to your actual data structure)
type DataItem = any; // You can replace `any` with a specific interface if needed

interface PaginationProps {
    data: DataItem[];
    limit: number;
    setCurrentPage: (page: number) => void;
    currentList: DataItem[];
    setCurrentList: (list: DataItem[]) => void;
    className?: string;
}

export default function Pagination({
    data,
    limit,
    setCurrentPage,
    currentList,
    setCurrentList,
    className
}: PaginationProps) {
    const totalPages = Math.ceil(data.length / limit);

    useEffect(() => {
        if (data.length && !currentList.length) {
            setCurrentList(data.slice(0 * limit, 1 * limit));
        } else {
            setCurrentList(data);
        }
    }, [data]);

    const handleClick = (page: number) => {
        setCurrentPage(page);
        setCurrentList(data.slice((page - 1) * limit, page * limit));
    };

    if (totalPages <= 1) return null;

    return (
        <div className={cn(className, 'flex relative justify-center z-50')}>
            <_Pagination
                className="flex flex-row-reverse justify-center rtl bg-transparent absolute"
                onChange={handleClick}
                total={totalPages}
                classNames={{
                    wrapper: 'gap-0 rtl overflow-visible h-8 rounded border border-divider bg-transparent',
                    item: 'w-8 h-8 text-small rounded-none bg-transparent',
                    cursor: 'bg-gradient-to-b shadow-lg from-default-500 to-default-800 dark:from-default-300 dark:to-default-100 text-white font-bold',
                    forwardIcon: 'rotate-180 scale-50'
                }}
            />
        </div>
    );
}
