import { IMember } from "@/lib/database/models/member.model";
import {  GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { RiDeleteBin6Line } from "react-icons/ri";

export const SingleGroupColumns =(
    handleDelete:(data:IMember)=>void
) =>[
    {
        field:'memberId',
        headerName:'Member',
        width:140,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link className="table-link text-center" href={{pathname:`/dashboard/events/badges`, query:{regId:params.row?._id}}} >{params?.row?.memberId.name}</Link>
            )
        }
    },

    {
        field:'status',
        headerName:'Checked-in',
        width:100,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <span>{params?.row?.roomIds?.length  === 0 ? 'No':'Yes'}</span>
            )
        }
    },
    {
        field:'badgeIssued',
        headerName:'Badge Issued',
        width:100,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex-center h-full">
                    <span>{params?.row?.badgeIssued}</span>
                </div>
            )
        }
    },

    {
        field:'id',
        headerName:'Action',
        width:80,
        // params:GridRenderCellParams
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex-center h-full">
                    <RiDeleteBin6Line onClick={()=>handleDelete(params?.row.memberId)}  className="cursor-pointer" />
                </div>
            )
        }
    },
] 