import React from 'react'
import ChurchTable from './ChurchTable'
import Title from '@/features/Title'

const ChurchMain = () => {
  return (
    <div className='flex flex-col gap-4 flex-wrap' >
      <Title text='Churches' />
      <ChurchTable/>
    </div>
  )
}

export default ChurchMain