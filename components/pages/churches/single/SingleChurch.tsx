import Title from '@/components/features/Title'
import { IChurch } from '@/lib/database/models/church.model'
import React from 'react'
import { IoIosArrowForward } from 'react-icons/io'
import ChurchDetails from '../new/ChurchDetails'

export type SingleChurchProps ={
    currentChurch:IChurch
}

const SingleChurch = ({currentChurch}:SingleChurchProps) => {
  return (
    <div className='page' >
        <div className="flex flex-row gap-2 items-baseline">
          <Title clickable link="/dashboard/churches" text="Churches" />
          <IoIosArrowForward/>
          <Title text="Church Details" />
        </div>
        <ChurchDetails currentChurch={currentChurch} />
    </div>
  )
}

export default SingleChurch