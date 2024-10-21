import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='h-screen w-full flex bg-white relative items-center justify-center overflow-hidden' >
        <Image className='hidden md:block absolute -left-40 -top-40 filter grayscale opacity-20' src='/icon.png' width={500} height={500} alt='logo' />

        <div className="flex flex-col items-center z-10">
            <Image src='/icon2.png' height={1} width={120} alt='logo' />
            <form className='w-[18rem] rounded-lg shadow-xl p-8 flex flex-col gap-4 items-center' >
                <span className='text-2xl font-bold' >Sign In</span>

                <div className="flex w-full gap-8 flex-col">
                    <div className="flex flex-col w-full">
                        <span className='text-slate-400 text-[0.8rem] font-semibold' >Email</span>
                        <input type="email" name="email" className='outline-none border-b border-b-slate-200' />
                    </div>

                    <div className="flex flex-col w-full">
                        <span className='text-slate-400 text-[0.8rem] font-semibold' >Password</span>
                        <input type="password" name="password" className='outline-none border-b border-b-slate-200' />
                    </div>
                </div>

                <div className="flex gap-4 w-full flex-col">
                    <Link className='self-end' href='/reset' >
                        <span className='text-xs text-[#21409A] cursor-pointer hover:underline font-semibold'>Forgot Password?</span>
                    </Link>
                    <button type='submit' className='bg-[#21409A] hover:bg-blue-500 text-white text-[0.9rem] font-semibold py-1' >Submit</button>
                </div>
            </form>
        </div>

        <Image className='hidden md:block absolute -right-40 -bottom-40 filter grayscale opacity-20' src='/icon.png' width={500} height={500} alt='logo' />
    </div>
  )
}

export default page