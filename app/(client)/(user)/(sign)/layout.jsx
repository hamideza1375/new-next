import Navbar from "@/components/sign/navbar";

export default function SignLayout({children}) {
  return (
	 <div dir='rtl' className='flex flex-col w-full h-screen'>
	 <Navbar/>
		{children}
	 </div>
  )
}
