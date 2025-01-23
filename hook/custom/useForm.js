import { useRef } from 'react'
import { useForm as useform } from 'react-hook-form'

const useForm = () => {
  const ref = useRef(new Map()) // استفاده از useRef برای ذخیره ارجاعات به فیلدها

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch
  } = useform() // react-hook-form از کتابخانه useForm استفاده از

  const _register = (fieldName, options = {}) => {
    const registeredField = register(fieldName, options) // register ثبت فیلد با استفاده از
    const {ref: innerRef} = registeredField
    delete registeredField.ref

    return {
      ...registeredField,
      innerRef: e => {
        innerRef(e)
        ref.current.set(fieldName, e) // ref ذخیره ارجاع فیلد در
      }
    }
  }
  return { get:(key)=> ref.current.get(key), register: _register, handleSubmit, errors, getValues, watch } // بازگرداندن توابع و مقادیر مورد نیاز
}
export default useForm
