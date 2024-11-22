import Title from '@/features/Title'
import React from 'react'
import GroupNumber from './GroupNumber'
import GroupTable from './GroupTable'

const GroupMain = () => {
  return (
    <div className='page' >
      <Title text='Groups/Family' />
      <GroupNumber/>
      <GroupTable/>
    </div>
  )
}

export default GroupMain