'use client';
import useUser from '@/hook/custom/useUser';
import { PlayIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { cn } from '@nextui-org/react';
const controllStyle = typeof window !== 'undefined' && (!navigator?.userAgent?.match(/Android|iPhone|iPod|Blackberry|Mobile|Tablet/i)) ? import('./VideoComponent.css').then((m) => m.default): null;

function Video({
    className,
    controls = true,
    style,
    controlsList = 'nodownload',
    poster = '/poster.jpg',
    // preload = 'metadata',
    src,
    ID,
    videoUrl
}) {
    const [controller, setcontroller] = useState(false);
    const [error, setError] = useState(false);
    const videoRef = useRef();
    const videoContainerref = useRef();

    const user = useUser('token');

    useEffect(() => {
        error && toast.error('اگر در دوره ثبت نام کردین و ویدئو نمایش داده نشد آن را دانلود کنید');
        if (videoRef?.current)
            videoRef.current.oncontextmenu = event => {
                event.preventDefault();
            };
        if (videoContainerref?.current)
            videoContainerref.current.oncontextmenu = event => {
                event.preventDefault();
            };
    }, [controller]);


    useEffect(() => {
        if (((videoRef.current && user?.products && user.products.find(p => p.productId === ID)) || user?.products && user.products.find(p => p.productId === ID) === -1 ) || ID === '667610dcca08b7215a5ba872') {
            videoRef.current.src = src
            if(controller) videoRef.current.autoplay = true
        } else if(videoUrl?.split('_')[videoUrl?.split('_').length - 3] === '1'){
            videoRef.current.src = src
            if(controller) videoRef.current.autoplay = true
        }
    }, [controller]);
    

    const handleClick = () => {
        // if (videoRef.current.paused) {
        //   videoRef.current.play();
        // } else {
        //   videoRef.current.pause();
        // }
        !controller && setcontroller(true)
      };
    

    return (
        <div className="w-full h-full relative flex items-center justify-center">
            {!controller && (
                <div onClick={handleClick} className="text-5xl border-3 border-[#d1d1d1] rounded-lg w-[95px] h-[62px] p-1 absolute flex justify-center items-center ">
                    <PlayIcon className="h-[62px] text-center text-[#d1d1d1]" />
                </div>
            )}
            <div
                onContextMenu={e => e?.preventDefault()}
                ref={videoContainerref}
                className="w-full h-full flex items-center justify-center ">
                <video
                    onClick={handleClick}
                    ref={videoRef}
                    className={cn('video', className)}
                    style={style}
                    controls={controls ? controller : false}
                    onContextMenu={e => e?.preventDefault()}
                    controlsList={controlsList}
                    preload='none'
                    poster={poster}
                    onError={e => {
                        setError(true);
                    }}>
                        <source src={'/Inaccessibility.mp4'} type="video/mp4" />
                </video>
            </div>
        </div>
    );
}

export default Video;
