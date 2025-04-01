'use client';
import React, { useEffect } from 'react';
import { Pagination as _Pagination, cn } from '@nextui-org/react';

export default function Pagination({ data, limit, setCurrentPage, currentList, setCurrentList, className }) {
    const totalPages = Math.ceil(data.length / limit);

    useEffect(() => {
        data.length && !currentList.length ? setCurrentList(data.slice(0 * limit, 1 * limit)) : setCurrentList(data);
    }, [data]);

    const handleClick = page => {
        setCurrentPage(page);
        setCurrentList(data.slice((page - 1) * limit, page * limit));
    };

    if (totalPages <= 1) return;

    return (
        <div className={cn(className,"flex relative justify-center z-50")}>
            <_Pagination
                className="flex flex-row-reverse justify-center rtl bg-transparent absolute"
                onChange={handleClick}
                total={totalPages}
                classNames={{
                    wrapper: 'gap-0 rtl overflow-visible h-8 rounded border border-divider bg-transparent',
                    item: 'w-8 h-8 text-small rounded-none bg-transparent',
                    cursor: 'bg-gradient-to-b shadow-lg from-default-500 to-default-800 dark:from-default-300 dark:to-default-100 text-white font-bold',
                    forwardIcon: 'rotate-180 scale-50',
                }}
            />
        </div>
    );
}
