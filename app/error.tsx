'use client';
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        console.log(error);
    }, [error]);

    return (
        <Card className="mt-8 w-[700px] max-w-[95%] min-w-[290px] mx-auto ">
            <CardHeader className="text-center flex justify-center text-danger-500 text-lg">
                خطای غیر منتظره ای رخ داد
            </CardHeader>
            <CardBody>
                <Button variant="bordered" color="primary" className="" onClick={() => reset()}>
                    تلاش مجدد
                </Button>
            </CardBody>
        </Card>
    );
}
