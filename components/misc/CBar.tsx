'use client'
import CDropDown from '@/components/features/CDropDown'
// import SearchSelectEvents from '@/components/features/SearchSelectEvents'
import { IChurch } from '@/lib/database/models/church.model'
import { IEvent } from '@/lib/database/models/event.model'
import { IMember } from '@/lib/database/models/member.model'
import { IRegistration } from '@/lib/database/models/registration.model'
import { IZone } from '@/lib/database/models/zone.model'
import { CircularProgress } from '@mui/material'
import { AxisConfig, BarChart, ChartsXAxisProps } from '@mui/x-charts'
import React, { ComponentProps, Dispatch, SetStateAction, useEffect, useState } from 'react'
import SearchSelectEventsV2 from '../features/SearchSelectEventsV2'

export type CBarProps = {
    isEvent?:boolean,
    loading?:boolean,
    eventId?:string,
    events:IEvent[],
    members:IMember[],
    churches:IChurch[],
    zones:IZone[],
    registrations:IRegistration[],
    setEventId?:Dispatch<SetStateAction<string>>
} & ComponentProps<'div'>

const CBar = ({
    isEvent, events, loading, eventId, setEventId,
    members, churches, zones, registrations, className,
     ...props}:CBarProps) => {
    const [xAxis, setXaxis] = useState<string[]>([])
    const [yAxis, setYaxis] = useState<number[]>([])
    const [xEventAxis, setEventXaxis] = useState<string[]>([])
    const [yEventAxis, setEventYaxis] = useState<number[]>([])

    // console.log('Xaxis: ', xAxis)
    // console.log('Yaxis: ', yAxis)
    
    useEffect(()=>{
        if(events.length && isEvent){
            setEventId!(events[0]?._id)
        }
    },[events, isEvent, setEventId])
  return (
    <div {...props}  className={`p-4 h-[21.8rem] flex flex-col shadow-xl bg-white dark:border rounded dark:bg-[#0F1214] ${className}`} >
        <div className="flex flex-row w-full items-start justify-between">
            <span className='text-xl font-bold' >Registration Stats</span>
            <div className="flex gap-5 items-end">
                {
                    isEvent &&
                    <SearchSelectEventsV2 setSelect={setEventId!}  />
                }
                <CDropDown 
                    isEvent={isEvent!} 
                    eventId={eventId!} 
                    setEventXaxis={setEventXaxis} 
                    setEventYaxis={setEventYaxis} 
                    setYaxis={setYaxis} 
                    setXaxis={setXaxis} 
                    members={members}
                    zones={zones}
                    churches={churches}
                    registrations={registrations}
                />
            </div>
        </div>

        {
            loading ?
            <div className="flex-center w-full grow">
                <CircularProgress size='3rem' />
            </div>
            :
            <BarChart
                xAxis={[
                    {
                        id: 'barCategories',
                        data: isEvent ? xEventAxis : xAxis,
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
                    data: isEvent ? yEventAxis : yAxis,
                    },
                ]}
                borderRadius={10}
                // width={650}
                height={287}
                className='dark:text-blue-200 h-[18rem]'
            />
        }


    </div>
  )
}

export default CBar