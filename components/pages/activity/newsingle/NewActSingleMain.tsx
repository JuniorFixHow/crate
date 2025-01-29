import Title from '@/components/features/Title'
import { IActivity } from '@/lib/database/models/activity.model'
import React from 'react'
import { IoIosArrowForward } from 'react-icons/io'

type NewActSingleMainProps = {
    currentActivity:IActivity
}

const NewActSingleMain = ({currentActivity}:NewActSingleMainProps) => {
  return (
    <div className='page' >
        <div className="flex flex-row gap-2 items-baseline">
          <Title clickable link="/dashboard/activities" text="Activities" />
          <IoIosArrowForward/>
          <Title text={currentActivity?.name} />
        </div>
    </div>
  )
}

export default NewActSingleMain