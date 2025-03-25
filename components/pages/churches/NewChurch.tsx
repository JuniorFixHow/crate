import { Alert, Modal } from "@mui/material"
import AddButton from "@/components/features/AddButton";
import '../../../components/features/customscroll.css';
import { Dispatch, FormEvent, SetStateAction, useRef, useState } from "react";
import { createChurch } from "@/lib/actions/church.action";
import { ErrorProps } from "@/types/Types";
import { IChurch } from "@/lib/database/models/church.model";
import SearchSelectZones from "@/components/features/SearchSelectZones";

type NewChurchProp = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentChurch:IChurch|null,
    setCurrentChurch:Dispatch<SetStateAction<IChurch|null>>;
}

const NewChurch = ({currentChurch, setCurrentChurch, infoMode, setInfoMode}:NewChurchProp) => {
    const handleClose = ()=>{
        setCurrentChurch(null);
        setInfoMode(false);
    }

    const [error, setError] = useState<ErrorProps>({message:'', error:false});
    const [loading, setLoading] = useState<boolean>(false);
    const [name, setName] =useState<string>('');
    const [pastor, setPastor] =useState<string>('');
    const [zoneId, setZoneId] =useState<string>('');

    const formRef = useRef<HTMLFormElement>(null);

    const handleNewChurch = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setError({message:'', error:false});
        try {
            setLoading(true);
            const data:Partial<IChurch> = {name, pastor, zoneId};
            const res = await createChurch(data);
            console.log(res)
            setError({message:'Church added successfully', error:false});
            formRef.current?.reset();
        } catch (error) {
            console.log(error);
            setError({message:'Error occured adding church', error:true})
        }finally{
            setLoading(false);
        }
    }
    // console.log(zoneId)

    const handleUpdateChurch = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setError({message:'', error:false});
        try {
            setLoading(true);
            const data:Partial<IChurch> = {
                name:name||currentChurch?.name, 
                pastor:pastor||currentChurch?.pastor, 
                zoneId:zoneId||currentChurch?.zoneId
            };
            const res = await createChurch(data);
            const result = res?.payload as IChurch;
            setCurrentChurch(result);
            // console.log(res)
            setError({message:'Church updated successfully', error:false});
            formRef.current?.reset();
        } catch (error) {
            console.log(error);
            setError({message:'Error occured adding zone', error:true})
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
            <form onSubmit={currentChurch? handleUpdateChurch : handleNewChurch}  ref={formRef}  className="new-modal scrollbar-custom overflow-y-scroll">
                <span className='text-[1.5rem] font-bold dark:text-slate-200' >{currentChurch ? "Edit Church":"Create Church"}</span>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Church name</span>
                        <input onChange={(e)=>setName(e.target.value)} required={!currentChurch} defaultValue={currentChurch?currentChurch.name : ''} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Pastor name</span>
                        <input onChange={(e)=>setPastor(e.target.value)} defaultValue={currentChurch?currentChurch.pastor : ''} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Zone</span>
                        <SearchSelectZones require={currentChurch===null} isGeneric setSelect={setZoneId} />
                        {/* <input type="text" className=' border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' /> */}
                    </div>
                    
                </div>

                {
                    error?.message &&
                    <Alert severity={error.error ? `error`:'success'} >{error.message}</Alert>
                }

                <div className="flex flex-row items-center justify-between">
                    <AddButton disabled={loading} type="submit"  className='rounded w-[45%] justify-center' text={loading? 'loading...' : currentChurch? 'Update':'Add'} smallText noIcon />
                    <AddButton disabled={loading}  className='rounded w-[45%] justify-center' text='Cancel' isCancel onClick={handleClose} smallText noIcon />
                </div>
            </form>
        </div>
    </Modal>
  )
}

export default NewChurch