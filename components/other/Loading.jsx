'use client';
import { Spinner } from '@nextui-org/react';
import { Portal } from './Portal';
import { useEffect, useState } from 'react';

let inter
export function Loading({ show }) {
    const [disable, setdisable] = useState(false);

    useEffect(() => {
        setdisable(false);
        if (show) inter = setTimeout(() => {setdisable(true);}, 12000);
        return()=>{setdisable(false); inter && clearInterval(inter)}
    }, [show]);

    return (
        Boolean(show) &&
        !disable && (
            <Portal>
                <div
                    style={{
                        position: 'fixed',
                        top: 10,
                        zIndex: 1000,
                        alignSelf: 'center',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                    <Spinner color="info" />
                </div>
            </Portal>
        )
    );
}
