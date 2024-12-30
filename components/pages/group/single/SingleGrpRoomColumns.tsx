import { IRoom } from "@/lib/database/models/room.model";
import {  GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { RiDeleteBin6Line } from "react-icons/ri";

export const SingleGrpRoomColumns =(
    handleDelete:(data:IRoom)=>void
) =>[
    {
        field:'venueId',
        headerName:'Venue',
        width:200,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <span className="table-link text-center"  >{params?.row?.VenueId?.name} - {params?.row?.number}</span>
            )
        }
    },
    {
        field:'venueId',
        headerName:'Venue',
        width:200,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <span className="table-link text-center" >{params?.row?.facId?.floor}</span>
            )
        }
    },

    {
        field:'number',
        headerName:'Room No.',
        width:100,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link className="table-link text-center" href={{pathname:`/dashboard/rooms`, query:{id:params.row?._id}}} >{params?.row?.venue}</Link>
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
        // params:GridRenderCellParams
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex-center h-full">
                    <RiDeleteBin6Line onClick={()=>handleDelete(params?.row)}  className="cursor-pointer" />
                </div>
            )
        }
    },
] 