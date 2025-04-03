import { IChurch } from "@/lib/database/models/church.model";
import { IMember } from "@/lib/database/models/member.model";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { IoTrashBinOutline } from "react-icons/io5";

export const HubMembersColumns=(
    handleDelete:(data:IMember)=>void,
    showMember:boolean,
    isAdmin:boolean,
    deleter:boolean,
):GridColDef[]=>[
    {
        field:'name',
        headerName:'Member',
        width:180,
        renderCell:(param:GridRenderCellParams)=>(
            <>
            {
                showMember ?
                <Link className="table-link" href={`/dashboard/members/${param.row?._id}`} >{param?.row?.name}</Link>
                :
                <span>{param?.row?.name}</span>
            }
            </>
        )
    },

    {
        field:'gender',
        headerName:'Gender',
        width:100,
    },
    {
        field:'ageRange',
        headerName:'Age Group',
        width:110,
    },
    {
        field:'church',
        headerName:'Church',
        width:200,
        valueFormatter:(_, member:IMember)=>{
            const church = member?.church as IChurch;
            return church ? church?.name : '';
        },
        valueGetter:(_, member:IMember)=>{
            const church = member?.church as IChurch;
            return church ? church?.name : '';
        },
        renderCell:(params:GridRenderCellParams)=>(
            <>
            {
                isAdmin ?
                <Link href={{pathname:`/dashboard/churches`, query:{id:params.row?.church?._id}}} className="table-link" >{params?.row?.church?.name}</Link>
                :
                <span>{params?.row?.church?.name}</span>
            }
            </>
        )
    },
    {
        field:'id',
        headerName:'Action',
        width:80,
        filterable:false,
        disableExport:true,
        renderCell:(params:GridRenderCellParams)=>(
            <div className="h-full flex-center" >
            {
                deleter ?
                <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                :
                <span>None</span>
            }
            </div>
        )
    }
]