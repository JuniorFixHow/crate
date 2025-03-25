import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import Link from "next/link"
import { IoTrashBinOutline } from "react-icons/io5"
import { getJustTime } from "../../session/fxn"
import { ICAttendance } from "@/lib/database/models/classattendance.model"
import { IMember } from "@/lib/database/models/member.model"
import { IClasssession } from "@/lib/database/models/classsession.model"

export const AttendanceColumnsV2 = (
    handleDelete:(data:ICAttendance)=>void,
    deleter:boolean,
    showMember:boolean,
    showSession:boolean,
):GridColDef[]=> [
    {
        field:'member',
        headerName:'Member',
        width:170,
        valueFormatter: (_, row:ICAttendance) => {
            const member = row?.member as IMember;
            return member?.name;
        },
        valueGetter: (_, row:ICAttendance) => {
            const member = row?.member as IMember;
            return member ? Object.values(member) : 'N/A';
        },
        renderCell:(params:GridRenderCellParams) => {
            return(
                <>
                {
                    showMember ?
                    <Link href={params?.row?.member?._id}  className='table-link' >{params?.row?.member?.name}</Link>
                    :
                    <span>{params?.row?.member?.name}</span>
                }
                </>
            )  
        },
    },
    {
        field:'createdAt',
        headerName:'Time',
        width:120,
        valueFormatter: (_, value:ICAttendance) => new Date(value.createdAt)?.toLocaleDateString(),
        valueGetter: (_, value:ICAttendance) => new Date(value.createdAt)?.toLocaleDateString(),
        renderCell:(params:GridRenderCellParams) => {
            return(
                <span className='' >{getJustTime(params?.row?.createdAt)}</span>
            )  
        },
    },
    {
        field:'late',
        headerName:'Late',
        width:90
    },
   
    {
        field:'sessionId',
        headerName:"Session",
        width:150,
        valueFormatter: (_, row:ICAttendance) => {
            const session = row?.sessionId as IClasssession;
            return session?.name;
        },
        valueGetter: (_, row:ICAttendance) => {
            const session = row?.sessionId as IClasssession;
            return session ? Object.values(session) : 'N/A';
        },
        renderCell:(params:GridRenderCellParams) => {
            return(
                <>
                {
                    showSession ?
                    <Link href={{pathname:`/dashboard/ministries/sessions/${params.row?.sessionId?._id}`, }} className='table-link' >{params?.row?.sessionId?.name}</Link>
                    :
                    <span>{params?.row?.sessionId?.name}</span>
                }
                </>
            )  
        },
    },
    
    
    {
        field:'_id',
        headerName:'Actions',
        width:80,
        filterable:false,
        disableExport:true,
        // params:GridRenderCellParams
        renderCell:(params:GridRenderCellParams)=> {
            // console.log(params.row?.id)
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    {
                        deleter ?
                        <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                        :
                        <span>None</span>
                    }
                </div>
            )
        },
    }
]