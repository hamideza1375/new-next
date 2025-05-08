import { useRef } from 'react';
import { useForm as useReactHookForm, UseFormReturn, FieldValues, FieldError, UseFormRegister } from 'react-hook-form';

/**
 * هوک سفارشی برای مدیریت فرم‌ها با قابلیت دسترسی به رفرنس فیلدها
 * @returns {Object} آبجکت حاوی متدها و خصوصیات مدیریت فرم
 */
const useForm = <T extends FieldValues = FieldValues>(): {
  get: (key: string) => HTMLInputElement | null;
  register: UseFormRegister<T>;
  handleSubmit: UseFormReturn<T>['handleSubmit'];
  errors: Record<string, FieldError>;
  getValues: UseFormReturn<T>['getValues'];
  watch: UseFormReturn<T>['watch'];
} => {
  // استفاده از useRef برای ذخیره رفرنس فیلدها در یک Map
  const ref = useRef<Map<string, HTMLInputElement>>(new Map());

  // استفاده از هوک useForm از کتابخانه react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch
  } = useReactHookForm<T>();

  /**
   * تابع ثبت فیلد سفارشی با قابلیت ذخیره رفرنس
   * @param {string} fieldName - نام فیلد فرم
   * @param {Object} [options={}] - تنظیمات اعتبارسنجی فیلد
   * @returns {Object} خصوصیات ثبت فیلد
   */
  const _register = (fieldName: string, options = {}) => {
    // ثبت فیلد با متد register اصلی
    const registeredField = register(fieldName as any, options);
    const { ref: innerRef } = registeredField;
    
    // حذف پراپرتی ref از آبجکت برگشتی
    const { ref: _, ...rest } = registeredField;

    return {
      ...rest,
      // اضافه کردن منطق سفارشی برای ذخیره رفرنس
      innerRef: (e: HTMLInputElement | null) => {
        if (e) {
          innerRef(e); // فراخوانی ref اصلی
          ref.current.set(fieldName, e); // ذخیره رفرنس در Map
        }
      }
    };
  };

  // بازگرداندن متدها و مقادیر مورد نیاز
  return { 
    get: (key: string) => ref.current.get(key) || null,
    register: _register as unknown as UseFormRegister<T>,
    handleSubmit,
    errors: errors as Record<string, FieldError>,
    getValues,
    watch
  };
};

export default useForm;