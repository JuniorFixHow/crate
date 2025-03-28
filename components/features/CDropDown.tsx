// 'use client'
import { CBarFilters, CBarFiltersAdmin, CBarFiltersEvent, CBarFiltersEventAdmin } from '@/components/Dummy/Data'
import { countMembers,  getCountsForEvent, getUniqueValues, getUniqueValuesForEvent } from '@/functions/filter'
import { useAuth } from '@/hooks/useAuth'
import { IChurch } from '@/lib/database/models/church.model'
import { IMember } from '@/lib/database/models/member.model'
import { IRegistration } from '@/lib/database/models/registration.model'
import { IZone } from '@/lib/database/models/zone.model'

import React, { ChangeEvent, Dispatch, SetStateAction, useEffect } from 'react'
import { checkIfAdmin } from '../Dummy/contants'
import { canPerformAction, eventOrganizerRoles } from '../auth/permission/permission'

export type xAxisProps = {
    isEvent:boolean,
    eventId:string,
    setXaxis:Dispatch<SetStateAction<string[]>>,
    setYaxis:Dispatch<SetStateAction<number[]>>,
    setEventYaxis:Dispatch<SetStateAction<number[]>>,
    setEventXaxis:Dispatch<SetStateAction<string[]>>,
    members:IMember[],
    churches:IChurch[],
    zones:IZone[],
    registrations:IRegistration[]

}

type FilterProps = 'Age Range'|'Gender'|'Church'

const CDropDown = ({
    setXaxis, setYaxis, eventId,  setEventXaxis, setEventYaxis, isEvent,
    members, churches, zones, registrations,
}:xAxisProps) => {

    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setYaxis(countMembers(selectedValue, members, churches, zones))
        setXaxis(getUniqueValues(selectedValue, members));
    };
    const handleSelectEventChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value as FilterProps;
        setEventYaxis(getCountsForEvent(eventId, registrations, members, selectedValue))
        setEventXaxis(getUniqueValuesForEvent(eventId, registrations, members, selectedValue));
    };

//    console.log('Event Id: ',eventId)

    useEffect(() => {
        setXaxis(getUniqueValues('Age', members)); // Default to age
        setYaxis(countMembers('Age',  members, churches, zones)); // Default to age
        setEventXaxis(getUniqueValuesForEvent(eventId, registrations, members, 'Age Range'));
        setEventYaxis(getCountsForEvent(eventId, registrations, members, 'Age Range'))

    }, [churches, eventId, members, registrations, setEventXaxis, setEventYaxis, setXaxis, setYaxis, zones]);
    const {user} = useAuth();
    const isAdmin = checkIfAdmin(user) || canPerformAction(user!, 'reader', {eventOrganizerRoles});
  return (
    <>
    {
        isEvent ?
        <select onChange={handleSelectEventChange} className='bg-transparent outline-none border rounded py-2 font-bold' defaultValue='Age Range' >
            {
                (isAdmin ? CBarFiltersEvent : CBarFiltersEventAdmin).map((item:string)=>(
                    <option className='dark:bg-[#0F1214]' value={item} key={item} >{item}</option>
                ))
            }
        </select>
        :
    <select onChange={handleSelectChange} className='bg-transparent outline-none font-bold border rounded py-1' defaultValue='Age' >
        {
            (isAdmin ? CBarFilters : CBarFiltersAdmin ).map((item:string)=>(
                <option className='dark:bg-[#0F1214]' value={item} key={item} >{item}</option>
            ))
        }
    </select>
    }
    </>
  )
}

export default CDropDown