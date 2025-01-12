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
                <Link className="table-link" href={{pathname:`/dashboard/groups/${params?.row._id}`}} >{params?.row?.name}</Link>
            )
        }

    },
    {
        field:'churchId',
        headerName:'Church',
        width:150,
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