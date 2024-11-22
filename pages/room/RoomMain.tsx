import Title from '@/features/Title'
import React from 'react'
import RoomTable from './RoomTable'

const RoomMain = () => {
  return (
    <div className='page' >
        <Title text='Rooms' />
        <RoomTable/>
    </div>
  )
}

export default RoomMain