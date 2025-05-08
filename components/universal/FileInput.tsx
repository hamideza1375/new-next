import { ChangeEvent, useState } from 'react';
import { FilmIcon } from '@heroicons/react/24/solid';
import { cn } from '@nextui-org/react';
import { imagePicker } from '@/utils/imagePicker';
import truncate from '@/utils/truncate';

interface FileInputProps {
  setFile: (file: File) => void;
  defaultValue?: string;
  mediaType: 'photo' | 'video' | 'audio' | 'zip' | 'rar' | 'pdf';
  select?: boolean;
  className?: string;
  label: string;
  Icon?: React.ReactNode;
  setTime?: (duration: number) => void;
}

async function handleSetTime(input: File, setTime: (duration: number) => void): Promise<void> {
  if (input.type.startsWith('video/')) {
    const url = URL.createObjectURL(input);
    const video = document.createElement('video');
    video.src = url;

    await new Promise<void>((resolve) => {
      video.onloadedmetadata = () => resolve();
    });

    const videoDuration = video.duration;
    setTime(videoDuration);
    URL.revokeObjectURL(url); // Clean up
  }
}

export const FileInput = ({
  setFile,
  defaultValue = '',
  mediaType,
  select,
  className,
  label,
  Icon,
  setTime
}: FileInputProps) => {
  const [_file, _setFile] = useState<File | null>(null);

  const handleFileSelect = async () => {
    try {
      const file = await imagePicker(mediaType);
      setFile(file);
      _setFile(file);
      if (setTime) {
        await handleSetTime(file, setTime);
      }
    } catch (error) {
      console.error('Error selecting file:', error);
    }
  };

  return (
    <label
      onClick={handleFileSelect}
      className={cn(
        select && _file === null ? 'border-danger' : 'border-stone-900',
        'gap-2 cursor-pointer border rounded p-2 pr-3 w-3/4 bg-[#262629ee] flex flex-col',
        className
      )}
    >
      <h6 className="text-xs text-stone-400">{label}</h6>
      <span className="flex">
        {Icon ? Icon : <FilmIcon className="w-6 ml-0.5" />}
        <span className="text-sm text-stone-300 pr-1">
          {_file?.name 
            ? truncate(_file.name, 12) 
            : defaultValue 
              ? truncate(defaultValue, 12) 
              : 'انتخاب فایل'}
        </span>
      </span>
    </label>
  );
};