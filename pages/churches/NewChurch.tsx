import { Modal } from "@mui/material"
import { ChurchInfoModalProps } from "./ChurchInfoModal"
import AddButton from "@/features/AddButton";
import '../../features/customscroll.css';

const NewChurch = ({currentChurch, setCurrentChurch, infoMode, setInfoMode}:ChurchInfoModalProps) => {
    const handleClose = ()=>{
        setCurrentChurch(null);
        setInfoMode(false);
    }
  return (
    <Modal
        open={infoMode}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
        >
        <div className='flex size-full items-center justify-center'>
            <div className="new-modal scrollbar-custom overflow-y-scroll">
                <span className='text-[1.5rem] font-bold dark:text-slate-200' >{currentChurch ? "Edit Church":"Create Church"}</span>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Church name</span>
                        <input defaultValue={currentChurch?currentChurch.name : ''} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Pastor name</span>
                        <input defaultValue={currentChurch?currentChurch.pastor : ''} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Zone</span>
                        <select  className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' defaultValue={currentChurch?currentChurch.zone:'Zone A'} name="country">
                            <option className='dark:bg-black dark:text-white' value="Zone A">Zone A</option>
                            <option className='dark:bg-black dark:text-white' value="Zone B">Zone B</option>
                        </select>
                        {/* <input type="text" className=' border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' /> */}
                    </div>
                    
                </div>



                <div className="flex flex-row items-center justify-between">
                    <AddButton className='rounded w-[45%] justify-center' text={currentChurch? 'Update':'Add'} smallText noIcon />
                    <AddButton className='rounded w-[45%] justify-center' text='Cancel' isCancel onClick={handleClose} smallText noIcon />
                </div>
            </div>
        </div>
    </Modal>
  )
}

export default NewChurch