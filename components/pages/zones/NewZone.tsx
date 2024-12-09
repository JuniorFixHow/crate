'use client'
import AddButton from '@/components/features/AddButton'
import { ErrorProps } from '@/types/Types'
import { Alert} from '@mui/material'
import { Dispatch, FormEvent, SetStateAction, useRef, useState } from 'react'
import '../../../components/features/customscroll.css';
import { createZone, updateZone } from '@/lib/actions/zone.action'
import { IZone } from '@/lib/database/models/zone.model'
import Address from '@/components/shared/Address'

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

    const formRef = useRef<HTMLFormElement>(null);

    const handleNewZone = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setError({message:'', error:false});
        try {
            setLoading(true);
            const data:Partial<IZone> = {name, country};
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
    if (!openZone) return null;

  return (
    <div
       
        className="fixed inset-0 z-50 flex-center bg-black/50 backdrop-blur-0"
        >
        <div className='flex size-full items-center justify-center relative'>
            <form onSubmit={currentZone ? handleUpdateZone : handleNewZone}  ref={formRef}  className="new-modal scrollbar-custom overflow-y-scroll">
                <span className='text-[1.5rem] font-bold dark:text-slate-200' >{currentZone ? "Edit Zone":"Create Zone"}</span>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Zone name</span>
                        <input onChange={(e)=>setName(e.target.value)} required={!currentZone} defaultValue={currentZone?currentZone.name : ''} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Location</span>
                        <Address className='' setAddress={setCountry} />
            
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
    </div>
  )
}

export default NewZone