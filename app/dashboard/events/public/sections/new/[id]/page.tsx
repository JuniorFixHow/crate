import NewPlayground from '@/components/pages/public/section/NewPlayground'
import { getSection } from '@/lib/actions/section.action';
import { ISection } from '@/lib/database/models/section.model';
import React from 'react'

const page = async({params}:{params:Promise<{id:string}>}) => {
  const {id} = await params;
  const section:ISection = await getSection(id);
  return (
    <div className='main-c' >
      <NewPlayground currentSection = {section} />
    </div>
  )
}

export default page
