import { CurrencyDollarIcon } from '@heroicons/react/24/solid';
import { Card, CardBody } from '@nextui-org/react';
import { useEffect, useState } from 'react';

interface Transaction {
  date: string;
  price: number;
}

interface CardBalance1Props {
  data?: Transaction[];
}

export const CardBalance1 = ({ data = [] }: CardBalance1Props) => {
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const calculatedTotal = data.reduce((accumulator, currentValue) => {
      const d = new Date(currentValue.date);
      if (d.getTime() >= new Date().getTime() - 60000 * 60 * 24) {
        return accumulator + currentValue.price;
      }
      return accumulator;
    }, 0);
    setTotal(calculatedTotal);
  }, [data]);

  return (
    <Card className="xl:max-w-sm min-h-[49%] bg-primary rounded-xl shadow-md px-3 w-full">
      <CardBody className="py-5 overflow-hidden">
        <div className="flex gap-2.5">
          <CurrencyDollarIcon className="w-5 h-5 text-white" />
          <div className="flex flex-col">
            <span className="text-white">جمع خرید روزانه</span>
          </div>
        </div>
        <div className="flex gap-2.5 py-2 items-center">
          <span className="text-white text-xl font-semibold">
            {Number(total).toLocaleString()} تومان
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="font-semibold text-xs text-white">روز قبل</span>
          <div>
            <span className="text-xs text-white">...</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};