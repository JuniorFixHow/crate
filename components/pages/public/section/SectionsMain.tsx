import Title from '@/components/features/Title'
import React from 'react'
import { IoIosArrowForward } from 'react-icons/io'
import SectionsTable from './SectionsTable'

const SectionsMain = () => {
  return (
    <div className='page' >
      <div className="flex flex-row gap-2 items-baseline">
        <Title clickable link="/dashboard/events/public" text="Public" />
        <IoIosArrowForward/>
        <Title text="Sections" />
      </div>
      <SectionsTable/>
    </div>
  )
}

export default SectionsMain