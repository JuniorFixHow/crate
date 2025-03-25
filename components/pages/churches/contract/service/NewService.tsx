import { Alert, Modal } from "@mui/material"
import AddButton from "@/components/features/AddButton";
import '../../../../features/customscroll.css';
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useRef, useState } from "react";
import { ErrorProps } from "@/types/Types";
import { IService } from "@/lib/database/models/service.model";
import { createService, updateService } from "@/lib/actions/service.action";
import { enqueueSnackbar } from "notistack";

export type NewServiceProps = {
    currentService:IService | null;
    setCurrentService:Dispatch<SetStateAction<IService|null>>;
    infoMode:boolean;
    setInfoMode:Dispatch<SetStateAction<boolean>>;
    updater:boolean;
}

const NewService = ({currentService, updater, setCurrentService, infoMode, setInfoMode}:NewServiceProps) => {
    const handleClose = ()=>{
        setCurrentService(null);
        setInfoMode(false);
    }

    const [error, setError] = useState<ErrorProps>({message:'', error:false});
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] =useState<Partial<IService>>({});
  
    

    const formRef = useRef<HTMLFormElement>(null);

    const handleNewService = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setError(null);
        try {
            setLoading(true);
            const res = await createService(data);
            enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
            setInfoMode(false);
            formRef.current?.reset();
        } catch (error) {
            console.log(error);
            setError({message:'Error occured adding service', error:true})
        }finally{
            setLoading(false);
        }
    }

    const handleChange = (e:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
        const {name, value} = e.target;
        setData((prev)=>({
            ...prev,
            [name]:value,
        }))
    }

    const handleUpdateService = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setError(null);
        try {
            setLoading(true);
            const body:Partial<IService> = {
                _id:currentService?._id,
                name:data?.name||currentService?.name, 
                description:data?.description||currentService?.description, 
                cost:data?.cost||currentService?.cost, 
            };
            const res = await updateService(body);
            enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
            formRef.current?.reset();
            setInfoMode(false);
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured updating service', {variant:'error'});
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
            <form onSubmit={currentService? handleUpdateService : handleNewService}  ref={formRef}  className="new-modal scrollbar-custom overflow-y-scroll">
                <span className='text-[1.5rem] font-bold dark:text-slate-200' >{currentService ? "Edit Service":"Create Service"}</span>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Name</span>
                        <input name="name" onChange={handleChange} required={!currentService} defaultValue={currentService ? currentService.name : ''} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Cost</span>
                        <input name="cost" onChange={handleChange} required={!currentService} defaultValue={currentService ? currentService.cost : ''} type="number" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='$' />
                    </div>
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Description</span>
                        <textarea name="description" onChange={handleChange} required={!currentService} defaultValue={currentService ? currentService.description : ''}  className='border rounded px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='say something about this service...' />
                    </div>
                                      
                </div>

                {
                    error?.message &&
                    <Alert onClose={()=>setError(null)} severity={error.error ? `error`:'success'} >{error.message}</Alert>
                }

                <div className="flex flex-row items-center justify-between">
                    <AddButton disabled={loading} type="submit"  className={`rounded w-[45%] justify-center ${currentService && !updater && 'hidden'}`} text={loading? 'loading...' : currentService? 'Update':'Add'} smallText noIcon />
                    <AddButton disabled={loading}  className='rounded w-[45%] justify-center' text='Cancel' isCancel onClick={handleClose} smallText noIcon />
                </div>
            </form>
        </div>
    </Modal>
  )
}

export default NewService