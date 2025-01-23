"use client"
import { useState } from "react";

import { AppContext } from "../appContext";


// ContextProvider تعریف کامپوننت
const ContextProvider = ({ children }) => {
    // برای تعداد آیتم‌های سبد خرید state تعریف
    const [cartNumber, setcartNumber] = useState(0);

    // context با مقداردهی به AppContext.Provider بازگرداندن
    return (
        <AppContext.Provider value={{ cartNumber, setcartNumber }}>
            { children }
        </AppContext.Provider>
    );
}

export default ContextProvider;