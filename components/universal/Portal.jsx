import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'


export const Portal = (props) => {
  const ref = useRef()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    ref.current = document.querySelector("#loading")
    setMounted(true)
  }, [])

  return (mounted && ref.current) ? createPortal(<div>{props.children}</div>, ref.current) : null
}