import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";

export const GroupColumns:GridColDef[]=[
    {
        field:'groupNumber',
        headerName:'Number',
        width:100,
    },
    {
        field:'name',
        headerName:'Name',
        width:140,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link href={`/dashboard/groups/${params?.row?.id}`}  className="table-link" >{params?.row?.name}</Link>
            )
        }
    },
    {
        field:'members',
        headerName:'Members',
        width:100,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <span className="text-center" >{params?.row?.members?.length}</span>
            )
        }
    },

    {
        field:'checkInStatus',
        headerName:'Check-in Status',
        width:120
    },
    {
        field:'type',
        headerName:'Type',
        width:100
    },
    {
        field:'room',
        headerName:'Room Assigned',
        width:100,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex-center">
                    {
                        params?.row?.room ? 
                        <Link href={`/dashboard/rooms/${params?.row?.id}`}  className="table-link text-center" >{params?.row?.room}</Link>
                        :
                        <span className="text-center" >Not yet</span>
                    }
                </div>
            )
        }
    },

]