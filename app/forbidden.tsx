'use client';

import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

export default function Forbidden() {
   const router = useRouter();

   const handleGoBack = () => {
      router.back(); // بازگشت به صفحه قبلی
   };

   const handleGoHome = () => {
      router.push('/'); // رفتن به صفحه اصلی
   };

   return (
      <Card className="mt-8 w-[700px] max-w-[95%] min-w-[290px] mx-auto">
         <CardHeader className="text-center flex justify-center text-danger-500 text-lg">
            دسترسی ممنوع (403 Forbidden)
         </CardHeader>
         <CardBody className="flex flex-col gap-4 items-center">
            <p className="text-gray-600 text-center">شما مجوز دسترسی به این صفحه را ندارید.</p>
            <div className="flex gap-3">
               <Button variant="bordered" color="primary" onClick={handleGoBack}>
                  بازگشت
               </Button>
               <Button color="primary" onClick={handleGoHome}>
                  برو به صفحه اصلی
               </Button>
            </div>
         </CardBody>
      </Card>
   );
}
