'use client'
// import { useAuth } from '@/hooks/useAuth'
import { signinUser } from '@/lib/firebase/auth'
import { createSession, SessionPayload } from '@/lib/session'
// import { auth } from '@/lib/firebase/firebase'
import { ErrorProps, IUser } from '@/types/Types'
import { Alert } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import {  useRouter } from 'next/navigation'
import React, { ChangeEvent, FormEvent,  useState } from 'react'

type LoginProps = {
    email:string,
    password:string
}

const Login = () => {
    const [data, setData] = useState<LoginProps>({email:'', password:''});
    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<ErrorProps>(null)

    const router = useRouter();

    const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
        const {name, value} = e.target;
        setData((pre)=>({
            ...pre,
            [name]:value
        }))
    }

    const handleLogin = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try {
            setResponse(null);
            setLoading(true);
            const res = await signinUser(data.email, data.password) as ErrorProps;
            setResponse(res)
            const user = res?.payload as IUser;
            if(user){

                const session:SessionPayload = {
                    userId:user?.id,
                    email:user?.email,
                    name:user?.name,
                    photo:user?.photo,
                    role:user?.role,
                    country:user?.country,
                    isAdmin:user?.isAdmin,
                    emailVerified:user?.emailVerified
                }
                await createSession(session);
                if(user.isAdmin){
                    router.replace('/dashboard')
                }else{
                    router.replace('/selfservice')
                }
                
            }

            // login(user)
            // console.log(res);
        } catch (error) {
            console.log('New Error: ',error);
            setResponse({message:'Error occured signing in.', error:true})
        }finally{
            setLoading(false);
        }
    }
    // console.log(auth.currentUser)

    // auth.signOut()

  return (
    <div className='h-screen w-full flex bg-[url(/bg.jpg)] relative items-center justify-center overflow-hidden' >
    {/* <Image className='hidden md:block absolute -left-40 -top-40 filter grayscale opacity-20' src='/icon.png' width={500} height={500} alt='logo' /> */}
    
    <div className="flex flex-col items-center z-10 bg-white pt-4 rounded">
        <Image src='/Logo.png' height={100} width={150} alt='logo' />
        <form onSubmit={handleLogin}  className='w-[18rem] rounded-lg shadow-xl p-8 flex flex-col gap-4 items-center' >
            <span className='text-2xl font-bold' >Sign In</span>
    
            <div className="flex w-full gap-8 flex-col">
                <div className="flex flex-col w-full">
                    <span className='text-slate-400 text-[0.8rem] font-semibold' >Email</span>
                    <input onChange={handleChange} required type="email" name="email" className='outline-none border-b border-b-slate-200' />
                </div>
    
                <div className="flex flex-col w-full">
                    <span className='text-slate-400 text-[0.8rem] font-semibold' >Password</span>
                    <input onChange={handleChange} required type="password" name="password" className='outline-none border-b border-b-slate-200' />
                </div>
            </div>
            {
                response?.message &&
                <Alert severity={response.error? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
            }
    
            <div className="flex gap-4 w-full flex-col">
                <Link className='self-end' href='/reset' >
                    <span className='text-xs text-[#21409A] cursor-pointer hover:underline font-semibold'>Forgot Password?</span>
                </Link>
                <button type='submit' className='bg-[#21409A] hover:bg-blue-500 text-white text-[0.9rem] font-semibold py-1' >{loading ? 'loading...':'Submit'}</button>
            </div>
        </form>
    </div>
    
    {/* <Image className='hidden md:block absolute -right-40 -bottom-40 filter grayscale opacity-20' src='/icon.png' width={500} height={500} alt='logo' /> */}
    </div>
  )
}

export default Login