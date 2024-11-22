import SearchSelectChurch from '@/components/shared/SearchSelectChurch'
import AddButton from '@/features/AddButton'
import { VendorProps } from '@/types/Types'
import { Modal } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'
import '../../features/customscroll.css';

type NewVendorProps = {
    openVendor:boolean,
    setOpenVendor:Dispatch<SetStateAction<boolean>>,
    currentVendor:VendorProps|null,
    setCurrentVendor:Dispatch<SetStateAction<VendorProps|null>>
}

const NewVendor = ({openVendor, setOpenVendor, currentVendor, setCurrentVendor}:NewVendorProps) => {
    const handleClose=()=>{
        setOpenVendor(false);
        setCurrentVendor(null);
    }
  return (
    <Modal
        open={openVendor}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
        >
        <div className='flex size-full flex-center'>
            <div className="new-modal scrollbar-custom overflow-y-scroll">
                <span className='text-[1.5rem] font-bold dark:text-slate-200' >{currentVendor ? "Edit Vendor":"Create Vendor"}</span>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Full name</span>
                        <input defaultValue={currentVendor?currentVendor.name : ''} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>
                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Gender</span>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <input defaultChecked={currentVendor?.gender==='Male'} type="radio" name="gender" value='Male' />
                                <span className='text-[0.8rem] dark:text-white' >Male</span>
                            </div>
                            <div className="flex gap-2">
                                <input defaultChecked={currentVendor?.gender==='Female'} type="radio" name="gender" value='Female' />
                                <span className='text-[0.8rem] dark:text-white' >Female</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Email</span>
                        <input defaultValue={currentVendor?currentVendor.email : ''} type="email" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>

                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Phone</span>
                        <input defaultValue={currentVendor?currentVendor.phone : ''} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
                    </div>

                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Country</span>
                        <select  className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' defaultValue={currentVendor?currentVendor.country:'USA'} name="country">
                            <option className='dark:bg-black dark:text-white' value="USA">USA</option>
                            <option className='dark:bg-black dark:text-white' value="Ghana">Ghana</option>
                        </select>
                        {/* <input type="text" className=' border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' /> */}
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 md:gap-12 items-start">
                        <div className="flex flex-col gap-2">
                            <span className='text-slate-500 text-[0.8rem]' >Church</span>
                            <SearchSelectChurch isGeneric />
                        </div>

                        <div className="flex flex-col gap-2">
                            <span className='text-slate-500 text-[0.8rem]' >Role</span>
                            <select defaultValue={currentVendor ? currentVendor.role : 'Volunteer'}  className='border rounded py-1 dark:bg-transparent outline-none' name="role" >
                                <option className='bg-white text-black dark:text-white dark:bg-black' value="Volunteer">Volunteer</option>
                                <option className='bg-white text-black dark:text-white dark:bg-black' value="Coordinator">Coordinator</option>
                                <option className='bg-white text-black dark:text-white dark:bg-black' value="Admin">Admin</option>
                            </select>
                        </div>
                    </div>
                    
                </div>

                <div className="flex flex-row items-center justify-between">
                    <AddButton className='rounded w-[45%] justify-center' text={currentVendor? 'Update':'Add'} smallText noIcon />
                    <AddButton className='rounded w-[45%] justify-center' text='Cancel' isCancel onClick={handleClose} smallText noIcon />
                </div>
            </div>
        </div>
    </Modal>
  )
}

export default NewVendor