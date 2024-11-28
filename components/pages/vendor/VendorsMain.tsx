import Title from '@/components/features/Title'
import React from 'react'
import VendorsTable from './VendorsTable'

const VendorsMain = () => {
  return (
    <div className='page' >
      <Title text='Vendors' />
      <VendorsTable/>
    </div>
  )
}

export default VendorsMain