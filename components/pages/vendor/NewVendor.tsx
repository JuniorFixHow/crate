'use client'
import SearchSelectChurch from '@/components/shared/SearchSelectChurch'
import AddButton from '@/components/features/AddButton'
import { ErrorProps, IUser } from '@/types/Types'
import { Alert, Modal } from '@mui/material'
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useRef, useState } from 'react'
import '../../../components/features/customscroll.css';
import { IVendor } from '@/lib/database/models/vendor.model'
import { getPassword } from '@/functions/misc'
import { createVendor, updateVendor } from '@/lib/actions/vendor.action'
import { useRouter } from 'next/navigation'
import { serverTimestamp } from 'firebase/firestore'
import { signupUser } from '@/lib/firebase/auth'

type NewVendorProps = {
    openVendor:boolean,
    setOpenVendor:Dispatch<SetStateAction<boolean>>,
    currentVendor:IVendor|null,
    setCurrentVendor:Dispatch<SetStateAction<IVendor|null>>
}

const NewVendor = ({openVendor, setOpenVendor, currentVendor, setCurrentVendor}:NewVendorProps) => {
    const handleClose=()=>{
        setOpenVendor(false);
        setCurrentVendor(null);
    }

    const [church, setChurch] = useState<string>('');
    const [data, setData] = useState<Partial<IVendor>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ErrorProps>({message:'', error:false});
    const handleChange = (e:ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>{
        const {name, value} = e.target;
        setData((pre)=>({
            ...pre,
            [name]:value,
            church,
        }))
    }
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);

    const handleNewVendor = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setError({message:'', error:false});
        const password = getPassword(data.name!, data.phone!)
        try {
            setLoading(true);
            const body:Partial<IVendor> = {
                ...data, password
            }
            const res = await createVendor(body);
            if(res?.code === 201){
                const response = res.payload as IVendor;
                const fbData:IUser = {
                    email:data.email!,
                    name:data.name!,
                    photo:'https://cdn-icons-png.flaticon.com/512/9187/9187604.png',
                    id:response._id,
                    emailVerified:false,
                    isAdmin:true,
                    role:data.role!,
                    createdAt:serverTimestamp()
                }
                await signupUser(data.email!, password, fbData);
            }
            setError(res);
            formRef.current?.reset();
            router.refresh();
        } catch (error) {
            console.log(error);
            setError({message:'Error occured adding member. Please, Retry.', error:true})
        }finally{
            setLoading(false);
        }
    }

    const handleUpdateVendor = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setError({message:'', error:false});
        try {
            setLoading(true);
            if(currentVendor){

                const body:Partial<IVendor> = {
                    name:data.name || currentVendor?.name,
                    email:data.email || currentVendor?.email,
                    phone:data.phone || currentVendor?.phone,
                    role:data.role || currentVendor?.role,
                    gender:data.gender || currentVendor?.gender,
                    church: church || currentVendor?.church
                }
                const res:ErrorProps = await updateVendor(currentVendor?._id, body);
                const response = res?.payload as IVendor
                setCurrentVendor(response);
                router.refresh();
                setError(res);
            }
        } catch (error) {
            console.log(error);
            setError({message:'Error occured updating member. Please, Retry.', error:true})
        }finally{
            setLoading(false);
        }
    }

  return (
    <Modal
        open={openVendor}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
        >
        <div className='flex size-full flex-center'>
            <form ref={formRef} onSubmit={ currentVendor ? handleUpdateVendor :  handleNewVendor}  className="new-modal scrollbar-custom overflow-y-scroll">
                <span className='text-[1.5rem] font-bold dark:text-slate-200' >{currentVendor ? "Edit Vendor":"Create Vendor"}</span>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Full name</span>
                        <input onChange={handleChange} required={!currentVendor} defaultValue={currentVendor?currentVendor.name : ''} name='name' type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Gender</span>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <input onChange={handleChange} required={!currentVendor} defaultChecked={currentVendor?.gender==='Male'} type="radio" name="gender" value='Male' />
                                <span className='text-[0.8rem] dark:text-white' >Male</span>
                            </div>
                            <div className="flex gap-2">
                                <input onChange={handleChange} required={!currentVendor} defaultChecked={currentVendor?.gender==='Female'} type="radio" name="gender" value='Female' />
                                <span className='text-[0.8rem] dark:text-white' >Female</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Email</span>
                        <input required={!currentVendor} onChange={handleChange} defaultValue={currentVendor?currentVendor.email : ''} name='email' type="email" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>

                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Phone</span>
                        <input required={!currentVendor} onChange={handleChange} defaultValue={currentVendor?currentVendor.phone : ''} name='phone' type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>

                   

                    <div className="flex flex-col md:flex-row gap-4 md:gap-12 items-start">
                        <div className="flex flex-col gap-2">
                            <span className='text-slate-500 text-[0.8rem]' >Church</span>
                            <SearchSelectChurch require={!currentVendor} setSelect={setChurch} isGeneric />
                        </div>

                        <div className="flex flex-col gap-2">
                            <span className='text-slate-500 text-[0.8rem]' >Role</span>
                            <select required={!currentVendor} onChange={handleChange} defaultValue={currentVendor ? currentVendor.role : ''}  className='border rounded py-1 dark:bg-transparent outline-none' name="role" >
                                <option className='bg-white text-black dark:text-white dark:bg-black' value="">select</option>
                                <option className='bg-white text-black dark:text-white dark:bg-black' value="Volunteer">Volunteer</option>
                                <option className='bg-white text-black dark:text-white dark:bg-black' value="Coordinator">Coordinator</option>
                                <option className='bg-white text-black dark:text-white dark:bg-black' value="Admin">Admin</option>
                            </select>
                        </div>
                    </div>
                    
                </div>

                {
                    error?.message &&
                    <Alert onClose={()=>setError({message:'',error:false})} severity={error.error ? 'error':'success'} >{error.message}</Alert>
                }

                <div className="flex flex-row items-center justify-between">
                    <AddButton disabled={loading}  className='rounded w-[45%] justify-center' text={ loading? 'loading...': currentVendor? 'Update':'Add'} smallText noIcon />
                    <AddButton disabled={loading}  className='rounded w-[45%] justify-center' text='Cancel' isCancel onClick={handleClose} smallText noIcon />
                </div>
            </form>
        </div>
    </Modal>
  )
}

export default NewVendor