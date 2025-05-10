import { CurrencyDollarIcon } from '@heroicons/react/24/solid';
import { Card, CardBody } from '@nextui-org/react';
import { useEffect, useState } from 'react';

interface Transaction {
  date: string;
  price: number;
}

interface CardBalance2Props {
  data?: Transaction[];
}

export const CardBalance2 = ({ data = [] }: CardBalance2Props) => {
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const monthlyTotal = data.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.price;
    }, 0);
    setTotal(monthlyTotal);
  }, [data]);

  return (
    <Card className="xl:max-w-sm min-h-[49%] bg-success rounded-xl shadow-md px-3 w-full">
      <CardBody className="py-5 overflow-hidden">
        <div className="flex gap-2.5">
          <CurrencyDollarIcon className="w-5 h-5 text-white" />
          <div className="flex flex-col">
            <span className="text-white">جمع خرید ماهانه</span>
          </div>
        </div>
        <div className="flex gap-2.5 py-2 items-center">
          <span className="text-white text-xl font-semibold">
            {Number(total).toLocaleString()} تومان
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="font-semibold text-xs text-white">ماه قبل</span>
          <div>
            <span className="text-xs text-white">...</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};