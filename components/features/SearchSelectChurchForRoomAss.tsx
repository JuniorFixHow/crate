'use client'
import { SearchChurchWithZone } from '@/components/pages/vendor/fxn'
import { useFetchChurches } from '@/hooks/fetch/useChurch'
import { ComponentProps, Dispatch, SetStateAction, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5'


type SearchSelectChurchForRoomAssProps = {
  isGeneric?:boolean,
  require?:boolean,
  zoneId:string,
  setSelect?:Dispatch<SetStateAction<string>>
} & ComponentProps<'div'>

const SearchSelectChurchForRoomAss = ({isGeneric, require, setSelect, zoneId, className, ...props}:SearchSelectChurchForRoomAssProps) => {
    const [search, setSearch] = useState<string>('');
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const {churches} = useFetchChurches();
  return (
    <div {...props}  className={`flex flex-col ${className}`} >
        {
            showSearch &&
            <div className="flex flex-row justify-between items-center px-1">
                <input onChange={(e)=>setSearch(e.target.value)}  className='bg-transparent w-[85%] text-[0.9rem] placeholder:italic border-none outline-none' type="text" placeholder='text here...' />
                <IoCloseSharp onClick={()=>setShowSearch(false)} size={20} className='text-red-700 cursor-pointer' />
            </div>
        }
      <select required={require} onChange={(e)=>setSelect!(e.target.value)}  onClick={()=>setShowSearch(true)}  className={`border rounded py-1  ${!isGeneric && 'bg-[#28469e] text-white'} dark:bg-transparent outline-none`} >
        <option className='bg-white text-black dark:text-white dark:bg-[#0F1214]' value=''  >Churches</option>
        {
            SearchChurchWithZone(churches, search, zoneId).map((church)=>(
              <option className='bg-white text-black dark:text-white dark:bg-[#0F1214]' key={church?._id} value={church?._id}>{church?.name}</option>
            ))
        }
      </select>
    </div>
  )
}

export default SearchSelectChurchForRoomAss
