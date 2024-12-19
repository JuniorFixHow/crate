import { isEligible } from '@/functions/misc';
import { IChurch } from '@/lib/database/models/church.model';
import { IGroup } from '@/lib/database/models/group.model';
import { IKey } from '@/lib/database/models/key.model';
import { IMember } from '@/lib/database/models/member.model';
import { IRoom } from '@/lib/database/models/room.model';
import { IZone } from '@/lib/database/models/zone.model';
import { IMergedRegistrationData } from '@/types/Types';
import Link from 'next/link';



const CustomSummaryTable = ({ data }:{data:IMergedRegistrationData[]}) => {
  return (
    <div className="flex flex-col w-full py-4">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100 dark:bg-[#0F1214]">
          <tr className='dark:text-white' >
            <th className="border border-gray-300 px-4 py-2">Member</th>
            <th className="border border-gray-300 px-4 py-2">Zone</th>
            <th className="border border-gray-300 px-4 py-2">Church</th>
            <th className="border border-gray-300 px-4 py-2">Group</th>
            <th className="border border-gray-300 px-4 py-2">Group Type</th>
            <th className="border border-gray-300 px-4 py-2">Rooms</th>
            <th className="border border-gray-300 px-4 py-2">Keys</th>
          </tr>
        </thead>
        <tbody>
          {data.map((registration) => {
            const member = registration?.memberId as IMember;
            const church = member?.church as IChurch;
            const zone = church?.zoneId as IZone;
            const group = registration?.groupId as IGroup 
            const rooms = registration?.roomIds as IRoom[]
            const keys =  registration?.keys as IKey[]
            return(
                <tr key={registration._id} className="hover:bg-gray-50 dark:hover:bg-slate-500 text-[0.8rem] font-semibold">
                <td className="border border-gray-300 px-4 py-2">
                    <Link className='table-link' href={`/dashboard/members/${member._id}`} >
                    {member?.name}
                    </Link>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                    <Link className='table-link' href={{pathname:'/dashboard/zones', query:{id:zone?._id}}} >
                        {zone?.name}
                    </Link>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                    <Link href={{pathname:'/dashboard/churches', query:{id:church?._id}}} className='table-link' >
                        {church?.name}
                    </Link>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                    {
                    group ? 
                    <Link className='table-link' href={`/dashboard/groups/${group?._id}`} >
                        {group?.name}
                    </Link>
                    :
                    <span>None</span>
                }
                </td>
                <td className="border border-gray-300 px-4 py-2">
                    {
                    group ? 
                    <span>{group?.type}</span>
                    :
                    <span>NA</span>
                }
                </td>
                <td className="border border-gray-300 px-4 py-2">
                    {
                        !isEligible(member?.ageRange) ?
                        <span>NA</span>
                        :
                        <>
                        {
                            rooms?.length > 0 ?
                            rooms.map((room, index:number)=>(
                                <Link className='table-link w-fit' key={room?._id} href={{pathname:'/dashboard/rooms', query:{id:room?._id}}} >{room?.venue} {room?.number}{rooms?.length - index > 1 && ',  '}</Link>
                            ))
                            :
                            <span>None</span>
                        }
                        </>
                    }
                </td>
                <td className="border border-gray-300 px-4 py-2">
                    {keys?.length>0 ? 
                        keys.map((key)=>(
                            <Link href={{pathname:'/dashboard/rooms/keys', query:{id:key?._id}}} key={key._id} className='table-link' >{key?.code}</Link>
                        ))
                        :
                        <span>None</span>
                    }
                </td>
                
                </tr>
            )
            })}
        </tbody>
      </table>
    </div>
  );
};

export default CustomSummaryTable;
