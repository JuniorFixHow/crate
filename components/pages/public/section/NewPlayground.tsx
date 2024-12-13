import Title from '@/components/features/Title'
import { ICYPSet } from '@/lib/database/models/cypset.model'
import { ISection } from '@/lib/database/models/section.model'
import React from 'react'
import { IoIosArrowForward } from 'react-icons/io'
import NewEditor from './NewEditor'

export type NewPlaygroundProps = {
    currentSection:ISection
}

const NewPlayground = ({currentSection}:NewPlaygroundProps) => {
    const set = currentSection?.cypsetId as unknown as ICYPSet
  return (
    <div className='page' >
      <div className="flex flex-row gap-2 items-baseline">
        <Title clickable link={`/dashboard/events/public`} text={`Public`} />
        <IoIosArrowForward/>
        <Title clickable link={`/dashboard/events/public/${set?._id}`} text={`${set?.title}`} />
        <IoIosArrowForward/>
        <Title text={currentSection?.title} />
      </div>
      <NewEditor currentSection={currentSection} />
    </div>
  )
}

export default NewPlayground