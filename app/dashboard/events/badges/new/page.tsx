import NewBadgeSearch from '@/features/badges/NewBadgeSearch'
import Title from '@/features/Title'
import {IoIosArrowForward} from 'react-icons/io'
import { IoCheckmarkCircleOutline } from 'react-icons/io5'

const page = () => {
  return (
    <div className='flex flex-col gap-6 p-4 pl-8 xl:pl-4' >
        <div className="flex flex-row items-baseline gap-2">
            <Title clickable link='/dashboard/events/badges' text='Badges' />
            <IoIosArrowForward/>
            <Title text='New Badge' />
        </div>

        <div className="flex flex-row items-center gap-4 px-4 py-1 bg-white dark:bg-black border w-fit">
            <IoCheckmarkCircleOutline className='text-blue-700' />
            <div className="flex flex-row">
                <span className='text-red-700 font-medium' >36</span>
                <span className='font-medium' >/40</span>
            </div>
        </div>
        <NewBadgeSearch/>
    </div>
  )
}

export default page