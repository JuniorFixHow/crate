import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { RiDeleteBin6Line } from "react-icons/ri";

export const SingleGroupColumns:GridColDef[] =[
    {
        field:'memberId',
        headerName:'Member',
        width:140,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link className="table-link text-center" href={{pathname:`/dashboard/events/badges`, query:{regId:params.row?.id}}} >Member Name</Link>
            )
        }
    },

    {
        field:'status',
        headerName:'Checked-in',
        width:100,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex-center h-full">
                    <span>{params?.row?.status === 'Pending'? 'No':'Yes'}</span>
                </div>
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
        renderCell:()=>{
            return(
                <div className="flex-center h-full">
                    <RiDeleteBin6Line className="cursor-pointer" />
                </div>
            )
        }
    },
] 