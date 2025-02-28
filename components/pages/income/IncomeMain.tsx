import Title from '@/components/features/Title'
import React from 'react'
// import { IoIosArrowForward } from 'react-icons/io'
import IncomeTable from './IncomeTable'

const IncomeMain = () => {
  return (
   <div className="page">
     <div className="flex flex-row gap-2 items-baseline">
        <Title text='Expected Income' />
    </div>
    <IncomeTable/>
   </div>
  )
}

export default IncomeMain