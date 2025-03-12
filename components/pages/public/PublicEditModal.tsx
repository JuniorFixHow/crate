import AddButton from "@/components/features/AddButton"
import Subtitle from "@/components/features/Subtitle"
import { updateCYPSet } from "@/lib/actions/cypset.action"
// import SearchSelectEventsV3 from "@/components/features/SearchSelectEventsV3"
import { ICYPSet } from "@/lib/database/models/cypset.model"
import { Modal } from "@mui/material"
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"
import { enqueueSnackbar } from "notistack"
import { Dispatch, FormEvent, SetStateAction, useState } from "react"

type PublicEditModalProps = {
    infoMode:boolean,
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<ICYPSet[], Error>>,
    currentSet:ICYPSet|null
}

const PublicEditModal = ({infoMode, currentSet, refetch, setInfoMode}:PublicEditModalProps) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    // const [eventId, setEventId] = useState<string>('');


    const handleClose =()=>setInfoMode(false);

    const handleUpdateSet = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try {
            setLoading(true);
            if(currentSet){
                const data:Partial<ICYPSet> = {
                    title:title || currentSet?.title,
                    description: description || currentSet?.description
                }
                const res = await updateCYPSet(currentSet?._id, data);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                refetch();
                setInfoMode(false);
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured updating the set');
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
            <form  onSubmit={handleUpdateSet}  className="new-modal scrollbar-custom overflow-y-scroll">
                <Subtitle text="Edit Set" />
                <div className="flex flex-col gap-5">
                    {/* <SearchSelectEventsV3 value={event?.name} setSelect={setEventId} require /> */}
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Title</span>
                        <input defaultValue={currentSet?.title} onChange={(e)=>setTitle(e.target.value)} name='title' required  type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Description</span>
                        <textarea defaultValue={currentSet?.description} onChange={(e)=>setDescription(e.target.value)} name='description' required   className='border rounded px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                </div>
                <div className="flex justify-center gap-3 w-full">
                    <AddButton isCancel type="button" text='Cancel' onClick={handleClose} noIcon smallText className="rounded" />
                    <AddButton type="submit" text={loading? "loading..." :"Proceed"} noIcon smallText className="rounded" />
                </div>
            </form>
        </div>
    </Modal>
  )
}

export default PublicEditModal