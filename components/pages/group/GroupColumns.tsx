import { IChurch } from "@/lib/database/models/church.model";
import { IGroup } from "@/lib/database/models/group.model";
import { IRoom } from "@/lib/database/models/room.model";
import { IVenue } from "@/lib/database/models/venue.model";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";

export const GroupColumns=(
    reader:boolean,
    updater:boolean,
    showChurch:boolean,
    showRoom:boolean,
):GridColDef[]=>[
    {
        field:'groupNumber',
        headerName:'Number',
        width:80,
    },
    {
        field:'name',
        headerName:'Name',
        width:180,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    (reader || updater)?
                    <Link href={`/dashboard/groups/${params?.row?._id}`}  className="table-link w-fit" >{params?.row?.name}</Link>
                    :
                    <span>{params?.row?.name}</span>
                }
                </>
            )
        }
    },
    {
        field:'members',
        headerName:'Members',
        width:80,
        valueFormatter:(_, group:IGroup)=>{
            return group?.members ?  group?.members?.length : '0';
        },
        valueGetter:(_, group:IGroup)=>{
            return group?.members ?  group?.members?.length : '0';
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <span className="text-center" >{params?.row?.members?.length}</span>
            )
        }
    },
    {
        field:'churchId',
        headerName:'Church',
        valueFormatter:(_, group:IGroup)=>{
            const church = group?.churchId as IChurch;
            return church ? church?.name : '';
        },
        valueGetter:(_, group:IGroup)=>{
            const church = group?.churchId as IChurch;
            return church ? Object.values(church) : '';
        },
        width:180,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    showChurch ?
                    <Link href={{pathname:'/dashboard/churches', query:{id:params.row?.churchId?._id}}} className="table-link" >{params?.row?.churchId?.name}</Link>
                    :
                    <span>{params?.row?.churchId?.name}</span>
                }
                </>
            )
        }
    },
    {
        field:'eligible',
        headerName:'MEFRA',
        width:120,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <span className="text-center" >{params?.row?.eligible}</span>
            )
        }
    },

    {
        field:'checkInStatus',
        headerName:'Check-in Status',
        width:120,
        valueFormatter:(_, group:IGroup)=>{
            const rooms = group?.roomIds;
            return rooms && rooms?.length > 0 ? 'Checked-in':'Pending';
        },
        valueGetter:(_, group:IGroup)=>{
            const rooms = group?.roomIds;
            return rooms && rooms?.length > 0 ? 'Checked-in':'Pending';
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <span className="text-center" >{params?.row?.roomIds?.length > 0 ? 'Checked-in':'Pending' }</span>
            )
        }
    },
    {
        field:'type',
        headerName:'Type',
        width:100
    },
    {
        field:'room',
        headerName:'Room Assigned',
        width:200,
        valueFormatter:(_, group:IGroup)=>{
            const rooms = group?.roomIds;
            if(!rooms || rooms?.length === 0) return 'Not Yet';
            const room1 = rooms[0] as IRoom;
            const venue = room1.venueId as IVenue
            return rooms?.length === 1 ? `${venue.name} - ${room1?.number}`:'Multiple';
        },
        valueGetter:(_, group:IGroup)=>{
            const rooms = group?.roomIds;
            if(!rooms || rooms?.length === 0) return 'Not Yet';
            const room1 = rooms[0] as IRoom;
            const venue = room1.venueId as IVenue
            return rooms?.length === 1 ? `${venue.name} - ${room1?.number}`:'Multiple';
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                    {
                        params?.row?.roomIds?.length  ===1 ?
                        <>
                        {
                            showRoom ?
                            <Link href={{pathname:`/dashboard/rooms`, query:{id:params?.row?.roomIds[0]?._id}}}  className="table-link" >{`${params?.row?.roomIds[0]?.venueId?.name} - ${params?.row?.roomIds[0]?.number}`}</Link>
                            :
                            <span>{`${params?.row?.roomIds[0]?.venueId?.name} - ${params?.row?.roomIds[0]?.number}`}</span>
                        }
                        </> 
                        :
                        params?.row?.roomIds?.length  > 1 ?
                        <>
                        {
                            reader ?
                            <Link href={{pathname:`/dashboard/groups/${params.row._id}`, query:{tab:'Rooms'}}}  className="table-link" >Multiple</Link>
                            :
                            <span >Multiple</span>
                        }
                        </> 
                        :
                        <span className="text-center" >Not yet</span>
                    }
                </>
            )
        }
    },

]