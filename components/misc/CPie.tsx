'use client'
import { getFemales, getGenderPercentageForEvent, getMales, getMaleValue } from "@/functions/filter"
import { IMember } from "@/lib/database/models/member.model";
import { IRegistration } from "@/lib/database/models/registration.model";
import { CircularProgress } from "@mui/material";
import { Gauge, gaugeClasses } from "@mui/x-charts";
import {ComponentProps } from "react"

type CPieProps = {
    eventId?:string,
    isEvent?:boolean,
    loading:boolean,
    members:IMember[],
    registrations:IRegistration[],
} & ComponentProps<'div'>

const CPie = ({isEvent, loading, members, registrations, eventId, ...props}:CPieProps) => {
  return (
    <div {...props}  className="p-4 hidden h-[21.7rem] dark:bg-[#0F1214] bg-white md:flex w-[12rem] md:w-[13rem] flex-col shadow-xl rounded-lg dark:border" >
        {
            loading ? 
            <div className="flex-center w-full h-full">
                <CircularProgress size='3rem' />
            </div>
            :
            <>
                <span className='text-[#3C60CA] font-bold' >Gender</span>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-4 items-center">
                        <div className="p-2 bg-[#3C60CA] rounded-full" />
                        <span className="text-[0.8rem] lg:text-[1rem] font-semibold" >Male</span>
                        <span className="text-[0.8rem] lg:text-[1rem] font-semibold text-[#3C60CA]" >{isEvent ? getGenderPercentageForEvent(eventId!, registrations, members, 'Male').percent:getMales(members)}</span>
                    </div>
                    <div className="flex flex-row gap-4 items-center">
                        <div className="p-2 bg-[#C45E8D] rounded-full" />
                        <span className="text-[0.8rem] lg:text-[1rem] font-semibold" >Female</span>
                        <span className="text-[0.8rem] lg:text-[1rem] font-semibold text-[#C45E8D]" >{ isEvent ? getGenderPercentageForEvent(eventId!, registrations, members, 'Female').percent:getFemales(members)}</span>
                    </div>
                </div>

                {
                    isEvent ?
                    <Gauge
                        value= {isEvent ? getGenderPercentageForEvent(eventId!, registrations, members, 'Male').genderCount: getMaleValue(members)}
                        valueMax={isEvent ? getGenderPercentageForEvent(eventId!, registrations, members, 'Male').totalCount: members?.length}
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

                    :
                    <Gauge
                        value= {getMaleValue(members)}
                        valueMax={members?.length}
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
                }
            </>
        }

    </div>
  )
}

export default CPie