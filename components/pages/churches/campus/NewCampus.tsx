import {  Modal } from "@mui/material"
import { CampusInfoModalProps } from "./CampusInfoModal"
import AddButton from "@/components/features/AddButton";
import '../../../../components/features/customscroll.css';
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { createCampuse, updateCampuse } from "@/lib/actions/campuse.action";
// import { ErrorProps } from "@/types/Types";
import { ICampuse } from "@/lib/database/models/campuse.model";
// import SearchSelectZones from "@/components/features/SearchSelectZones";
// import SearchSelectChurchForRoomAss from "@/components/features/SearchSelectChurchForRoomAss";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import SearchSelectZoneV2 from "@/components/features/SearchSelectZonesV2";
import SearchSelectChurchesWithZone from "@/components/features/SearchSelectChurchesWithZone";

export type NewCampusProps = {
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<ICampuse[], Error>>
} & CampusInfoModalProps

const NewCampus = ({currentCampus, setCurrentCampus, infoMode, refetch, setInfoMode}:NewCampusProps) => {
    const handleClose = ()=>{
        setCurrentCampus(null);
        setInfoMode(false);
    }

    // const [error, setError] = useState<ErrorProps>({message:'', error:false});
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] =useState<Partial<ICampuse>>({});
    const [zoneId, setZoneId] = useState<string>('');
    const [churchId, setChurchId] = useState<string>('');
    

    const formRef = useRef<HTMLFormElement>(null);

    const handleNewCampus = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try {
            setLoading(true);
            const body:Partial<ICampuse> = {
                ...data,
                churchId
            };
            const res = await createCampuse(body);
            enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
            formRef.current?.reset();
            refetch();
            setInfoMode(false);
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured adding campus', {variant:'error'});
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
        // setError({message:'', error:false});
        try {
            setLoading(true);
            const body:Partial<ICampuse> = {
                _id:currentCampus?._id,
                name:data?.name||currentCampus?.name, 
                type:data?.type||currentCampus?.type, 
            };
            const res = await updateCampuse(body);
            setInfoMode(false);
            // const result = res?.payload as ICampuse;
            // setCurrentCampus(result);
            // console.log(body)
            formRef.current?.reset();
            enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured adding campus', {variant:'error'});
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
                            <SearchSelectZoneV2 require={true} width={290}  setSelect={setZoneId}  />
                        </div>
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Set Church</span>
                            <SearchSelectChurchesWithZone require={true} width={290} zoneId={zoneId} setSelect={setChurchId}  />
                        </div>
                        </>
                    }
                </div>

                {/* {
                    error?.message &&
                    <Alert onClose={()=>setError(null)} severity={error.error ? `error`:'success'} >{error.message}</Alert>
                } */}

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