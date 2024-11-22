import AddButton from '@/features/AddButton'
import { ZoneProps } from '@/types/Types'
import { Modal } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'
import '../../features/customscroll.css';

type NewZoneProps = {
    openZone:boolean,
    setOpenZone:Dispatch<SetStateAction<boolean>>,
    currentZone:ZoneProps|null,
    setCurrentZone:Dispatch<SetStateAction<ZoneProps|null>>
}

const NewZone = ({openZone, setOpenZone, currentZone, setCurrentZone}:NewZoneProps) => {
    const handleClose=()=>{
        setOpenZone(false);
        setCurrentZone(null);
    }
  return (
    <Modal
        open={openZone}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
        >
        <div className='flex size-full items-center justify-center'>
            <div className="new-modal scrollbar-custom overflow-y-scroll">
                <span className='text-[1.5rem] font-bold dark:text-slate-200' >{currentZone ? "Edit Zone":"Create Zone"}</span>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Zone name</span>
                        <input defaultValue={currentZone?currentZone.name : ''} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Country</span>
                        <select  className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' defaultValue={currentZone?currentZone.country:'USA'} name="country">
                            <option className='dark:bg-black dark:text-white' value="USA">USA</option>
                            <option className='dark:bg-black dark:text-white' value="Ghana">Ghana</option>
                        </select>
                        {/* <input type="text" className=' border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' /> */}
                    </div>
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Region/State</span>
                        <input defaultValue={currentZone?currentZone.state : ''} type="text" className=' border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                </div>

                <div className="flex flex-row items-center justify-between">
                    <AddButton className='rounded w-[45%] justify-center' text={currentZone? 'Update':'Add'} smallText noIcon />
                    <AddButton className='rounded w-[45%] justify-center' text='Cancel' isCancel onClick={handleClose} smallText noIcon />
                </div>
            </div>
        </div>
    </Modal>
  )
}

export default NewZone