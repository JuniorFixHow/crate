import { isEligible } from "@/functions/misc";
import { IKey } from "@/lib/database/models/key.model";
import { IRoom } from "@/lib/database/models/room.model";
import { IVenue } from "@/lib/database/models/venue.model";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";

export const RoomSummaryColumn:GridColDef[] =[
    {
        field:'memberId',
        headerName:'Member',
        width:150,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex items-center mt-4">
                    <Link href={{pathname:`/dashboard/events/badges`, query:{regId:params.row?._id}}}  className="table-link" >{params.row?.memberId?.name}</Link>
                </div>
            )
        }
    },
    {
        field:'zone',
        headerName:'Zone',
        width:140,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link href={{pathname:`/dashboard/zones`, query:{id:params.row?.memberId?.church?.zoneId?._id}}}  className="table-link flex items-center mt-4" >{params.row?.memberId?.church?.zoneId?.name}</Link>
            )
        }
    },
    {
        field:'church',
        headerName:'Church',
        width:140,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link href={{pathname:`/dashboard/churches`, query:{id:params.row?.memberId?.church?._id}}}  className="table-link flex items-center mt-4" >{params.row?.memberId?.church?.name}</Link>
            )
        }
    },
    {
        field:'groupId',
        headerName:'Group',
        width:140,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex items-center mt-4" >
                {
                    params.row?.groupId ?
                    <Link href={`/dashboard/groups/${params.row?.groupId?._id}`}  className="table-link" >{params.row?.groupId?.name}</Link>
                    :
                    <span>None</span>
                }
                </div>
            )
        }
    },
    {
        field:'type',
        headerName:'Group Type',
        width:100,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex items-center mt-4" >
                {
                    params.row?.groupId ?
                    
                    <span>{params.row?.groupId?.type}</span>
                    :
                    <span>NA</span>
                }
                </div>
            )
        }
    },
    {
        field:'roomIds',
        headerName:'Rooms',
        width:180,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex items-center mt-4" >
                {
                    isEligible(params.row?.memberId?.ageRange) ?
                    <div className="gap-5" >
                    {
                        params.row?.roomIds?.length > 0 ?
                        params.row?.roomIds?.map((room:IRoom, index:number)=>{
                            const venue = room?.venueId as IVenue;
                            return(
                                <Link key={room?._id}  className="table-link w-fit" href={{pathname:'/dashboard/rooms', query:{id:room?._id}}} >{venue?.name} {room?.number}{params?.row.roomIds.length - index > 1 && ', ' }</Link>
                            )
                        })
                        :
                        <span>None</span>
                    }
                    </div>
                    :
                    <span>NA</span>
                }
                </div>
            )
        }
    },
    {
        field:'keys',
        headerName:'Keys',
        width:80,
        renderCell:(params:GridRenderCellParams)=>{
            return(
         
                    <div className="gap-5 flex items-center mt-4" >
                    {
                        params.row?.keys?.length > 0 ?
                        params.row?.keys?.map((key:IKey, index:number)=>(
                            <Link key={key?._id}  className="table-link w-fit" href={{pathname:'/dashboard/rooms/keys', query:{id:key?._id}}} >{key?.code}{params?.row?.keys?.length - index > 1 && ', ' }</Link>
                        ))
                        :
                        <span>None</span>
                    }
                    </div>
            )
        }
    },
] 