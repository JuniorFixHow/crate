import { IChildrenrole } from "@/lib/database/models/childrenrole.model";
import { IChurch } from "@/lib/database/models/church.model";
import { IMember } from "@/lib/database/models/member.model";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { IoTrashBinOutline } from "react-icons/io5";

export const HubLeadersColumns=(
    handleEdit:(data:IChildrenrole)=>void,
    handleDelete:(data:IChildrenrole)=>void,
    showMember:boolean,
    isAdmin:boolean,
    deleter:boolean,
):GridColDef[]=>[
    {
        field:'title',
        headerName:'Role',
        width:130,
        renderCell:(params:GridRenderCellParams)=>(
            <span onClick={()=>handleEdit(params.row)}  className="table-link" >{params.row?.title}</span>
        )
    },
    {
        field:'name',
        headerName:'Member',
        width:180,
        valueFormatter:(_, role:IChildrenrole)=>{
            const member = role.memberId as IMember;
            return member ? member?.name : '';
        },
        valueGetter:(_, role:IChildrenrole)=>{
            const member = role.memberId as IMember;
            return member ? member?.name : '';
        },
        renderCell:(param:GridRenderCellParams)=>(
            <>
            {
                showMember ?
                <Link className="table-link" href={`/dashboard/members/${param.row?.memberId?._id}`} >{param?.row?.memberId?.name}</Link>
                :
                <span>{param?.row?.memberId?.name}</span>
            }
            </>
        )
    },

    {
        field:'gender',
        headerName:'Gender',
        width:100,
        valueFormatter:(_, role:IChildrenrole)=>{
            const member = role.memberId as IMember;
            return member ? member?.gender : '';
        },
        valueGetter:(_, role:IChildrenrole)=>{
            const member = role.memberId as IMember;
            return member ? member?.gender : '';
        },
    },
    {
        field:'ageRange',
        headerName:'Age Group',
        width:110,
        valueFormatter:(_, role:IChildrenrole)=>{
            const member = role.memberId as IMember;
            return member ? member?.ageRange : '';
        },
        valueGetter:(_, role:IChildrenrole)=>{
            const member = role.memberId as IMember;
            return member ? member?.ageRange : '';
        },
    },
    {
        field:'church',
        headerName:'Church',
        width:200,
        valueFormatter:(_, role:IChildrenrole)=>{
            const member = role.memberId as IMember;
            const church = member?.church as IChurch;
            return church ? church?.name : '';
        },
        valueGetter:(_, role:IChildrenrole)=>{
            const member = role.memberId as IMember;
            const church = member?.church as IChurch;
            return church ? church?.name : '';
        },
        
        renderCell:(params:GridRenderCellParams)=>(
            <>
            {
                isAdmin ?
                <Link href={{pathname:`/dashboard/churches`, query:{id:params.row?.memberId?.church?._id}}} className="table-link" >{params?.row?.memberId?.church?.name}</Link>
                :
                <span>{params?.row?.memberId?.church?.name}</span>
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