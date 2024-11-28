// 'use client'
import { CBarFilters, members } from '@/components/Dummy/Data'
import { countMembers, getUniqueValues } from '@/functions/filter'
import React, { ChangeEvent, Dispatch, SetStateAction, useEffect } from 'react'

export type xAxisProps = {
    // xAxis:string[],
    setXaxis:Dispatch<SetStateAction<string[]>>,
    setYaxis:Dispatch<SetStateAction<number[]>>,
}


const CDropDown = ({setXaxis, setYaxis}:xAxisProps) => {
    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setXaxis(getUniqueValues(selectedValue, members));
        setYaxis(countMembers(selectedValue, members));
    };
    useEffect(() => {
        setXaxis(getUniqueValues('Age', members)); // Default to age
        setYaxis(countMembers('Age', members)); // Default to age
    }, [setXaxis, setYaxis]);
  return (
    <select onChange={handleSelectChange} className='bg-transparent outline-none font-bold' defaultValue='Age' >
        {
            CBarFilters.map((item:string)=>(
                <option className='dark:bg-black' value={item} key={item} >{item}</option>
            ))
        }
    </select>
  )
}

export default CDropDown