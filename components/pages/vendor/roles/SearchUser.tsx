'use client'
import { IVendor } from '@/lib/database/models/vendor.model'
import React, { Dispatch, SetStateAction, useState } from 'react'
import SearchUserBar from './misc/SearchUserBar';
import { useFetchVendorsQuery } from '@/hooks/fetch/useVendor';
import { LiaTimesSolid } from 'react-icons/lia';
import SearchUserItem from './misc/SearchUserItem';
import { SearchUserReversed } from './fxn';
import { useAuth } from '@/hooks/useAuth';
// import { SessionPayload } from '@/lib/session';

type SearchUserProps = {
    selection:IVendor[];
    setSelection:Dispatch<SetStateAction<IVendor[]>>
}

const SearchUser = ({selection, setSelection}:SearchUserProps) => {
    const [search, setSearch] = useState<string>('');
    const {users} = useFetchVendorsQuery();
    const {user} = useAuth();

    // console.log(users)

    const unslect = (user:IVendor)=>{
        setSelection((pre)=>{
            return pre.filter((item)=>item._id !== user?._id)
        })
    }
  return (
    <div className='flex flex-col' >
        <div className="flex bg-white dark:bg-transparent dark:border p-4">
            <SearchUserBar setSearch={setSearch} />
        </div>
        <hr className='w-full border-slate-300' />
        <div className="flex flex-col gap-4 bg-white dark:bg-transparent dark:border p-4" >
            <div className="flex gap-6 w-full">
                {
                    selection?.map((user)=>(
                        <div onClick={()=>unslect(user)} key={user?._id} className="flex gap-1 p-2 items-center rounded-full bg-slate-400 cursor-pointer">
                            <span>{user?.name}</span>
                            <LiaTimesSolid className='dark:text-white text-red-700' size={18} />
                        </div>
                    ))
                }
            </div>

            <div className="flex flex-col gap-6">
                {
                    SearchUserReversed(users as IVendor[], search)
                    ?.filter((item)=>item._id !== user?.userId)
                    ?.map((vendor)=>{
                        const isSelected = selection.find((item)=>item?._id === vendor?._id);
                        return(
                            <SearchUserItem
                             isSlected={!!isSelected}
                             setSelection={setSelection}
                             vendor={vendor}  
                             key={vendor?._id} 
                            />
                        )
                    })
                }
            </div>
        </div>
    </div>
  )
}

export default SearchUser