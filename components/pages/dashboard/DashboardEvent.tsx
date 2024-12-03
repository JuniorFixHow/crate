'use client'
import Tile from '@/components/features/Tile'
import { getCountsForEventByCase } from '@/functions/filter'
import CBar from '@/components/misc/CBar'
import CPie from '@/components/misc/CPie'
import BadgesTable from '@/components/tables/BadgesTable'
import { ComponentProps, useState } from 'react'
import { LiaUserSolid } from 'react-icons/lia'
import { PiMoneyWavyBold, PiUsersThree } from 'react-icons/pi'
import { TbBuildingChurch } from 'react-icons/tb'
import { useFetchEverything } from '@/hooks/fetch/useEverything'

const DashboardEvent = ({className, ...props}:ComponentProps<'div'>) => {
  const [eventId, setEventId] = useState<string>('');
  const {members, registrations} = useFetchEverything();

  // console.log(members)

  return (
    <div {...props}  className={`${className} flex-col gap-12`} >
      <div className='flex flow-row w-full items-start gap-4'>
        <CBar eventId={eventId} setEventId={setEventId} isEvent  className="" />

        <div className="flex flex-row  gap-4 items-start">
          <CPie eventId={eventId} isEvent={true} />

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
              text={getCountsForEventByCase(eventId, registrations, members, 'Groups').toString()}
            />
            <Tile 
              className="w-[12rem]"
              title="Individuals" 
              icon={<LiaUserSolid size={24} color="#3C60CA" />}
              text={getCountsForEventByCase(eventId, registrations, members, 'Individuals').toString()}
            />
            <Tile 
              className="w-[12rem]"
              title="Churches" 
              icon={<TbBuildingChurch size={24} color="#3C60CA" />}
              text={getCountsForEventByCase(eventId, registrations, members, 'Church').toString()}
            />
          </div>
        </div>
      </div>

      <BadgesTable eventId={eventId} setEventId={setEventId} noHeader />
    </div>
  )
}

export default DashboardEvent