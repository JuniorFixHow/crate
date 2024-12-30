import Subtitle from '@/components/features/Subtitle';
import Title from '@/components/features/Title';
import { isEligible } from '@/functions/misc';
import { IChurch } from '@/lib/database/models/church.model';
import { IEvent } from '@/lib/database/models/event.model';
import { IGroup } from '@/lib/database/models/group.model';
import { IKey } from '@/lib/database/models/key.model';
import { IMember } from '@/lib/database/models/member.model';
import { IRoom } from '@/lib/database/models/room.model';
import { IVenue } from '@/lib/database/models/venue.model';
import { IZone } from '@/lib/database/models/zone.model';
import { IMergedRegistrationData } from '@/types/Types';
import { LinearProgress } from '@mui/material';
import Link from 'next/link';
import { ChangeEvent, Ref, useEffect, useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

type rangeTpes = {
    min:number,
    max:number
}

type CustomSummaryTableProps = {
    data:IMergedRegistrationData[],
    event:IEvent|null,
    printRef:Ref<HTMLDivElement>,
    loading:boolean
}

const CustomSummaryTable = ({ data, event, printRef, loading }:CustomSummaryTableProps) => {
    const [page, setPage] = useState<number>(10);
    const [range, setRange] = useState<rangeTpes>({min:0, max:10});
    // const [range, setMax] = useState<number>(10);
    useEffect(() => {
        // Adjust the range when `page` changes
        if (!page || page < 1) {
          setRange({ min: 0, max: 0 });
        } else {
          setRange({ min: 0, max: Math.min(page, data.length) });
        }
      }, [page, data]);

      const handleChangePage = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value || "0", 10);
    
        // Prevent invalid values
        if (value < 1 || isNaN(value)) {
          setPage(0);
        } else {
          setPage(Math.min(value, data.length)); // Cap `page` at `data.length`
        }
      };

    const handleNext = () => {
        if (range.max < data.length) {
            setRange((prev) => ({
            min: prev.max,
            max: Math.min(prev.max + page, data.length),
            }));
        }
        };
    
    const handlePrev = () => {
        if (range.min > 0) {
            setRange((prev) => ({
            min: Math.max(prev.min - page, 0),
            max: prev.min,
            }));
        }
    };

  return (
    <div className="flex flex-col gap-5 w-full">
        <div ref={printRef} id="print"  className="flex flex-col w-full">
            <div className="flex flex-col w-full items-center gap-4">
                {
                    event &&
                    <Title text={event.name} className="text-center" />
                }
                <Subtitle text="Member Registration Records" />
            </div>
            {
                loading ?
                <LinearProgress className="w-full" aria-describedby="loading..." />
                :
                <div className="flex flex-col w-full py-4 gap-4">
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
                    {data.slice(range.min, range.max).map((registration) => {
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
                                        rooms.map((room, index:number)=>{
                                            const venue = room.venueId as IVenue;
                                            return(
                                                <Link className='table-link w-fit' key={room?._id} href={{pathname:'/dashboard/rooms', query:{id:room?._id}}} >{venue?.name} {room?.number}{rooms?.length - index > 1 && ',  '}</Link>
                                            )
                                        })
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
            }
        </div>
        <div className="flex items-center justify-end gap-4 text-[0.8rem] dark:text-white">
        <span>Rows per page:</span>
        <input
            type="number"
            max={data?.length}
            min={1}
            defaultValue={10}
            onChange={handleChangePage}
            className="w-10 bg-transparent border-b border-b-slate-400 outline-none"
        />
        <div className="flex items-center gap-4">
            {range.min > 0 && (
            <IoIosArrowBack
                onClick={handlePrev}
                size={18}
                className="cursor-pointer text-slate-400"
            />
            )}
            <div className="flex gap-2">
            <span>{range.min + 1}</span>
            <span>to</span>
            <span>{range.max}</span>
            <span>of</span>
            <span>{data?.length}</span>
            </div>
            {range.max < data?.length && (
            <IoIosArrowForward
                onClick={handleNext}
                size={18}
                className="cursor-pointer text-slate-400"
            />
            )}
        </div>
        </div>

    </div>
  );
};

export default CustomSummaryTable;
