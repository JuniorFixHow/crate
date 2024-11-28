'use client'
import AddButton from '@/components/features/AddButton'
import { ErrorProps } from '@/types/Types'
import { Alert, Modal } from '@mui/material'
import { Dispatch, FormEvent, SetStateAction, useRef, useState } from 'react'
import '../../../components/features/customscroll.css';
import { createZone, updateZone } from '@/lib/actions/zone.action'
import { IZone } from '@/lib/database/models/zone.model'

type NewZoneProps = {
    openZone:boolean,
    setOpenZone:Dispatch<SetStateAction<boolean>>,
    currentZone:IZone|null,
    setCurrentZone:Dispatch<SetStateAction<IZone|null>>
}

const NewZone = ({openZone, setOpenZone, currentZone, setCurrentZone}:NewZoneProps) => {
    const handleClose=()=>{
        setOpenZone(false);
        setCurrentZone(null);
    }

    const [error, setError]=useState<ErrorProps>({message:'', error:false});
    const [loading, setLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [country, setCountry] = useState<string>('USA');
    const [state, setState] = useState<string>('');

    const formRef = useRef<HTMLFormElement>(null);

    const handleNewZone = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setError({message:'', error:false});
        try {
            setLoading(true);
            const data:Partial<IZone> = {name, country, state};
            const res = await createZone(data);
            console.log(res)
            setError({message:'Zone added successfully', error:false});
            formRef.current?.reset();
        } catch (error) {
            console.log(error);
            setError({message:'Error occured adding zone', error:true})
        }finally{
            setLoading(false);
        }
    }

    const handleUpdateZone = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setError({message:'', error:false});
        try {
            setLoading(true);
            const data:Partial<IZone> = {
                name:name||currentZone?.name, 
                country:country||currentZone?.country, 
                state:state || currentZone?.state
            };
            if(currentZone){
                const zone = await updateZone(currentZone._id, data);
                setCurrentZone(zone);
                setError({message:'Zone updated successfully', error:false});
            }
        } catch (error) {
            console.log(error);
            setError({message:'Error occured updating zone', error:true})
        }finally{
            setLoading(false);
        }
    }

  return (
    <Modal
        open={openZone}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
        >
        <div className='flex size-full items-center justify-center'>
            <form onSubmit={currentZone ? handleUpdateZone : handleNewZone}  ref={formRef}  className="new-modal scrollbar-custom overflow-y-scroll">
                <span className='text-[1.5rem] font-bold dark:text-slate-200' >{currentZone ? "Edit Zone":"Create Zone"}</span>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Zone name</span>
                        <input onChange={(e)=>setName(e.target.value)} required={!currentZone} defaultValue={currentZone?currentZone.name : ''} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Country</span>
                        <select onChange={(e)=>setCountry(e.target.value)}  className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' defaultValue={currentZone?currentZone.country:'USA'} name="country">
                            <option className='dark:bg-black dark:text-white' value="USA">USA</option>
                            <option className='dark:bg-black dark:text-white' value="Ghana">Ghana</option>
                        </select>
                        {/* <input type="text" className=' border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' /> */}
                    </div>
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Region/State</span>
                        <input onChange={(e)=>setState(e.target.value)} required={!currentZone} defaultValue={currentZone?currentZone.state : ''} type="text" className=' border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                </div>

                {
                    error?.message &&
                    <Alert onClose={()=>setError({message:'', error:false})} severity={error.error ? 'error':'success'} >
                        {error.message}
                    </Alert>
                }

                <div className="flex flex-row items-center justify-between">
                    <AddButton disabled={loading}  type='submit'  className='rounded w-[45%] justify-center' text={loading ? 'loading...' : currentZone? 'Update':'Add'} smallText noIcon />
                    <AddButton className='rounded w-[45%] justify-center' text='Cancel' isCancel onClick={handleClose} smallText noIcon />
                </div>
            </form>
        </div>
    </Modal>
  )
}

export default NewZone