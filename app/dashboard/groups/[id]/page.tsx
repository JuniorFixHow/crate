import SingleGroupMain from '@/components/pages/group/single/SingleGroupMain';
import React from 'react'

const page = async({params}:{params:Promise<{id:string}>}) => {
    const {id} = await params;
  return (
    <div className='main-c' >
        <SingleGroupMain id={id} />
    </div>
  )
}

export default page