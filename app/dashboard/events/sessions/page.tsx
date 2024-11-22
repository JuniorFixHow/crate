import Title from '@/features/Title'
import Sessions from '@/pages/session/Sessions'
import React from 'react'

const pages = () => {
  return (
    <div className='flex flex-col gap-6 p-4 pl-8 xl:pl-4' >
      <Title text='Sessions' />
      <Sessions/>
    </div>
  )
}

export default pages
