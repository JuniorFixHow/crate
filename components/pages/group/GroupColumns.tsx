import { IRoom } from "@/lib/database/models/room.model";
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
        width:180,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link href={`/dashboard/groups/${params?.row?._id}`}  className="table-link" >{params?.row?.name}</Link>
            )
        }
    },
    {
        field:'members',
        headerName:'Members',
        width:140,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <span className="text-center" >{params?.row?.members?.length}</span>
            )
        }
    },

    {
        field:'checkInStatus',
        headerName:'Check-in Status',
        width:120,
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
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex-center">
                    {
                        params?.row?.roomIds?.length > 0 ? 
                        params?.row?.roomIds?.map((room:IRoom)=>(
                            <Link key={room._id} href={{pathname:`/dashboard/rooms/`, query:{id:room?._id}}}  className="table-link text-center" >{room?.venue}</Link>
                        ))
                        :
                        <span className="text-center" >Not yet</span>
                    }
                </div>
            )
        }
    },

]