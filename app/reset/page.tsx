import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6';

const page = () => {
  return (
    <div className='h-screen w-full flex bg-white relative items-center justify-center overflow-hidden' >
        <Image className='hidden md:block absolute -left-40 -top-40 filter grayscale opacity-20' src='/icon.png' width={500} height={500} alt='logo' />

        <div className="flex flex-col items-center z-10">
            <Image src='/icon2.png' height={1} width={120} alt='logo' />
            <form className='w-[24rem] rounded-lg shadow-xl p-16 flex flex-col gap-4 items-center' >
              <div className="flex relative flex-row gap-4 items-start w-full">
                <Image className='absolute -left-14' src='/key.png' width={46} height={46} alt='key' />
                {/* <IoMdKey className='absolute -left-14 -top-2' color='#21409A' size={40} /> */}
                <div className="flex flex-col gap-1">
                  <span className='text-xl font-bold' >Forgot Password?</span>
                  <span className='text-xs text-slate-400' >No worries, we&apos;ll send you reset instructions.</span>
                </div>
              </div>

                <div className="flex w-full gap-8 flex-col">
                    <div className="flex flex-col w-full">
                        <span className='text-slate-400 text-[0.8rem] font-semibold' >Email</span>
                        <input type="email" name="email" className='outline-none border-b border-b-slate-200' />
                    </div>

                    
                </div>

                <div className="flex gap-4 w-full flex-col">
                    <button type='submit' className='bg-[#21409A] hover:bg-blue-500 text-white text-[0.9rem] font-semibold py-1' >Proceed</button>
                    <Link className='flex flex-row gap-4 w-full justify-center' href='/' >
                      <FaArrowLeftLong className='text-slate-400' />
                      <span className='text-xs cursor-pointer text-slate-300 hover:underline font-semibold'>Back to Sign In</span>
                    </Link>
                </div>
            </form>
        </div>

        <Image className='hidden md:block absolute -right-40 -bottom-40 filter grayscale opacity-20' src='/icon.png' width={500} height={500} alt='logo' />
    </div>
  )
}

export default page