import SingleGroupMain from '@/components/pages/group/single/SingleGroupMain';
import { getGroup } from '@/lib/actions/group.action';
import React from 'react'

const page = async({params}:{params:Promise<{id:string}>}) => {
    const {id} = await params;

    const group = await getGroup(id);

  return (
    <div className='main-c' >
        <SingleGroupMain group={group} />
    </div>
  )
}

export default page