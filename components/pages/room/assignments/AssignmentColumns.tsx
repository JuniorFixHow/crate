import AddButton from "@/components/features/AddButton";
import { IRegistration } from "@/lib/database/models/registration.model";
import {  GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";

export const AssignmentColumns =(
    handleUnassign:(data:IRegistration)=>void,
    loading:boolean
) => [
    {
        field:'memberId',
        headerName:'Member',
        width:140,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link className="table-link" href={{pathname:`/dashboard/events/badges`, query:{regId:params?.row?._id}}} >{params?.row?.memberId?.name}</Link>
            )
        }

    },
    {
        field:'regType',
        headerName:'Type',
        width:150,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex h-full items-center">
                    <span>{params?.row?.groupId ? 'Group':'Individual'}</span>
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
        field:'id',
        headerName:'Action',
        width:140,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="h-full flex items-center">
                    {
                        (!params?.row?.roomIds || params?.row?.roomIds?.length === 0) ?

                        <Link className="" href={{pathname:`/dashboard/rooms/assignments/${params?.row?._id}`, query:{type:'Member'}}} >
                            <AddButton text="Assign room" smallText noIcon className="h-[2rem] px-2 rounded" />
                        </Link>
                        :
                        <AddButton onClick={()=>handleUnassign(params?.row)} disabled={loading} text={loading ? "loading":"Unassign room"} smallText noIcon className="h-[2rem] px-2 rounded" />
                    }
                </div>
            )
        }

    },
]