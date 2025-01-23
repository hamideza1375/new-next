export const normalizeData = (array=[], dt, id) => {
    // ایجاد یک شیء جدید که کلیدهای آن شناسه‌های عناصر آرایه ورودی هستند
    const newArray = array.reduce((acc, curr) => {
        acc[curr._id] = curr;
        return acc;
    }, {});

    // باشد، عنصر با شناسه مشخص شده را حذف می‌کند null برابر dt اگر
    if (dt === null) delete newArray[id] ? newArray[id] : {};
    // در غیر این صورت، اگر شناسه مشخص شده باشد، عنصر را به‌روزرسانی می‌کند
    else if (id) newArray[id] = dt;

    // بازگرداندن مقادیر شیء به صورت آرایه
    return Object.values(newArray);
};

// const target = { a: 1, b: 2 };
// const source = { b: 4, c: 5 };

// const returnedTarget = Object.assign(target, source);

 // Result:
 // target: { a: 1, b: 4, c: 5 }
 // returnedTarget: { a: 1, b: 4, c: 5 }

 ///////////////////////////////////////////

// const target = { a: 1, b: 2 };
// const source = { b: 4, c: 5 };

// const returnedTarget = { ...target, ...source };

// Result:
// target: { a: 1, b: 4, c: 5 }
// returnedTarget: { a: 1, b: 4, c: 5 }