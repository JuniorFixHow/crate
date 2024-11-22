import AddButton from "@/features/AddButton";
import { EventRegProps } from "@/types/Types";
import {  GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";

export const AssignmentColumns =(
    handleUnassign:(data:EventRegProps)=>void,
    isGroup:boolean
) => [
    {
        field:'memberId',
        headerName:isGroup ? 'Group':'Member',
        width:140,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex h-full items-center">
                    <Link className="table-link" href={{pathname:`/dashboard/events/badges`, query:{regId:params?.row?.memberId}}} >{isGroup ? 'Group Name':'Member name'}</Link>
                </div>
            )
        }

    },
    {
        field:'regType',
        headerName:isGroup ? 'No. of members' : 'Type',
        width:150,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex h-full items-center">
                    <span>{isGroup ? '5':params?.row?.regType}</span>
                </div>
            )
        }
    },
    {
        field:'status',
        headerName:'Check-in Status',
        width:140
    },
    {
        field:'id',
        headerName:'Action',
        width:140,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex-center h-full w-full">
                    {
                        params?.row?.status === 'Pending' ?

                        <Link className="" href={`/dashboard/rooms/assignments/${params?.row?.id}`} >
                            <AddButton text="Assign room" smallText noIcon className="h-[2rem] px-2 rounded" />
                        </Link>
                        :
                        <AddButton onClick={()=>handleUnassign(params?.row)} text="Unassign room" smallText noIcon className="h-[2rem] px-2 rounded" />
                    }
                </div>
            )
        }

    },
]