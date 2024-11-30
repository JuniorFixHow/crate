import AddButton from "@/components/features/AddButton";
import { IGroup } from "@/lib/database/models/group.model";
import {  GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";

export const AssColumnsGroup =(
    handleUnassign:(data:IGroup)=>void,
    loading:boolean
) => [
    {
        field:'name',
        headerName:'Group',
        width:140,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link className="table-link" href={`/dashboard/gruops/${params?.row._id}`} >{params?.row?.name}</Link>
            )
        }

    },
    {
        field:'members',
        headerName: 'No. of members',
        width:150,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex h-full items-center">
                    <span>{params?.row?.members.length}</span>
                </div>
            )
        }
    },
    {
        field:'status',
        headerName:'Check-in Status',
        width:140,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex h-full items-center">
                    <span>{(params?.row?.roomIds?.length > 0) ? 'Checked-in':'Pending'}</span>
                </div>
            )
        }
    },
    {
        field:'_id',
        headerName:'Action',
        width:140,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="h-full flex items-center">
                    {
                        (!params?.row?.roomIds || params?.row?.roomIds?.length === 0) ?

                        <Link className="" href={{pathname:`/dashboard/rooms/assignments/${params?.row?._id}`, query:{type:'Group'}}} >
                            <AddButton disabled={loading} text={loading ? "loading":"Assign room"} smallText noIcon className="h-[2rem] px-2 rounded" />
                        </Link>
                        :
                        <AddButton onClick={()=>handleUnassign(params?.row)} text="Unassign room" smallText noIcon className="h-[2rem] px-2 rounded" />
                    }
                </div>
            )
        }

    },
]