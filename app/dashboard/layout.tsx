import Header from '@/components/Header'
import Navbar from '@/components/Navbar'
import {ReactNode} from 'react'

export default function RootLayout({children}:Readonly<{children:ReactNode}>) {
  return (
    <div className='flex items-stretch relative w-full min-h-screen dark:text-slate-200 flex-row  bg-[#d6d6d6] dark:bg-black overflow-hidden' >
      <Navbar/>
      <div className="flex flex-col grow">
        <Header/>
        {children}
      </div>
  </div>
  )
}
