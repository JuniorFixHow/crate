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
import { IRegistration } from '@/lib/database/models/registration.model'
import { IMember } from '@/lib/database/models/member.model'
import { IEvent } from '@/lib/database/models/event.model'
import { IChurch } from '@/lib/database/models/church.model'
import { IZone } from '@/lib/database/models/zone.model'
import { useFetchRevenues } from '@/hooks/fetch/useRevenue'
import { getEventTotalRevenue } from '../revenue/fxn'

type DashboardEventProps = {
  loading:boolean,
  registrations:IRegistration[],
  members:IMember[],
  events:IEvent[],
  churches:IChurch[],
  zones:IZone[],
} & ComponentProps<'div'>

const DashboardEvent = ({loading, churches, zones, events, members, registrations, className, ...props}:DashboardEventProps) => {
  const [eventId, setEventId] = useState<string>('');

  const {revenues} = useFetchRevenues()
  // console.log(members)

  return (
    <div {...props}  className={`${className} flex-col gap-12`} >
      <div className='flex flow-row w-full items-start gap-4'>
        <CBar 
          events={events} 
          loading={loading} 
          eventId={eventId} 
          setEventId={setEventId} 
          isEvent
          members={members}
          registrations={registrations}
          churches={churches}
          zones={zones}
          className='grow'
        />

        <div className="flex flex-row  gap-4 items-start">
          <CPie loading={loading} members={members} registrations={registrations} eventId={eventId} isEvent={true} />
          {
            eventId &&
            <div className="hidden lg:flex flex-col gap-[1.2rem] dark:gap-[1.1rem]">
              <Tile 
                className="w-[12rem]"
                title="Revenue" 
                icon={<PiMoneyWavyBold size={24} color="#3C60CA" />}
                text={`$${getEventTotalRevenue(revenues, eventId)?.toString()}`}
                link = '/dashboard/revenue'
                query={{eventId}}
              />
              <Tile 
                className="w-[12rem]"
                title="Family/Group" 
                icon={<PiUsersThree size={24} color="#3C60CA" />}
                text={getCountsForEventByCase(eventId, registrations, members, 'Groups').toString()}
                link={'/dashboard/groups'}
                query={{eventId}}
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
          }
        </div>
      </div>

      <BadgesTable eventId={eventId} setEventId={setEventId} />
    </div>
  )
}

export default DashboardEvent