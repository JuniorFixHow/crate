import Title from '@/components/features/Title'
import React from 'react'
import ZonesTable from './ZonesTable'

const ZonesMain = () => {
  return (
    <div className='flex flex-col gap-4 flex-wrap' >
      <Title text='Zones' />
      <ZonesTable/>
    </div>
  )
}

export default ZonesMain