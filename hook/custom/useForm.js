import { useRef } from 'react';
import { useForm as useform } from 'react-hook-form';

/**
 * هوک سفارشی برای مدیریت فرم‌ها با قابلیت دسترسی به رفرنس فیلدها
 * @module useForm
 * @returns {Object} آبجکت حاوی متدها و خصوصیات مدیریت فرم
 * @property {Function} get - دریافت رفرنس فیلد بر اساس نام
 * @property {Function} register - ثبت فیلدهای فرم با قابلیت ذخیره رفرنس
 * @property {Function} handleSubmit - مدیریت ارسال فرم
 * @property {Object} errors - خطاهای اعتبارسنجی فرم
 * @property {Function} getValues - دریافت مقادیر فیلدهای فرم
 * @property {Function} watch - مشاهده تغییرات فیلدهای فرم
 * @example
 * // نمونه استفاده
 * const { register, handleSubmit, errors, get } = useForm();
 * 
 * <form onSubmit={handleSubmit(onSubmit)}>
 *   <input {...register('username')} />
 *   {errors.username && <span>این فیلد الزامی است</span>}
 * </form>
 * 
 * // دسترسی به رفرنس فیلد
 * const inputRef = get('username');
 */
const useForm = () => {
  // استفاده از useRef برای ذخیره رفرنس فیلدها در یک Map
  const ref = useRef(new Map());

  // استفاده از هوک useForm از کتابخانه react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch
  } = useform();

  /**
   * تابع ثبت فیلد سفارشی با قابلیت ذخیره رفرنس
   * @param {string} fieldName - نام فیلد فرم
   * @param {Object} [options={}] - تنظیمات اعتبارسنجی فیلد
   * @returns {Object} خصوصیات ثبت فیلد
   */
  const _register = (fieldName, options = {}) => {
    // ثبت فیلد با متد register اصلی
    const registeredField = register(fieldName, options);
    const { ref: innerRef } = registeredField;
    
    // حذف پراپرتی ref از آبجکت برگشتی
    delete registeredField.ref;

    return {
      ...registeredField,
      // اضافه کردن منطق سفارشی برای ذخیره رفرنس
      innerRef: e => {
        innerRef(e); // فراخوانی ref اصلی
        ref.current.set(fieldName, e); // ذخیره رفرنس در Map
      }
    };
  };

  // بازگرداندن متدها و مقادیر مورد نیاز
  return { 
    get: (key) => ref.current.get(key), // تابع دریافت رفرنس فیلد
    register: _register, // تابع ثبت فیلد سفارشی
    handleSubmit, // تابع مدیریت ارسال فرم
    errors, // خطاهای اعتبارسنجی
    getValues, // دریافت مقادیر فیلدها
    watch // مشاهده تغییرات فیلدها
  };
};

export default useForm;