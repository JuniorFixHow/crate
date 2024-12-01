'use client'
import CDropDown from '@/components/features/CDropDown'
import SearchSelectEvents from '@/components/features/SearchSelectEvents'
import { AxisConfig, BarChart, ChartsXAxisProps } from '@mui/x-charts'
import React, { ComponentProps, Dispatch, SetStateAction, useState } from 'react'

export type CBarProps = {
    isEvent?:boolean,
    eventId:string,
    setEventId:Dispatch<SetStateAction<string>>
} & ComponentProps<'div'>

const CBar = ({isEvent, eventId, setEventId, ...props}:CBarProps) => {
    const [xAxis, setXaxis] = useState<string[]>([])
    const [yAxis, setYaxis] = useState<number[]>([])

    console.log(eventId)
  return (
    <div {...props}  className='p-4 lg:w-[40rem] flex flex-col shadow-xl bg-white dark:border rounded dark:bg-black' >
        <div className="flex flex-row w-full items-start justify-between">
            <span className='text-xl font-bold' >Registration Stats</span>
            <div className="flex gap-5 items-start">
                {
                    isEvent &&
                    <SearchSelectEvents setSelect={setEventId} isGeneric />
                }
                <CDropDown setYaxis={setYaxis} setXaxis={setXaxis} />
            </div>
        </div>


        <BarChart
            xAxis={[
                {
                    id: 'barCategories',
                    data: xAxis,
                    scaleType: 'band',
                    colorMap:{
                        type:'ordinal',
                        colors:['#1B59F8CC']
                    },
                    barGapRatio:0.6,
                    categoryGapRatio:0.6,
                    // valueFormatter(value:string, context) {
                    //     return value.split(' ')[0]
                        
                    // },
                    
                } as AxisConfig<'band', unknown, ChartsXAxisProps>,
                
            ]}
            series={[
                {
                data: yAxis,
                },
            ]}
            borderRadius={10}
            // width={650}
            height={287}
            className='dark:text-blue-200 h-[18rem]'
    />

    </div>
  )
}

export default CBar