'use client'
import Image from "next/image"
import { ChangeEvent, ComponentProps,   useEffect,  useState, } from "react"
import { ErrorProps } from "@/types/Types"
import SearchSelectChurch from "@/components/shared/SearchSelectChurch"
import AddButton from "@/components/features/AddButton"
import {  CloudinaryUploadWidgetInfo, CloudinaryUploadWidgetResults } from "next-cloudinary"
import Uploader from "@/components/shared/Uploader"
import { IVendor } from "@/lib/database/models/vendor.model"
import { Alert, LinearProgress } from "@mui/material"
import { getVendor, updateVendor } from "@/lib/actions/vendor.action"
import { useAuth } from "@/hooks/useAuth"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/firebase"
import { createSession, SessionPayload } from "@/lib/session"

export type ProfileProps =  ComponentProps<'div'>

const Account = ({className, ...props}:ProfileProps) => {
    const [image, setImage] = useState<string>('');
    const [churchId, setChurchId] = useState<string>('');
    const [response, setResponse] = useState<ErrorProps>(null);
    const [currentUser, setCurrentUser] = useState<IVendor|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [fetchLoading, setFetchLoading] = useState<boolean>(true);
    const [data, setData] = useState<Partial<IVendor>>({})
    const {user} = useAuth()

    const handleChange =(e:ChangeEvent<HTMLInputElement>)=>{
        const {name, value} = e.target;
        setData((pre)=>({
            ...pre,
            [name]:value
        }))
    }

    // console.log(user)

    const handleSuccess = async(result:CloudinaryUploadWidgetResults)=>{
        try {
            const info = result.info as CloudinaryUploadWidgetInfo
            const content:Partial<IVendor> = {
                image:info.url
            }
            // console.log(info)
            if(user){
               
                await Promise.all([
                    updateVendor(user.userId, content),
                    await updateVendor(user.userId, content)
                ])
                const userData:SessionPayload ={
                    ...user,
                    photo:info.url
                }
                await createSession(userData)
                // console.log('SESSION', res);
                setImage(info.url)
                setResponse({message:'Image uploaded sucsessfully', error:false})
            }
        } catch (error) {
            console.log(error)
            setResponse({message:'Error occured uploading image', error:false})
        }
    }

    useEffect(()=>{
        const fetchUser = async()=>{
            if(user){

                try {
                        const res = await getVendor(user.userId);
                        setCurrentUser(res);
                } catch (error) {
                    console.log(error)
                }finally{
                    setFetchLoading(false);
                }
            }
        }
        fetchUser()
    },[user])


    const handleUpdate = async()=>{
        // e.preventDefault();
        setResponse(null);
        try {
            setLoading(true);
            const body:Partial<IVendor> = {
                name:data.name || currentUser?.name,
                email:data.email || currentUser?.email,
                phone:data.phone || currentUser?.phone,
                gender:data.gender || currentUser?.gender,
                church:churchId || currentUser?.church,
            }
            const userData = {
                name:data.name || user?.name,
                email:data.email || user?.email,
            }
            if(user){
                const [mongo, fb] = await Promise.all([
                    updateVendor(user.userId, body),
                    updateDoc(doc(db, 'Users', user.userId), {
                        name:userData.name,
                        email:userData.email,
                    })
                ])
                setResponse(mongo);
                const session:SessionPayload = {
                    ...user,
                    name:userData.name!,
                    email:userData.email!
                }
                await createSession(session);
                console.log(fb);
            }
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured trying the update.', error:false})
        }finally{
            setLoading(false);
        }
    }

    // console.log('phone: ',currentUser?.phone)
    
  return (
    <div   className={`flex-col ${className} justify-between`} {...props} >
        {
            fetchLoading ?
            <LinearProgress className="w-full" />
            :

            <div className={` flex flex-row items-center h-fit gap-4 md:gap-10`}  >
                <div className="flex flex-col gap-4">
                    {
                        user &&
                        <div className="flex-center h-[8rem] w-[8rem] p-2 relative rounded-full bg-slate-300">
                            <Image width={100} height={100} className="rounded-full" alt="user" src={image ? image :  user.photo} />
                        </div>
                    }
                    {
                        response?.message &&
                        <Alert onClose={()=>setResponse(null)} severity={response.error?'error':'success'} >{response.message}</Alert>
                    }
                    <Uploader onSuccess={handleSuccess} />
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <span className="text-[0.8rem] font-semibold dark:text-white" >Name</span>
                        <input onChange={handleChange} type="text" name="name" defaultValue={currentUser?.name} className="border-b dark:bg-transparent px-1 outline-none py-1 text-slate-400 text-[0.8rem]" />
                    </div>
                    {
                        currentUser &&
                        <div className="flex flex-col">
                            <span className="text-[0.8rem] font-semibold dark:text-white" >Gender</span>
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <input onChange={handleChange} defaultChecked={currentUser?.gender==='Male'} type="radio" name="gender" value='Male' />
                                    <span className='text-[0.8rem] dark:text-white' >Male</span>
                                </div>
                                <div className="flex gap-2">
                                    <input onChange={handleChange} defaultChecked={currentUser?.gender==='Female'} type="radio" name="gender" value='Female' />
                                    <span className='text-[0.8rem] dark:text-white' >Female</span>
                                </div>
                            </div>
                        </div>
                    }
                    <div className="flex flex-col">
                        <span className="text-[0.8rem] font-semibold dark:text-white" >Email</span>
                        <input onChange={handleChange} type="email" name="email" defaultValue={currentUser?.email} className="border-b dark:bg-transparent px-1 outline-none py-1 text-slate-400 text-[0.8rem]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[0.8rem] font-semibold dark:text-white" >Phone Number</span>
                        <input onChange={handleChange} type="text" name="phone" defaultValue={currentUser?.phone} className="border-b dark:bg-transparent px-1 outline-none py-1 text-slate-400 text-[0.8rem]" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[0.8rem] font-semibold dark:text-white" >Local Church</span>
                        <SearchSelectChurch setSelect={setChurchId} isGeneric />
                    </div>
                </div>

                
            </div>
        }


        <AddButton type='button' onClick={handleUpdate} text={loading ? 'loading...':'Save Changes'} noIcon smallText className="rounded w-fit p-2 self-end" />
    </div>
  )
}

export default Account