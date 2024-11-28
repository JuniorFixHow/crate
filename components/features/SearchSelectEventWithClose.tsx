import { BooleanStateProp, StringStateProp } from '@/types/Types'
import { ComponentProps } from 'react'
import { IoCloseSharp } from 'react-icons/io5'
import SearchSelectEvent from './SearchSelectEvent'

type SearchSelectEventProps = StringStateProp &
BooleanStateProp & ComponentProps<'div'> & {forSession?:boolean}
const SearchSelectEventWithClose = ({text, setText, value, forSession, setValue, className, ...props}:SearchSelectEventProps) => {
  return (
    <div className="flex flex-row relative w-fit">
    {
        value &&
        <IoCloseSharp className="text-red-700 cursor-pointer absolute -top-4 right-0 z-50" onClick={()=>setValue(false)} />
    }
    <SearchSelectEvent forSession={forSession} className={className} {...props} value={value} setValue={setValue} setText={setText} text={text} />
</div>
  )
}

export default SearchSelectEventWithClose
