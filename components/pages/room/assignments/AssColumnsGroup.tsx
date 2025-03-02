import AddButton from "@/components/features/AddButton";
import { IChurch } from "@/lib/database/models/church.model";
import { IGroup } from "@/lib/database/models/group.model";
import { IMember } from "@/lib/database/models/member.model";
import { IRegistration } from "@/lib/database/models/registration.model";
import { IRoom } from "@/lib/database/models/room.model";
import {  GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";

export const AssColumnsGroup =(
    handleUnassign:(data:IGroup)=>void,
    loading:boolean
):GridColDef[] => [
    {
        field:'name',
        headerName:'Group',
        width:140,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link className="table-link" href={{pathname:`/dashboard/groups/${params?.row._id}`}} >{params?.row?.name}</Link>
            )
        }
        
    },
    {
        field:'churchId',
        headerName:'Church',
        width:150,
        valueFormatter:(_, item:IGroup)=>{
            const church = item?.churchId as IChurch;
            return church?.name;
        },
        valueGetter:(_, item:IGroup)=>{
            const church = item?.churchId as IChurch;
            return Object.values(church);
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link href={{pathname:'/dashboard/churches', query:{id:params.row?.churchId?._id}}} className="table-link" >{params?.row?.churchId?.name}</Link>
            )
        }
    },
    {
        field:'members',
        headerName: 'No. of members',
        width:150,
        valueFormatter:(_, item:IGroup)=>{
            const members = item?.members as IMember[];
            return members?.length
        },
        valueGetter:(_, item:IGroup)=>{
            const members = item?.members as IMember[];
            return members?.length
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex h-full items-center">
                    <span>{params?.row?.members.length}</span>
                </div>
            )
        }
    },
    {
        field:'eligible',
        headerName:'MEFRA',
        width:120,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <span className="text-center" >{params?.row?.eligible}</span>
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
        field:'_id',
        headerName:'Action',
        width:140,
        filterable:false,
        disableExport:true,
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