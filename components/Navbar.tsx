'use client'
import { NavItems } from '@/components/Dummy/Data'
import { NavigationProps } from '@/types/Types'
import Image from 'next/image'
// import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaRegUser } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import Link from 'next/link'
import NavSwitch from '@/components/features/NavSwitch';
import {  IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {  usePathname, useRouter } from 'next/navigation'

type TitleProps ={
  parent:string,
  child?:string
}

const Navbar = () => {
  const [currentTtitle, setCurrentTitle] =  useState<TitleProps >({
    parent:'Dashboard',
    child:''
  });

  const [collapse, setCollapse] =  useState<boolean>(false);
  const [toggle, setToggle] =  useState<boolean>(true);
  const router = useRouter();
  const path = usePathname();

  const handleParentClick = (item:NavigationProps)=>{
    if(!item.children){
        router.push(item.link!);
        setCurrentTitle({parent:item.title});
        setCollapse(false);
    }
    else if(collapse && currentTtitle.parent === item.title ){
      setCollapse(false);
    }else{
      setCurrentTitle({parent:item.title});

      if(item?.children?.length ){
        setCollapse(true);
      }
    }
  }

  useEffect(()=>{
    NavItems.forEach((item)=>{
      if(item?.link){
          if(path === item.link || path?.startsWith(`${item.link}/`)){
            setCurrentTitle({parent:item.title})
          }
      }else{
        item.children?.forEach((child)=>{
          if(path === child.path || path?.startsWith(`${child.path}/`)){
            setCurrentTitle({parent:item.title, child:child.text})
            setCollapse(true);
          }
        })
      }
    })
  },[path])

  const handleClickChild = (item:NavigationProps, text:string, link:string)=>{
    setCurrentTitle({parent:item.title, child:text});
    router.push(link)
  }

  const handleProfile = ()=>{
    setCurrentTitle({parent:'Account & Settings'});
    router.push('/dashboard/profile')
  }

  return (
    <div className={`flex  xl:p-4 z-20 min-h-full absolute xl:relative dark:border-r border-slate-200  lg:flex flex-col gap-6 ${toggle? 'pt-4':'p-4'} bg-white dark:bg-black shadow-xl rounded-lg`} >
      <div className="flex flex-col gap-6 relative h-fit">

        <div className="flex flex-row items-center w-full justify-between">
          <Link href='/dashboard' className={`${toggle? 'hidden':'flex'} xl:flex flex-col cursor-pointer`}>
            <Image src='/logo.png' alt='logo' width={100} height={10} />
            <span className='text-xs text-[#949191] font-medium' >Accra Philadelphia</span>
          </Link>
          <NavSwitch value={toggle} setValue={setToggle} />
        </div>

        <div className={`flex ${toggle ? 'hidden':'flex'} xl:flex flex-col grow justify-between gap-6`}>

            <div className={`${toggle ? 'hidden':'flex'} xl:flex flex-col gap-6`} >
              <div className="flex flex-col gap-3">
                <span className='text-[1rem] text-[#949191] font-medium' >Menu</span>
                {
                  NavItems.map((item:NavigationProps)=>(
                    <div key={item.title}  className="flex flex-col gap-2">

                      <div onClick={()=>handleParentClick(item)}  className={`flex items-center flex-row hover:text-[#3C60CA] cursor-pointer gap-2 dark:${currentTtitle.parent === item.title ?'#3C60CA':'text-slate-200'} ${currentTtitle.parent === item.title ? 'text-[#3C60CA]':'text-black'}`}  >
                        {item.icon}
                        <span className='text-[0.9rem] font-medium' >{item.title}</span>
                        {
                          item?.children?.length && 
                          <>
                            {
                              collapse && currentTtitle.parent === item.title ?
                              <IoIosArrowUp className='ml-4' />
                              :
                              <IoIosArrowDown className='ml-4' />
                            }
                          </>
                        }
                      </div>
                        {
                          collapse && currentTtitle.parent === item.title &&
                          item.children?.map((child)=>(
                            <div onClick={()=>handleClickChild(item, child.text, child.path)} key={child.text}  className={`ml-4 flex items-center flex-row hover:text-[#3C60CA] cursor-pointer gap-2 dark:${currentTtitle.child === child.text ?'#3C60CA':'text-slate-200'} ${currentTtitle.child === child.text ? 'text-[#3C60CA]':'text-black'}`}>
                              {child.image}
                              <span className='text-[0.9rem] font-normal' >{child.text}</span>
                            </div>
                          ))
                        }
                    </div>
                  ))
                }
              </div>

              <div className="flex flex-col gap-4">
                <span className='text-[1rem] text-[#949191] font-medium' >Account</span>
                <div onClick={handleProfile}  className={`flex items-center flex-row hover:text-[#3C60CA] cursor-pointer gap-2 dark:${currentTtitle.parent === 'Account & Settings' ?'#3C60CA':'text-slate-200'} ${currentTtitle.parent === 'Account & Settings' ? 'text-[#3C60CA]':'text-black'}`}  >
                  <FaRegUser/>
                  <span className='text-[0.9rem] font-medium' >Account & Settings</span>
                </div>
              </div>

            </div>

            <div className="flex flex-col gap-4">
              <Link href='/' className='flex flex-row gap-2 dark:text-slate-200 hover:text-[#3C60CA] items-center cursor-pointer'  >
                <CiLogout/>
                <span className='text-[0.9rem] font-medium' >Logout</span>
              </Link>
            </div>
        </div>
      </div>
      
    </div>
  )
}

export default Navbar