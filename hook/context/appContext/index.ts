'use client';
import { createContext, useContext, Dispatch, SetStateAction } from 'react';

// تعریف نوع برای مقادیر context
interface AppContextType {
  cartNumber: number | null;
  setcartNumber: Dispatch<SetStateAction<number | null>>;
}

// با مقادیر پیش‌فرض AppContext جدید به نام context ایجاد یک
export const AppContext = createContext<AppContextType>({
  cartNumber: null,
  setcartNumber: () => {}
});

// سفارشی hook ایجاد شده با استفاده از یک context استفاده از
export const useAppContext = () => useContext(AppContext);