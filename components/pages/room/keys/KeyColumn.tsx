import { IKey } from "@/lib/database/models/key.model";
import { GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { RiDeleteBin6Line } from "react-icons/ri";

export const KeyColumns = (
    handleDelete:(data:IKey)=>void,
    handleEdit:(data:IKey)=>void,
)=>[
    {
        field:'code',
        headerName:'Code',
        width:120,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <span onClick={()=>handleEdit(params.row)}  className="table-link" >{params.row?.code}</span>
            )
        }
    },
    {
        field:'roomId',
        headerName:'Room',
        width:150,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link className="table-link" href={{pathname:'/dashboard/rooms', query:{id:params.row?.roomId._id}}} >{params.row?.roomId.venue} {params.row?.roomId.number}</Link>
            )
        }
    },
    {
        field:'holder',
        headerName:'Keeper',
        width:180,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    params.row.holder ?
                    <Link className="table-link" href={`/dashboard/members/${params.row?.holder?.memberId?._id}`} >{params.row?.holder?.memberId?.name}</Link>
                    :
                    <span>Not Yet</span>
                }
                </>
            )
        }
    },

    {
        field:'createdAt',
        headerName:'Issued on',
        width:110,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <span>{new Date(params.row.createdAt).toLocaleDateString()}</span>
            )
        }
    },
    {
        field:'returned',
        headerName:'Returned',
        width:110,
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