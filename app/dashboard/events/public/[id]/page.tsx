import SinglePublic from '@/components/pages/public/single/SinglePublic';
import { getCYPSet } from '@/lib/actions/cypset.action';
import { ICYPSet } from '@/lib/database/models/cypset.model';
import React from 'react'

const page = async({params}:{params:Promise<{id:string}>}) => {
  const {id} = await params;
  const set:ICYPSet = await getCYPSet(id);
  return (
    <div className='main-c' >
      <SinglePublic cypset={set} />
    </div>
  )
}

export default page