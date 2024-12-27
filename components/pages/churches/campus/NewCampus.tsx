import { Alert, Modal } from "@mui/material"
import { CampusInfoModalProps } from "./CampusInfoModal"
import AddButton from "@/components/features/AddButton";
import '../../../../components/features/customscroll.css';
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { createCampuse, updateCampuse } from "@/lib/actions/campuse.action";
import { ErrorProps } from "@/types/Types";
import { ICampuse } from "@/lib/database/models/campuse.model";
import SearchSelectZones from "@/components/features/SearchSelectZones";
import SearchSelectChurchForRoomAss from "@/components/features/SearchSelectChurchForRoomAss";

const NewCampus = ({currentCampus, setCurrentCampus, infoMode, setInfoMode}:CampusInfoModalProps) => {
    const handleClose = ()=>{
        setCurrentCampus(null);
        setInfoMode(false);
    }

    const [error, setError] = useState<ErrorProps>({message:'', error:false});
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] =useState<Partial<ICampuse>>({});
    const [zoneId, setZoneId] = useState<string>('');
    const [churchId, setChurchId] = useState<string>('');
    

    const formRef = useRef<HTMLFormElement>(null);

    const handleNewCampus = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setError({message:'', error:false});
        try {
            setLoading(true);
            const body:Partial<ICampuse> = {
                ...data,
                churchId
            };
            const res = await createCampuse(body);
            setError(res);
            formRef.current?.reset();
        } catch (error) {
            console.log(error);
            setError({message:'Error occured adding church', error:true})
        }finally{
            setLoading(false);
        }
    }

    const handleChange = (e:ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>{
        const {name, value} = e.target;
        setData((prev)=>({
            ...prev,
            [name]:value,
        }))
    }

    const handleUpdateCampus = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setError({message:'', error:false});
        try {
            setLoading(true);
            const body:Partial<ICampuse> = {
                _id:currentCampus?._id,
                name:data?.name||currentCampus?.name, 
                type:data?.type||currentCampus?.type, 
            };
            const res = await updateCampuse(body);
            // const result = res?.payload as ICampuse;
            // setCurrentCampus(result);
            // console.log(body)
            setError(res);
            formRef.current?.reset();
        } catch (error) {
            console.log(error);
            setError({message:'Error occured adding campus', error:true})
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
            <form onSubmit={currentCampus? handleUpdateCampus : handleNewCampus}  ref={formRef}  className="new-modal scrollbar-custom overflow-y-scroll">
                <span className='text-[1.5rem] font-bold dark:text-slate-200' >{currentCampus ? "Edit Campus":"Create Campus"}</span>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Name</span>
                        <input name="name" onChange={handleChange} required={!currentCampus} defaultValue={currentCampus?currentCampus.name : ''} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Type</span>
                        <select onChange={handleChange} defaultValue={currentCampus?.type}  className="bg-transparent dark:text-white outline-none border rounded py-1" name='type' >
                            <option className="dark:bg-[#0F1214]" value="">Select</option>
                            <option className="dark:bg-[#0F1214]" value="Adults">Adults</option>
                            <option className="dark:bg-[#0F1214]" value="Children">Children</option>
                            <option className="dark:bg-[#0F1214]" value="Online">Online</option>
                        </select>
                    </div>
                    
                    {
                        !currentCampus &&
                        <>
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Set Zone</span>
                            <SearchSelectZones require={true} isGeneric setSelect={setZoneId} className="dark:text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Set Church</span>
                            <SearchSelectChurchForRoomAss require={true} zoneId={zoneId} isGeneric setSelect={setChurchId} className="dark:text-white" />
                        </div>
                        </>
                    }
                </div>

                {
                    error?.message &&
                    <Alert onClose={()=>setError(null)} severity={error.error ? `error`:'success'} >{error.message}</Alert>
                }

                <div className="flex flex-row items-center justify-between">
                    <AddButton disabled={loading} type="submit"  className='rounded w-[45%] justify-center' text={loading? 'loading...' : currentCampus? 'Update':'Add'} smallText noIcon />
                    <AddButton disabled={loading}  className='rounded w-[45%] justify-center' text='Cancel' isCancel onClick={handleClose} smallText noIcon />
                </div>
            </form>
        </div>
    </Modal>
  )
}

export default NewCampus