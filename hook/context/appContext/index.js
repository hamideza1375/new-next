'use client';
import { createContext, useContext } from 'react';

// با مقادیر پیش‌فرض AppContext جدید به نام context ایجاد یک
export const AppContext = createContext({
    cartNumber: null,
    setcartNumber: () => {}
});
// سفارشی hook ایجاد شده با استفاده از یک context استفاده از
export const useAppContext = () => useContext(AppContext);
