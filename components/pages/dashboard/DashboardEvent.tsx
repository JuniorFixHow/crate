'use client'
import { members } from '@/components/Dummy/Data'
import Tile from '@/components/features/Tile'
import { getFamilyAndGroupValue, getUniqueValues } from '@/functions/filter'
import CBar from '@/components/misc/CBar'
import CPie from '@/components/misc/CPie'
import BadgesTable from '@/components/tables/BadgesTable'
import { ComponentProps, useState } from 'react'
import { LiaUserSolid } from 'react-icons/lia'
import { PiMoneyWavyBold, PiUsersThree } from 'react-icons/pi'
import { TbBuildingChurch } from 'react-icons/tb'

const DashboardEvent = ({className, ...props}:ComponentProps<'div'>) => {
  const [eventId, setEventId] = useState<string>('')
  return (
    <div {...props}  className={`${className} flex-col gap-12`} >
      <div className='flex flow-row w-full items-start gap-4'>
        <CBar eventId={eventId} setEventId={setEventId} isEvent  className="" />

        <div className="flex flex-row  gap-4 items-start">
          <CPie />

          <div className="hidden lg:flex flex-col gap-[1.2rem] dark:gap-[1.1rem]">
            <Tile 
              className="w-[12rem]"
              title="Revenue" 
              icon={<PiMoneyWavyBold size={24} color="#3C60CA" />}
              text="67293"
            />
            <Tile 
              className="w-[12rem]"
              title="Family/Group" 
              icon={<PiUsersThree size={24} color="#3C60CA" />}
              text={getFamilyAndGroupValue(members).toString()}
            />
            <Tile 
              className="w-[12rem]"
              title="Individuals" 
              icon={<LiaUserSolid size={24} color="#3C60CA" />}
              text={(members.length - getFamilyAndGroupValue(members)).toString()}
            />
            <Tile 
              className="w-[12rem]"
              title="Churches" 
              icon={<TbBuildingChurch size={24} color="#3C60CA" />}
              text={getUniqueValues('Church', members).length.toString()}
            />
          </div>
        </div>
      </div>

      <BadgesTable eventId={eventId} setEventId={setEventId} noHeader />
    </div>
  )
}

export default DashboardEvent