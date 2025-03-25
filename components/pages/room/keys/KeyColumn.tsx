import { IKey } from "@/lib/database/models/key.model";
import { IMember } from "@/lib/database/models/member.model";
import { IRegistration } from "@/lib/database/models/registration.model";
import { IRoom } from "@/lib/database/models/room.model";
import { IVenue } from "@/lib/database/models/venue.model";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { GoInfo } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";

export const KeyColumns = (
    handleDelete:(data:IKey)=>void,
    handleEdit:(data:IKey)=>void,
    handleInfo:(data:IKey)=>void,
    reader:boolean,
    updater:boolean,
    deleter:boolean,
    roomReader:boolean,
    showMember:boolean,
):GridColDef[]=>[
    {
        field:'code',
        headerName:'Code',
        width:120,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    updater ?
                    <span onClick={()=>handleEdit(params.row)}  className="table-link" >{params.row?.code}</span>
                    :
                    <span>{params.row?.code}</span>
                }
                </>
            )
        }
    },
    {
        field:'roomId',
        headerName:'Room',
        width:160,
        valueFormatter:(_, key:IKey)=>{
            const room = key.roomId as IRoom;
            const venue = room?.venueId as IVenue;
            return `${venue?.name} - ${room?.number}`
        },
        valueGetter:(_, key:IKey)=>{
            const room = key.roomId as IRoom;
            return Object.values(room);
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    roomReader ?
                    <Link className="table-link" href={{pathname:'/dashboard/rooms', query:{id:params.row?.roomId?._id}}} >{params.row?.roomId?.venueId?.name} {params.row?.roomId?.number}</Link>
                    :
                    <span>{params.row?.roomId?.venueId?.name} {params.row?.roomId?.number}</span>
                }
                </>
            )
        }
    },
    {
        field:'holder',
        headerName:'Keeper',
        width:180,
        valueFormatter:(_, key:IKey)=>{
            const holder = key.holder as IRegistration;
            const member = holder?.memberId as IMember;
            return holder ? member?.name : 'Not Yet';
        },
        valueGetter:(_, key:IKey)=>{
            const holder = key.holder as IRegistration;
            const member = holder?.memberId as IMember;
            return holder ? Object.values(member) : 'Not Yet';
        },
        
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    params.row?.holder ?
                    <>
                    {
                        showMember ?
                        <Link className="table-link" href={`/dashboard/members/${params.row?.holder?.memberId?._id}`} >{params.row?.holder?.memberId?.name}</Link>
                        :
                        <span>{params.row?.holder?.memberId?.name}</span>
                    }
                    </>
                    :
                    <span>Not Yet</span>
                }
                </>
            )
        }
    },

    {
        field:'assignedOn',
        headerName:'Assigned on',
        width:110,
        valueFormatter:(value)=>new Date(value).toLocaleDateString(),
        valueGetter:(value)=>new Date(value).toLocaleDateString(),
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <span>{params?.row?.assignedOn ? new Date(params.row?.assignedOn).toLocaleDateString() : 'Not Yet'}</span>
            )
        }
    },
    {
        field:'returned',
        headerName:'Returned',
        width:110,
        valueFormatter:(_, key:IKey)=>{
            const returned = key.returned;
            return returned ? 'Yes':'No'
        },
        valueGetter:(_, key:IKey)=>{
            const returned = key.returned;
            return returned ? 'Yes':'No'
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <span className="flex-center" >{params.row?.returned ? 'Yes':'No'}</span>
            )
        }
    },

    {
        field:'returnedDate',
        headerName:'Returned On',
        width:110,
        valueFormatter:(value)=>new Date(value).toLocaleDateString(),
        valueGetter:(value)=>new Date(value).toLocaleDateString(),
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <span className="flex-center">{params.row?.returned ? new Date(params.row?.returnedDate).toLocaleDateString():'N/A'}</span>
            )
        }
    },

    {
        field:'_id',
        headerName:'Action',
        width:80,
        filterable:false,
        disableExport:true,
        // params:GridRenderCellParams
        renderCell:(params:GridRenderCellParams)=>{
            return(
               <div className="flex h-full flex-row items-center gap-4">
                {
                    reader &&
                    <GoInfo onClick={()=>handleInfo(params?.row)}  className="cursor-pointer text-green-700" />
                }
                {
                    deleter &&
                    <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                }
                {
                    !reader && !deleter &&
                    <span>None</span>
                }
                </div>
            )
        }
    },

]