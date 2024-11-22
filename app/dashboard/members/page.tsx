import FilterBar from '@/components/FilterBar'
import AddButton from '@/features/AddButton'
import Title from '@/features/Title'
import MembersTable from '@/tables/MembersTable'
import React from 'react'

const Members = () => {
  
  return (
    <div className='flex flex-col gap-4 p-4 pl-8 xl:pl-4' >
      <Title text='Member Registration' />
      <div className="flex flex-row items-center justify-between">
        <FilterBar/>
        <AddButton className='self-start' text='Add Member' />
      </div>

      <MembersTable/>
    </div>
  )
}

export default Members