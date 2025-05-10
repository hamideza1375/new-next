import React from 'react'
import {_Drawer} from '@/components/profile/drawer'

export default function ProfileLayout({children}) {
  return (
	 <_Drawer>
		{children}
	 </_Drawer>
  )
}
