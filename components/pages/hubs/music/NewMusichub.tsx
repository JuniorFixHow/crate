import AddButton from '@/components/features/AddButton'
import  { ChangeEvent, Dispatch, FormEvent, SetStateAction, useRef, useState } from 'react'
import { Modal } from '@mui/material';

import { useAuth } from '@/hooks/useAuth';

import { enqueueSnackbar } from 'notistack';

import { IMusichub } from '@/lib/database/models/musichub.model';
import { createMusicHub, updateMusicHub } from '@/lib/actions/musichub.action';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import '@/components/features/customscroll.css'


export type NewMusichubProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentHub:IMusichub|null,
    setCurrentHub:Dispatch<SetStateAction<IMusichub|null>>,
    updater?:boolean,
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<IMusichub[], Error>>
}

const NewMusichub = ({infoMode, setInfoMode, refetch, updater, currentHub, setCurrentHub}:NewMusichubProps) => {
    const [data, setData] = useState<Partial<IMusichub>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const {user} = useAuth();


    const mine = currentHub?.churchId.toString() === user?.churchId;

    const canUpdate = updater && mine;

    const formRef = useRef<HTMLFormElement>(null)
    const handleChange = (e:ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>{
        const {name, value} = e.target;
        setData((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    const handleClose = ()=>{
        setCurrentHub(null);
        setInfoMode(false);
    }

    const handleNewHub = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try {
            setLoading(true);
            const body:Partial<IMusichub> = {
                ...data,
                createdBy:user?.userId,
                churchId:user?.churchId
            }
            const res = await createMusicHub(body);
            // setResponse({message:'Room created successfully', error:false});
            formRef.current?.reset();
            enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
            setInfoMode(false);
            refetch();
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured creating music item', {variant:'error'});
        }finally{
            setLoading(false);
        }
    }


    const handleUpdateHub = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try {
            setLoading(true);
            if(currentHub){
                const body:Partial<IMusichub> = {
                    _id:currentHub?._id,
                    title:data.title || currentHub.title,
                    contact:data.contact || currentHub.contact,
                    email:data.email || currentHub.email,
                    nature:data.nature || currentHub.nature,
                    type:data.type || currentHub.type,
                    appearance:data.appearance || currentHub.appearance,
                    affiliation:data.affiliation || currentHub.affiliation,
                }
                const res=  await updateMusicHub(body);
                // setCurrentClass(res?.payload as IHubclass);
                setInfoMode(false);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'})
                refetch();
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured updating music item', {variant:'error'});
        }finally{
            setLoading(false);
        }
    }

  return (
    <Modal
        open={infoMode}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
        >
        <div className='flex size-full items-center justify-center'>
            <form onSubmit={ currentHub ? handleUpdateHub : handleNewHub} ref={formRef}  className="new-modal scrollbar-custom overflow-y-scroll">
                <span className='text-[1.5rem] font-bold dark:text-slate-200' >{currentHub ? "Edit":"Create"}</span>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Musician/Group Name</span>
                        <input onChange={handleChange} name='title' required={!currentHub} defaultValue={currentHub?.title} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Musician Contact</span>
                        <input onChange={handleChange} name='contact' required={!currentHub} defaultValue={currentHub?.contact} type='tel' className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Musician Email</span>
                        <input onChange={handleChange} name='email' required={!currentHub} defaultValue={currentHub?.email} type='email' className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>


                    <div className="flex flex-col md:flex-row gap-5 md:gap-12">
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Nature</span>
                            <select onChange={handleChange} required={!currentHub}  className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' defaultValue={currentHub?.nature} name="nature">
                                <option className='dark:bg-black dark:text-white' value="">select</option>
                                <option className='dark:bg-black dark:text-white' value="Individual">Individual</option>
                                <option className='dark:bg-black dark:text-white' value="Group">Group</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Type</span>
                            <select onChange={handleChange} required={!currentHub}  className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' defaultValue={currentHub?.type} name="type">
                                <option className='dark:bg-black dark:text-white' value="">select</option>
                                <option className='dark:bg-black dark:text-white' value="Choir">Choir</option>
                                <option className='dark:bg-black dark:text-white' value="Singing Band">Singing Band</option>
                                <option className='dark:bg-black dark:text-white' value="Quartets">Quartets</option>
                                <option className='dark:bg-black dark:text-white' value="Choral Group">Choral Group</option>
                                <option className='dark:bg-black dark:text-white' value="Youth Choir">Youth Choir</option>
                                <option className='dark:bg-black dark:text-white' value="Musician">Musician</option>
                                <option className='dark:bg-black dark:text-white' value="Instrumentalists">Instrumentalists</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-5 md:gap-12">
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Appearance</span>
                            <select onChange={handleChange} required={!currentHub}  className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' defaultValue={currentHub?.appearance} name="appearance">
                                <option className='dark:bg-black dark:text-white' value="">select</option>
                                <option className='dark:bg-black dark:text-white' value="First time">First time</option>
                                <option className='dark:bg-black dark:text-white' value="1 - 2 times">1 - 2 times</option>
                                <option className='dark:bg-black dark:text-white' value="More than 2">More than 2</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Affiliation</span>
                            <select onChange={handleChange} required={!currentHub}  className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' defaultValue={currentHub?.affiliation} name="affiliation">
                                <option className='dark:bg-black dark:text-white' value="">select</option>
                                <option className='dark:bg-black dark:text-white' value="NAGACU">NAGACU</option>
                                <option className='dark:bg-black dark:text-white' value="NAGASBU">NAGASBU</option>
                                <option className='dark:bg-black dark:text-white' value="NAGASGA">NAGASGA</option>
                                <option className='dark:bg-black dark:text-white' value="Youth Choir Union">Youth Choir Union</option>
                                <option className='dark:bg-black dark:text-white' value="No Affliations">No Affliations</option>
                                <option className='dark:bg-black dark:text-white' value="Guest">Guest</option>
                            </select>
                        </div>
                    </div>
                    
                </div>

                <div className="flex flex-row items-center gap-6">
                    <AddButton disabled={loading} type='submit'  className={`${currentHub && !canUpdate && 'hidden'} rounded w-[45%] justify-center`} text={loading ? 'loading...' : currentHub? 'Update':'Add'} smallText noIcon />
                    <AddButton disabled={loading} className='rounded w-[45%] justify-center' text='Cancel' isCancel onClick={handleClose} smallText noIcon />
                </div>
            </form>
        </div>
    </Modal>
  )
}

export default NewMusichub