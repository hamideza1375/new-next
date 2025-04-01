'use client'
import truncate from '@/utils/truncate';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { cn } from '@nextui-org/react';
import { forwardRef } from 'react';

export const FileInput = forwardRef(({ image, setImage, select, className, label, ...props }, ref) => {

    return (
        <div>
            <input
                ref={ref}
                id="file"
                type="file"
                className="hidden"
                onChange={e => {
                    if (e) setImage && setImage(e.target.files[0]);
                }}
                {...props}
            />

            <label
                htmlFor="file"
                className={cn(
                    select && setImage && !image ? 'border-danger' : 'border-stone-900',
                    'gap-2 cursor-pointer border rounded p-2 pr-3 w-3/4 bg-[#262629ee] flex flex-col ',
                    className
                )}>
                <h6 className="text-xs text-stone-400 ">{label}</h6>
                <span className="flex">
                    <PhotoIcon className="w-6 ml-0.5" />
                    <span className="text-sm text-stone-300 pr-1 ">{(image?.name) ? truncate(image.name,12) : 'انتخاب فایل'}</span>
                </span>
            </label>
        </div>
    );
});
FileInput.displayName = 'FileInput';
