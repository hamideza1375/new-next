import React from 'react'
import {_Drawer} from '@/components/admin/drawer'

export default function DashboardLayout({children}) {
  return (
	 <_Drawer>
		{children}
	 </_Drawer>
  )
}
