import AddButton from "@/components/features/AddButton";
import { IGroup } from "@/lib/database/models/group.model";
import { IMember } from "@/lib/database/models/member.model";
import { IRegistration } from "@/lib/database/models/registration.model";
import { IRoom } from "@/lib/database/models/room.model";
import {  GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";

export const AssignmentColumns =(
    handleUnassign:(data:IRegistration)=>void,
    loading:boolean
):GridColDef[] => [
    {
        field:'memberId',
        headerName:'Member',
        width:140,
        valueFormatter:(_, item:IRegistration)=>{
            const member = item?.memberId as IMember;
            return member?.name;
        },
        valueGetter:(_, item:IRegistration)=>{
            const member = item?.memberId as IMember;
            return Object.values(member);
        },
       
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
        valueFormatter:(_, item:IRegistration)=>{
            const group = item?.groupId as IGroup;
            return group ? 'Group':'Individual'
        },
        valueGetter:(_, item:IRegistration)=>{
            const group = item?.groupId as IGroup;
            return group ? 'Group':'Individual'
        },
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
        headerName:'Room Assignment Status',
        width:200,
        valueFormatter:(_, item:IRegistration)=>{
            const rooms = item?.roomIds as IRoom[];
            return rooms?.length ? 'Checked-in':'Pending'
        },
        valueGetter:(_, item:IRegistration)=>{
            const rooms = item?.roomIds as IRoom[];
            return rooms?.length ? 'Checked-in':'Pending'
        },
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
        filterable:false,
        disableExport:true,
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