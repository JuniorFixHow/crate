'use client'
import { members } from "@/Dummy/Data"
import { getFemales, getMales, getMaleValue } from "@/functions/filter"
import { Gauge, gaugeClasses } from "@mui/x-charts";
import {ComponentProps } from "react"

const CPie = ({...props}:ComponentProps<'div'>) => {
    
  return (
    <div {...props}  className="p-4 hidden h-[21.7rem] dark:bg-transparent bg-white md:flex w-[12rem] md:w-[13rem] flex-col shadow-xl rounded-lg dark:border" >
        <span className='text-[#3C60CA] font-bold' >Gender</span>
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-4 items-center">
                <div className="p-2 bg-[#3C60CA] rounded-full" />
                <span className="text-[0.8rem] lg:text-[1rem] font-semibold" >Male</span>
                <span className="text-[0.8rem] lg:text-[1rem] font-semibold text-[#3C60CA]" >{getMales(members)}</span>
            </div>
            <div className="flex flex-row gap-4 items-center">
                <div className="p-2 bg-[#C45E8D] rounded-full" />
                <span className="text-[0.8rem] lg:text-[1rem] font-semibold" >Female</span>
                <span className="text-[0.8rem] lg:text-[1rem] font-semibold text-[#C45E8D]" >{getFemales(members)}</span>
            </div>
        </div>

        <Gauge
            value= {getMaleValue(members)}
            valueMax={members.length}
            cornerRadius="50%"
            sx={() => ({
                [`& .${gaugeClasses.valueText}`]: {
                fontSize: 40,
                color:'red',
                },
                [`& .${gaugeClasses.valueArc}`]: {
                fill: '#3C60CA',
                },
                [`& .${gaugeClasses.referenceArc}`]: {
                fill: '#C45E8D',
                },
            })}
            text={
                ({ valueMax }) => `${valueMax}`
             }
        />
    </div>
  )
}

export default CPie