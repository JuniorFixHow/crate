import { IFacility } from "@/lib/database/models/facility.model";
import { IRoom } from "@/lib/database/models/room.model";
import { IVenue } from "@/lib/database/models/venue.model";
import {  GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { RiDeleteBin6Line } from "react-icons/ri";

export const SingleGrpRoomColumns =(
    handleDelete:(data:IRoom)=>void,
    venueReader:boolean,
    facReader:boolean,
    roomReader:boolean,
    roomAssign:boolean,
):GridColDef[] =>[
    {
        field:'venueId',
        headerName:'Venue',
        valueFormatter:(_, room:IRoom)=>{
            const venue = room?.venueId as IVenue;
            return venue?.name;
        },
        valueGetter:(_, room:IRoom)=>{
            const venue = room?.venueId as IVenue;
            return Object.values(venue);
        },
        width:200,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    venueReader?
                    <Link href={`/dashboard/venues/${params?.row?.venueId?._id}`} className="table-link"  >{params?.row?.venueId?.name}</Link>
                    :
                    <span>{params?.row?.venueId?.name}</span>
                }
                </>
            )
        }
    },
    {
        field:'facId',
        headerName:'Facility',
        valueFormatter:(_, room:IRoom)=>{
            const fac = room?.facId as IFacility;
            return fac?.name;
        },
        valueGetter:(_, room:IRoom)=>{
            const fac = room?.facId as IFacility;
            return Object.values(fac);
        },
        width:200,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    facReader ?
                    <Link href={{pathname:'/dashboard/venues/facilities', query:{id:params.row?.facId?._id}}}  className="table-link" >{params?.row?.facId?.name}</Link>
                    :
                    <span>{params?.row?.facId?.name}</span>
                }
                </>
            )
        }
    },

    {
        field:'number',
        headerName:'Room No.',
        width:100,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    roomReader ?
                    <Link className="table-link" href={{pathname:`/dashboard/rooms`, query:{id:params.row?._id}}} >{params?.row?.number}</Link>
                    :
                    <span>{params?.row?.number}</span>
                }
                </>
            )
        }
    },

    {
        field:'nob',
        headerName:'No. of Beds',
        width:120,
    },

    {
        field:'id',
        headerName:'Action',
        width:80,
        filterable:false,
        disableExport:true,
        // params:GridRenderCellParams
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex-center h-full">
                    {
                        roomAssign ?
                        <RiDeleteBin6Line onClick={()=>handleDelete(params?.row)}  className="cursor-pointer" />
                        :
                        <span>None</span>
                    }
                </div>
            )
        }
    },
] 