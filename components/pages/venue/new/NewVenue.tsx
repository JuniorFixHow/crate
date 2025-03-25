import { IVenue } from "@/lib/database/models/venue.model"
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import { VenueDetailsProps } from "./VenueDetails";
import Address from "@/components/shared/Address";
import AddButton from "@/components/features/AddButton";
import { ErrorProps } from "@/types/Types";
import { Alert } from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import { IFacility } from "@/lib/database/models/facility.model";
import DynamicFacilitiesForm from "./CustomFacilities";
import { createVenue, updateVenue } from "@/lib/actions/venue.action";
import { createFacilities } from "@/lib/actions/facility.action";
import { useRouter } from "next/navigation";
import { canPerformAction, venueRoles } from "@/components/auth/permission/permission";
import { enqueueSnackbar } from "notistack";

export type CustomFacilitiesProps = {
    id: string;
    name: string;
    rooms: number;
    floor: number;
};

const NewVenue = ({currentVenue}:VenueDetailsProps) => {
    const [data, setData] = useState<Partial<IVenue>>({});
    const [location, setLocation] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<ErrorProps>(null);
    const [facilities, setFacilities] = useState<CustomFacilitiesProps[]>([]);
    const {user} = useAuth();

    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    const reader = canPerformAction(user!, 'reader', {venueRoles});
    const updater = canPerformAction(user!, 'updater', {venueRoles});
    const creator = canPerformAction(user!, 'creator', {venueRoles});

    useEffect(()=>{
        if(user && (currentVenue && !reader)){
            router.replace('/dashboard/forbidden?p=Venue Reader')
        }
        else if(user && (!currentVenue && !creator)){
            router.replace('/dashboard/forbidden?p=Venue Creator')
        }
    },[creator, currentVenue, reader, router, updater, user])

    const handleChange = (e:ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>{
        const {name, value} = e.target;
        setData((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    const handleNewVenue = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setResponse(null);
        try {
            setLoading(true);
            const body:Partial<IVenue> = {
                ...data,
                location,
                churchId:user?.churchId,
                // fac
            }
            const res = await createVenue(body);
            enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
            const newVenue = res?.payload as IVenue;
            if(res?.code === 201 && facilities.length > 0){
                const facs:Partial<IFacility>[] = facilities.map((facility)=>({
                    name:facility.name,
                    rooms:facility.rooms,
                    floor:facility.floor,
                    churchId:user?.churchId,
                    venueId:newVenue._id
                }))

                const result = await createFacilities(facs);
                enqueueSnackbar(result?.message, {variant:result?.error ? 'error':'success'});
                formRef.current?.reset();
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured creating venue. Please retry', {variant:'error'});
        }finally{
            setLoading(false);
        }
    }

    const handleUpdateVenue = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try {
            setLoading(true);
            if(currentVenue){
                const body:Partial<IVenue> = {
                    _id:currentVenue?._id,
                    name:data.name || currentVenue?.name,
                    location:location || currentVenue?.location,
                    type:data.type || currentVenue?.location,
                }
                const res = await updateVenue(body);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
            }
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

  return (
    <form ref={formRef} onSubmit={ currentVenue ? handleUpdateVenue : handleNewVenue}  className="flex flex-col gap-5 h-full justify-between" >
        <div className="flex flex-col gap-4">
            <div className="flex flex-col">
                <span className='text-slate-500 text-[0.8rem] font-semibold' >Name</span>
                <input onChange={handleChange} name="name" required={!currentVenue} defaultValue={currentVenue?currentVenue.name : ''} type="text" className='border-b w-[18rem] px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-slate-400 font-semibold text-[0.8rem]">Type</span>
                <select
                    required
                    onChange={handleChange}
                    name="type"
                    defaultValue={currentVenue? currentVenue?.type:''}
                    className="border text-slate-400 p-1 w-fit font-semibold text-[0.8rem] rounded bg-transparent outline-none"
                >
                    <option className="dark:bg-black" value="">select</option>
                    <option className="dark:bg-black" value="University">University</option>
                    <option className="dark:bg-black" value="Hotel">Hotel</option>
                    <option className="dark:bg-black" value="Retreat Center">Retreat Center</option>
                    <option className="dark:bg-black" value="Camp Site">Camp Site</option>
                    
                </select>
            </div>

            <div className="flex flex-col">
                <span className='text-slate-500 text-[0.8rem] font-semibold' >Location</span>
                <Address setAddress={setLocation} className="w-[18rem]" country={currentVenue?.location} />
            </div>
            {
                !currentVenue &&
                <DynamicFacilitiesForm setFacilities={setFacilities} facilities={facilities} />
            }
        </div>
        <div className="flex flex-col gap-4">
            {
                response?.message &&
                <Alert onClose={()=>setResponse(null)} severity={response.error?'error':'success'} >{response.message}</Alert>
            }
            <div className="flex gap-5 items-center">
                <AddButton disabled={loading} noIcon smallText className={`rounded ${currentVenue && !updater && 'hidden'} ${!currentVenue && !creator && 'hidden'}`} text={loading ? 'loading...':currentVenue ?'Save Changes':'Proceed'} />
                <AddButton disabled={loading} onClick={()=>router.back()} type="button" isDanger noIcon smallText className="rounded" text="Back" />
            </div>
        </div>
    </form>
  )
}

export default NewVenue