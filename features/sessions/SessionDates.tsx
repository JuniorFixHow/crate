'use client'
import { getLastSevenDays } from '@/functions/dates'
import {  StringStateProp } from '@/types/Types'
import React from 'react'

const SessionDates = ({text, setText}:StringStateProp) => {
    const checkDate=(d:Date):string=>{
        const today = new Date();
        const yesterday = new Date(d)
        if(today.toLocaleDateString() === d.toLocaleDateString()){
            return 'Today'
        }else if((today.getDate() - yesterday.getDate()) === 1){
            return 'Yesterday'
        }
        return d.toLocaleDateString()
    }
  return (
    <div className='flex flex-row items-center gap-3 flex-wrap' >
      {
        getLastSevenDays().map((dat)=>(
            <button type='button' onClick={()=>setText(dat.toLocaleDateString())} key={dat.toString()} className={`px-2 py-1 dark:bg-transparent ${text=== dat?.toLocaleDateString()?'bg-blue-800 text-white hover:text-blue-800 dark:text-blue-800':'bg-transparent'} border hover:bg-slate-100 dark:hover:border-blue-800 rounded`} >{checkDate(dat)}</button>
        ))
      }
    </div>
  )
}

export default SessionDates
