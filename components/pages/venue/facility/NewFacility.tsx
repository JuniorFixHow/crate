import { Alert, Modal } from "@mui/material"
import AddButton from "@/components/features/AddButton";
import '@/components/features/customscroll.css';
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useRef, useState } from "react";
import { ErrorProps } from "@/types/Types";
import { IFacility } from "@/lib/database/models/facility.model";
import { createFacility, updateFacility } from "@/lib/actions/facility.action";
import { useAuth } from "@/hooks/useAuth";
import SearchSelectVenues from "@/components/features/SearchSelectVenue";
import { canPerformAction, facilityRoles } from "@/components/auth/permission/permission";

export type NewSingleFacilityProps = {
    currentFacility:IFacility | null;
    setCurrentFacility:Dispatch<SetStateAction<IFacility|null>>;
    infoMode:boolean;
    setInfoMode:Dispatch<SetStateAction<boolean>>;
}

const NewSingleFacility = ({currentFacility, setCurrentFacility,  infoMode, setInfoMode}:NewSingleFacilityProps) => {
    const handleClose = ()=>{
        setCurrentFacility(null);
        setInfoMode(false);
    }

    const [error, setError] = useState<ErrorProps>({message:'', error:false});
    const [loading, setLoading] = useState<boolean>(false);
    const [venueId, setVenueId] = useState<string>('');
    const [data, setData] =useState<Partial<IFacility>>({});
    const {user} = useAuth();
  
    const updater = canPerformAction(user!, 'updater', {facilityRoles})

    const formRef = useRef<HTMLFormElement>(null);

    const handleNewSingleFacility = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setError(null);
        try {
            setLoading(true);
            const body:Partial<IFacility> = {
                ...data,
                venueId,
                churchId:user?.churchId
            }
            const res = await createFacility(body);
            setError(res);
            formRef.current?.reset();
        } catch (error) {
            console.log(error);
            setError({message:'Error occured adding facility', error:true})
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

    const handleUpdateFacility = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setError(null);
        try {
            setLoading(true);
            const body:Partial<IFacility> = {
                _id:currentFacility?._id,
                name:data?.name||currentFacility?.name, 
                rooms:data?.rooms||currentFacility?.rooms, 
                floor:data?.floor||currentFacility?.floor, 
            };
            const res = await updateFacility(body);
            setError(res);
            formRef.current?.reset();
        } catch (error) {
            console.log(error);
            setError({message:'Error occured updating facility', error:true})
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
            <form onSubmit={currentFacility? handleUpdateFacility : handleNewSingleFacility}  ref={formRef}  className="new-modal scrollbar-custom overflow-y-scroll">
                <span className='text-[1.5rem] font-bold dark:text-slate-200' >{currentFacility ? "Edit Facility":"Create Facility"}</span>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Set Venue</span>
                        <SearchSelectVenues require={!currentFacility} isGeneric setSelect={setVenueId} />
                    </div>
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Name</span>
                        <input name="name" onChange={handleChange} required={!currentFacility} defaultValue={currentFacility ? currentFacility.name : ''} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Rooms</span>
                        <input name="rooms" onChange={handleChange} required={!currentFacility} defaultValue={currentFacility ? currentFacility?.rooms : ''} type="number" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Floors</span>
                        <input name="floor" onChange={handleChange} defaultValue={currentFacility ? currentFacility?.floor : ''} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                                      
                </div>

                {
                    error?.message &&
                    <Alert onClose={()=>setError(null)} severity={error.error ? `error`:'success'} >{error.message}</Alert>
                }

                <div className="flex flex-row items-center justify-between">
                    <AddButton disabled={loading} type="submit"  className={`${currentFacility && !updater && 'hidden'} rounded w-[45%] justify-center`} text={loading? 'loading...' : currentFacility? 'Update':'Add'} smallText noIcon />
                    <AddButton disabled={loading} type="button"  className='rounded w-[45%] justify-center' text='Cancel' isCancel onClick={handleClose} smallText noIcon />
                </div>
            </form>
        </div>
    </Modal>
  )
}

export default NewSingleFacility