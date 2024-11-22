import AddButton from '@/features/AddButton'
import React from 'react'

const NewGroupDown = () => {
  return (
    <div className='flex flex-col gap-5 mt-5' >
        <div className="flex flex-col">
            <span className='text-slate-500 text-[0.8rem] font-semibold' >Group name</span>
            <input required type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
        </div>

        <div className="flex flex-col gap-2">
            <span className='text-slate-500 text-[0.8rem] font-semibold' >Type</span>
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <input defaultChecked type="radio" name="type" value='Family' />
                    <span className='text-[0.8rem] dark:text-white' >Family</span>
                </div>
                <div className="flex gap-2">
                    <input type="radio" name="type" value='Group' />
                    <span className='text-[0.8rem] dark:text-white' >Group</span>
                </div>
            </div>
        </div>

        <AddButton text='Create Group' noIcon smallText className='rounded py-1 w-fit self-end' />
    </div>
  )
}

export default NewGroupDown