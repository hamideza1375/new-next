import { imagePicker } from '@/utils/imagePicker';
import truncate from '@/utils/truncate';
import { FilmIcon } from '@heroicons/react/24/solid';
import { cn } from '@nextui-org/react';
import { useState } from 'react';

export const FileInput2 = ({ setFile, defaultValue, mediaType, select, className, label, Icon, setTime }) => {
    const [_file, _setFile] = useState('');

    return (
        <>
            <label
                onClick={async () => {
                    const res = await imagePicker(mediaType);
                    setFile(res);
                    _setFile(res);
                    setTime && handleSetTime(res, setTime)
                }}
                className={cn(
                    select && _setFile && !_file ? 'border-danger' : 'border-stone-900',
                    'gap-2 cursor-pointer border rounded p-2 pr-3 w-3/4 bg-[#262629ee] flex flex-col ',
                    className
                )}>
                <h6 className="text-xs text-stone-400 ">{label}</h6>
                <span className="flex">
                    {Icon ? Icon : <FilmIcon className="w-6 ml-0.5" />}
                    <span className="text-sm text-stone-300 pr-1 ">
                        {_file?.name ? truncate(_file.name, 12) : defaultValue ? defaultValue.slice(0, 12) : 'انتخاب فایل'}
                    </span>
                </span>
            </label>
        </>
    );
};


async function handleSetTime (input, setTime) {
    if (input.type.startsWith('video/')) {
      const url = URL.createObjectURL(input);
      const video = document.createElement('video');
      video.src = url;
  
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
      });
  
      const videoDuration = video.duration
      setTime(videoDuration);
    }
  };