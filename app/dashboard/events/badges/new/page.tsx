// import NewBadgeSearch from '@/components/features/badges/NewBadgeSearch'
import NewBadgeSearchV2 from '@/components/features/badges/NewBadgeSearchV2'
import Title from '@/components/features/Title'
import {IoIosArrowForward} from 'react-icons/io'
// import { IoCheckmarkCircleOutline } from 'react-icons/io5'

const page = () => {
  return (
    <div className='flex flex-col gap-6 p-4 pl-8 xl:pl-4' >
        <div className="flex flex-row items-baseline gap-2">
            <Title clickable link='/dashboard/events/badges' text='Registrations' />
            <IoIosArrowForward/>
            <Title text='New Badge' />
        </div>
        <NewBadgeSearchV2/>
    </div>
  )
}

export default page