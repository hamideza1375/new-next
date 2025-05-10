'use client';
import { axios } from '@/services/config/axios';
import { useEffect, useState } from 'react';
import { CardAgents } from './card-agents';
import { CardBalance1 } from './card-balance1';
import { CardBalance2 } from './card-balance2';
import { CardTransactions } from './card-transactions';
import { VictoryTooltip } from './VictoryTooltip';

interface ChartData {
  date: string;
  price: number;
}

interface DashboardResponse {
  chart: ChartData[];
  usersLength: number;
}

export const Content = () => {
  const [userLength, setUserLength] = useState<number>(0);
  const [payments, setPayments] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get<DashboardResponse>('/dashboard/charts');
        setUserLength(data.usersLength);
        setPayments(data.chart);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Consider adding error state handling here
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-full lg:px-6 overflow-auto">
      <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
        <div className="mt-1 gap-6 flex flex-col w-full">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold">خرید ها</h3>
            <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-2 2xl:gap-0 gap-5 justify-center w-full">
              <CardBalance1 data={payments} />
              <CardBalance2 data={payments} />
            </div>
          </div>

          <div className="h-full flex flex-col gap-2">
            <h3 className="text-xl font-semibold">نمودار</h3>
            <div className="w-full bg-default-50 shadow-lg rounded-2xl p-6 h-[425px] max-2xl:h-[270px]">
              <VictoryTooltip data={payments} />
            </div>
          </div>
        </div>

        <div className="mt-1 gap-2 flex flex-col xl:max-w-md w-full">
          <h3 className="text-xl font-semibold">کاربران</h3>
          <div className="flex flex-col justify-center gap-4 flex-wrap md:flex-nowrap md:flex-col">
            <CardAgents userLength={userLength} />
            <CardTransactions />
          </div>
        </div>
      </div>
    </div>
  );
};