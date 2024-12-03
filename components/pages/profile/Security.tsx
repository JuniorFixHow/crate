'use client'
import {  ChangeEvent, ComponentProps, FormEvent, useState} from "react"
import AddButton from "@/components/features/AddButton"
import Subtitle from "@/components/features/Subtitle"
import { auth } from "@/lib/firebase/firebase"
import {  updatePassword } from "firebase/auth"
import { ErrorProps } from "@/types/Types"
import { Alert } from "@mui/material"
import { getPasswordValidationMessage, isPasswordValid } from "./fxn"
// import { updateVendor } from "@/lib/actions/vendor.action"
// import { useAuth } from "@/hooks/useAuth"

export type ProfileProps = ComponentProps<'form'>

type PasswordProps = {
    // cEmail:string,
    nPassword:string,
    cnPassword:string
}

const Security = ({className, ...props}:ProfileProps) => {  
    const [data, setData] = useState<Partial<PasswordProps>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<ErrorProps>(null);
    // const {user} = useAuth()

    const handlePassword = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setResponse(null);
        try {
            setLoading(true);

                const isValid = isPasswordValid(data.nPassword!);
                if(!isValid){
                    setResponse({message:getPasswordValidationMessage(), error:true})
                }else if(data?.cnPassword !== data.nPassword){
                    setResponse({message:'Passwords mismatch!', error:true})
                }else{
                    await updatePassword(auth.currentUser!, data.nPassword!)
                    setResponse({message:'Password updated successfully', error:false});
                }
            
            // else if(data.cEmail && !data.nPassword){
            //     await updateEmail(auth.currentUser!, data.cEmail);
            //     if(user){
            //         await updateVendor(user.userId, {email:data.cEmail})
            //     }
            //     setResponse({message:'Email updated successfully. Check your mail to verify it.', error:false});
            // }else if(data.nPassword  && data.cEmail){

            //     const isValid = isPasswordValid(data.nPassword!);
            //     if(!isValid){
            //         setResponse({message:getPasswordValidationMessage(), error:true})
            //     }else if(data?.cnPassword !== data.nPassword){
            //         setResponse({message:'Passwords mismatch!', error:true})
            //     }else{
            //         await Promise.all([
            //             updatePassword(auth.currentUser!, data.nPassword!),
            //             updateEmail(auth.currentUser!, data.cEmail)
            //         ])
            //         if(user){
            //             await updateVendor(user.userId, {email:data.cEmail})
            //         }
            //         setResponse({message:'Password updated successfully', error:false});
            //     }

            // }
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured updating data. You might need to sign out and sign in again if this persists.', error:true})
        }finally{
            setLoading(false);
        }
    }

    const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
        const {name, value} = e.target;
        setData((pre)=>({
            ...pre,
            [name]:value
        }))
    }
    
  return (
    <form onSubmit={handlePassword}  className={`flex-col ${className} justify-between w-full`} {...props} >
        <div className={` flex flex-col gap-4 md:gap-8`}  >
            <Subtitle text="Security Settings" />

            <div className="flex flex-col gap-4 ml-3 md:ml-8">
                {/* <div className="flex flex-col">
                    <span className="text-[0.8rem] font-semibold dark:text-white" >New Email</span>
                    <input  onChange={handleChange} placeholder="leave this empty if you dont want to change your email" type="text" name="cEmail"  className="border-b dark:bg-transparent outline-none px-1 py-1 text-slate-400 text-[0.8rem]" />
                </div> */}
                
                <div className="flex flex-col">
                    <span className="text-[0.8rem] font-semibold dark:text-white" >New Password</span>
                    <input required onChange={handleChange} placeholder="" type="password" name="nPassword"  className="border-b dark:bg-transparent outline-none px-1 py-1 text-slate-400 text-[0.8rem]" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[0.8rem] font-semibold dark:text-white" >Repeat New Password</span>
                    <input required onChange={handleChange} type="password" name="cnPassword"  className="border-b dark:bg-transparent outline-none px-1 py-1 text-slate-400 text-[0.8rem]" />
                </div>
                
            </div>

            {
                response?.message &&
                <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
            }            
        </div>
        <AddButton type="submit" text={loading? "loading..." :"Save Changes"} noIcon smallText className="rounded w-fit p-2 self-end" />
    </form>
  )
}

export default Security