'use cleint'
import { useFetchCYPSetForEvent } from "@/hooks/fetch/useCYPSet";
import { CircularProgress, Modal } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { IoClose } from "react-icons/io5";
import '@/components/features/customscroll.css';
import { ICYPSet } from "@/lib/database/models/cypset.model";
import { ISection } from "@/lib/database/models/section.model";
import QuestionSheet from "../pages/public/QuestionSheet";
// import Subtitle from "../features/Subtitle";

type QuestionStarterProps = {
    start:boolean;
    setStart:Dispatch<SetStateAction<boolean>>;
    eventId:string;
    memberId:string;
}

const QuestionStarter = ({start, eventId, memberId, setStart}:QuestionStarterProps) => {

    const {cypsets, loading} = useFetchCYPSetForEvent(eventId);
    const [openQuestion, setOpenQuestion] = useState<boolean>(false);
    const [currentSet, setCurrentSet] = useState<ICYPSet|null>(null);

    const sections = currentSet?.sections as ISection[];

    const handleClose = ()=>setStart(false);

    const handleOpenQuestion = (item:ICYPSet)=>{
        setOpenQuestion(true);
        setCurrentSet(item)
    };

  return (
    <Modal
        open={start}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <div className="flex-center fixed inset-0 flex items-center justify-center bg-[#F0EBF8]">
            <IoClose onClick={handleClose}  className="absolute right-4 top-4 text-red-600 cursor-pointer" size={30} />
                {
                    loading ? 
                    <CircularProgress size='3rem' />
                    :
                    <>
                    {
                        !openQuestion &&
                        <div className="h-[15rem] md:h-[18rem] scrollbar-custom2 w-[20rem] px-8 gap-6 md:w-[26rem] lg:w-[30rem] overflow-y-auto snap-y snap-mandatory">
                            {cypsets?.map((set) => (
                                <div key={set?._id} className="h-full w-full flex items-center justify-center snap-start">
                                    <div className="bg-white shadow-lg flex flex-col gap-4 w-full h-full rounded-md dark:bg-transparent dark:border p-2 md:p-4">
                                        <div className="flex flex-col grow gap-4">
                                            <span className="text-[1.5rem] font-bold" >{set?.title}</span>
                                            <span className="block font-semibold sm:hidden">{set?.description.slice(0, 30)}...</span>
                                            <span className="hidden sm:block font-semibold md:hidden">{set?.description.slice(0, 50)}...</span>
                                            <span className="hidden md:block font-semibold lg:hidden">{set?.description.slice(0, 100)}...</span>
                                            <span className="hidden lg:block font-semibold">{set?.description}</span>
                                        </div>
                                        <button onClick={()=>handleOpenQuestion(set)}  className="border-none w-fit self-end px-4 py-2 rounded bg-gradient-to-br from-blue-500 to-red-500 text-white" >Start</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                    </>
                }



                {/* Map Questions Here */}
                {
                    openQuestion &&
                    <div className="flex h-[95%] w-[90%] lg:w-[60%]">
                        <QuestionSheet setStart={setStart} memberId={memberId} eventId={eventId} sections={sections} setOpen={setOpenQuestion} />
                    </div>
                }
        </div>
    </Modal>
  )
}

export default QuestionStarter