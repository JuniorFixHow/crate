import { isEligible } from "@/functions/misc";
import { IChurch } from "@/lib/database/models/church.model";
import { IKey } from "@/lib/database/models/key.model";
import { IMember } from "@/lib/database/models/member.model";
import { IRoom } from "@/lib/database/models/room.model";
import { IVenue } from "@/lib/database/models/venue.model";
import { IZone } from "@/lib/database/models/zone.model";
import { IMergedRegistrationData } from "@/types/Types";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";

export const RoomSummaryColumn =(
    showMember:boolean,
    isAdmin:boolean,
    showGroup:boolean,
    showRoom:boolean,
    showKey:boolean,
):GridColDef[] =>[
    {
        field:'memberId',
        headerName:'Member',
        width:160,
        valueFormatter:(_, reg:IMergedRegistrationData)=>{
            const member = reg?.memberId as IMember;
            return member?.name;
        },
        valueGetter:(_, reg:IMergedRegistrationData)=>{
            const member = reg?.memberId as IMember;
            return member?.name;
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                    {
                        showMember ?
                        <Link href={{pathname:`/dashboard/events/badges`, query:{regId:params.row?._id}}}  className="table-link" >{params.row?.memberId?.name}</Link>
                        :
                        <span >{params.row?.memberId?.name}</span>
                    }
                </>
            )
        }
    },
    {
        field:'zone',
        headerName:'Zone',
        width:150,
        valueFormatter:(_, reg:IMergedRegistrationData)=>{
            const member = reg?.memberId as IMember;
            const church = member?.church as IChurch;
            const zone = church?.zoneId as IZone;
            return zone?.name;
        },
        valueGetter:(_, reg:IMergedRegistrationData)=>{
            const member = reg?.memberId as IMember;
            const church = member?.church as IChurch;
            const zone = church?.zoneId as IZone;
            return zone?.name;
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    isAdmin ?
                    <Link href={{pathname:`/dashboard/zones`, query:{id:params.row?.memberId?.church?.zoneId?._id}}}  className="table-link w-fit" >{params.row?.memberId?.church?.zoneId?.name}</Link>
                    :
                    <span >{params.row?.memberId?.church?.zoneId?.name}</span>
                }
                </>
            )
        }
    },
    {
        field:'church',
        headerName:'Church',
        width:170,
        valueFormatter:(_, reg:IMergedRegistrationData)=>{
            const member = reg?.memberId as IMember;
            const church = member?.church as IChurch;
            return church?.name;
        },
        valueGetter:(_, reg:IMergedRegistrationData)=>{
            const member = reg?.memberId as IMember;
            const church = member?.church as IChurch;
            return church?.name;
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                    {
                        isAdmin ?
                        <Link href={{pathname:`/dashboard/churches`, query:{id:params.row?.memberId?.church?._id}}}  className="table-link w-fit" >{params.row?.memberId?.church?.name}</Link>
                        :
                        <span >{params.row?.memberId?.church?.name}</span>
                    }
                </>
            )
        }
    },
    {
        field:'groupId',
        headerName:'Group',
        width:170,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    params.row?.groupId ?
                    <>
                    {
                        showGroup ?
                        <Link href={`/dashboard/groups/${params.row?.groupId?._id}`}  className="table-link w-fit" >{params.row?.groupId?.name}</Link>
                        :
                        <span >{params.row?.groupId?.name}</span>
                    }
                    </>
                    :
                    <span>None</span>
                }
                </>
            )
        }
    },
    {
        field:'type',
        headerName:'Group Type',
        width:100,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    params.row?.groupId ?
                    
                    <span>{params.row?.groupId?.type}</span>
                    :
                    <span>NA</span>
                }
                </>
            )
        }
    },
    {
        field:'roomIds',
        headerName:'Rooms',
        width:180,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    isEligible(params.row?.memberId?.ageRange) ?
                    <div className="gap-5" >
                    {
                        params.row?.roomIds?.length > 0 ?
                        params.row?.roomIds?.map((room:IRoom, index:number)=>{
                            const venue = room?.venueId as IVenue;
                            return(
                                <>
                                {
                                    showRoom ?
                                    <Link key={room?._id}  className="table-link w-fit" href={{pathname:'/dashboard/rooms', query:{id:room?._id}}} >{venue?.name} {room?.number}{params?.row.roomIds.length - index > 1 && ', ' }</Link>
                                    :
                                    <span key={room?._id} >{venue?.name} {room?.number}{params?.row.roomIds.length - index > 1 && ', ' }</span>
                                }
                                </>
                            )
                        })
                        :
                        <span>None</span>
                    }
                    </div>
                    :
                    <span>NA</span>
                }
                </>
            )
        }
    },
    {
        field:'keys',
        headerName:'Keys',
        width:100,
        renderCell:(params:GridRenderCellParams)=>{
            return(
         
                    <div className="flex gap-5" >
                    {
                        params.row?.keys?.length > 0 ?
                        params.row?.keys?.map((key:IKey, index:number)=>(
                            <>
                            {
                                showKey ?
                                <Link key={key?._id}  className="table-link w-fit" href={{pathname:'/dashboard/rooms/keys', query:{id:key?._id}}} >{key?.code}{params?.row?.keys?.length - index > 1 && ', ' }</Link>
                                :
                                <span key={key?._id}  className="w-fit" >{key?.code}{params?.row?.keys?.length - index > 1 && ', ' }</span>
                            }
                            </>
                        ))
                        :
                        <span>None</span>
                    }
                    </div>
            )
        }
    },
] 