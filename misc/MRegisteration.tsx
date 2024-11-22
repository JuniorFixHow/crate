'use client'
import SearchSelectGroup from '@/features/SearchSelectGroup';
import { IoMdClose } from "react-icons/io";
import { Dispatch, SetStateAction, useState } from 'react';
import { MemberProps } from '@/types/Types';
import AddButton from '@/features/AddButton';

export type MRegisterationProps = {
    setHasOpen?:Dispatch<SetStateAction<boolean>>,
    currentMemeber?:MemberProps
}

const MRegisteration = ({currentMemeber, setHasOpen}:MRegisterationProps ) => {
    const [openDrop, setOpenDrop] = useState<boolean>(false);
    const [selected, setSelected] = useState<string>('');

  return (
    <form   className='px-8 py-4 flex-col dark:bg-black dark:border flex md:flex-row gap-6 md:gap-12 items-start bg-white' >
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
                <span className='text-slate-400 font-semibold text-[0.8rem]' >Full Name</span>
                <input defaultValue={currentMemeber?.name} placeholder='type here...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="name"  />
            </div>
            <div className="flex flex-col gap-1">
                <span className='text-slate-400 font-semibold text-[0.8rem]' >Email</span>
                <input defaultValue={currentMemeber?.email} placeholder='type here...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="email" name="email"  />
            </div>
            <div className="flex flex-col gap-1">
                <span className='text-slate-400 font-semibold text-[0.8rem]' >Phone Number</span>
                <input placeholder='eg. +1xxxxxxx' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='tel' name="phone"  />
            </div>

            <div className="flex flex-row gap-12 items-start">
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Type</span>
                    <select className='border text-slate-400 p-1 font-semibold text-[0.8rem] rounded bg-transparent outline-none' defaultValue={currentMemeber?.registerType} >
                        <option className='dark:bg-black' value="Individual">Individual</option>
                        <option className='dark:bg-black' value="Family">Family</option>
                        <option className='dark:bg-black' value="Group">Group</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Age Group</span>
                    <select className='border text-slate-400 p-1 font-semibold text-[0.8rem] rounded bg-transparent outline-none' defaultValue={currentMemeber?.ageRange} >
                        <option className='dark:bg-black' value="0-17">0-17</option>
                        <option className='dark:bg-black' value="18-35">18-35</option>
                        <option className='dark:bg-black' value="36-50">36-50</option>
                        <option className='dark:bg-black' value="Above 50">Above 50</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <div className="flex flex-row items-center justify-between">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Choose Group</span>
                    {
                        openDrop &&
                        <IoMdClose onClick={()=>setOpenDrop(false)}  className='cursor-pointer' color='crimson' />
                    }
                </div>
                <SearchSelectGroup text={selected ? selected : currentMemeber?.groupId ? currentMemeber?.groupId :'' } setText={setSelected } value={openDrop} setValue={setOpenDrop} />
            </div>

            <div className="flex flex-row gap-12 items-start">
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Gender</span>
                    <div className="flex flex-row items-center gap-2">
                        <input defaultChecked={currentMemeber?.gender==='Male'} type="radio" name="Gender" value='Male'  />
                        <span className='font-semibold text-[0.8rem]' >Male</span>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <input defaultChecked={currentMemeber?.gender==='Female'} type="radio" name="Gender" value='Female'  />
                        <span className='font-semibold text-[0.8rem]' >Female</span>
                    </div>
                  
         
                </div>

                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Status</span>
                    
                    <div className="flex flex-row items-center gap-2">
                        <input defaultChecked={currentMemeber?.status === 'Member'} type="radio" name="Status" value='Member'  />
                        <span className='font-semibold text-[0.8rem]' >Member</span>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <input defaultChecked={currentMemeber?.status === 'Non-member'} type="radio" name="Status" value='Non-member'  />
                        <span className='font-semibold text-[0.8rem]' >Non-member</span>
                    </div>
                </div>
            </div>

        </div>

            {/* RIGHT SIDE */}

        <div className="flex flex-col gap-5">

            <div className="flex flex-row gap-12 items-start">
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Voice</span>
                    <select className='border text-slate-400 p-1 font-semibold text-[0.8rem] rounded bg-transparent outline-none' defaultValue='None' >
                        <option className='dark:bg-black' value="None">None</option>
                        <option className='dark:bg-black' value="Soprano">Soprano</option>
                        <option className='dark:bg-black' value="Tenor">Tenor</option>
                        <option className='dark:bg-black' value="Bass">Bass</option>
                        <option className='dark:bg-black' value="All">All</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Marital Status</span>
                    <select className='border text-slate-400 p-1 font-semibold text-[0.8rem] rounded bg-transparent outline-none' defaultValue='Single' >
                        <option className='dark:bg-black' value="Single">Single</option>
                        <option className='dark:bg-black' value="Married">Married</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <span className='text-slate-400 font-semibold text-[0.8rem]' >Dietary Preference</span>
                <div className="flex flex-row items-center gap-2">
                    <input defaultChecked type="radio" name="dtr" value='No'  />
                    <span className='font-semibold text-[0.8rem]' >No</span>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <input type="radio" name="dtr" value='Yes'  />
                    <span className='font-semibold text-[0.8rem]' >Yes</span>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <span className='text-slate-400 font-semibold text-[0.8rem]' >Allergy</span>
                <textarea  placeholder='allergies separated with comma' className='border rounded resize-none p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]'  name="allergy"  />
            </div>

            <div className="flex flex-col gap-1">
                <span className='text-slate-400 font-semibold text-[0.8rem]' >Registration Note</span>
                <textarea placeholder='say something about this member' className='border rounded p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]'  name="note"  />
            </div>

            <div className="flex flex-row items-center gap-8 mt-4 md:mt-12">
                <AddButton text={currentMemeber?'Save Changes':'Add Member'} noIcon smallText className='rounded' />
                {
                    currentMemeber &&
                    <AddButton onClick={()=>setHasOpen!(false)} text='Cancel' isDanger noIcon smallText className='rounded' />
                }
            </div>
            
        </div>
    </form>
  )
}

export default MRegisteration