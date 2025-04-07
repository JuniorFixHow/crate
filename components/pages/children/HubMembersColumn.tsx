import { IChurch } from "@/lib/database/models/church.model";
import { IGroup } from "@/lib/database/models/group.model";
import { IMember } from "@/lib/database/models/member.model";
import { IRegistration } from "@/lib/database/models/registration.model";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { IoTrashBinOutline } from "react-icons/io5";

export const HubMembersColumns=(
    handleDelete:(data:IMember)=>void,
    showMember:boolean,
    isAdmin:boolean,
    deleter:boolean,
    showGroup:boolean,
):GridColDef[]=>[
    {
        field:'name',
        headerName:'Member',
        width:180,
        valueFormatter:(_, reg:IRegistration)=>{
            const member = reg.memberId as IMember;
            return member ? member.name : '';
        },
        valueGetter:(_, reg:IRegistration)=>{
            const member = reg.memberId as IMember;
            return member ? Object.values(member) : '';
        },
        renderCell:(param:GridRenderCellParams)=>(
            <>
            {
                showMember ?
                <Link className="table-link" href={{pathname:`/dashboard/events/badges`, query:{regId:param.row?._id}}} >{param?.row?.memberId?.name}</Link>
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
        valueFormatter:(_, reg:IRegistration)=>{
            const member = reg.memberId as IMember;
            return member ? member.gender : '';
        },
        valueGetter:(_, reg:IRegistration)=>{
            const member = reg.memberId as IMember;
            return member ? member.gender : '';
        },
    },
    {
        field:'ageRange',
        headerName:'Age Group',
        width:110,
        valueFormatter:(_, reg:IRegistration)=>{
            const member = reg.memberId as IMember;
            return member ? member.ageRange : '';
        },
        valueGetter:(_, reg:IRegistration)=>{
            const member = reg.memberId as IMember;
            return member ? member.ageRange : '';
        },
    },
    {
        field:'church',
        headerName:'Church',
        width:200,
        
        valueFormatter:(_, reg:IRegistration)=>{
            const member = reg.memberId as IMember;
            const church = member?.church as IChurch;
            return church ? church?.name : '';
        },
        valueGetter:(_, reg:IRegistration)=>{
            const member = reg.memberId as IMember;
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
        field:'group',
        headerName:'Group',
        width:200,
        
        valueFormatter:(_, reg:IRegistration)=>{
            const group = reg.groupId as IGroup;
            return group ? group?.name : '';
        },
        valueGetter:(_, reg:IRegistration)=>{
            const group = reg.groupId as IGroup;
            return group ? group?.name : '';
        },
        renderCell:(params:GridRenderCellParams)=>(
            <>
            {
                params.row?.groupId ?
                <>
                {
                    showGroup ?
                    <Link href={{pathname:`/dashboard/groups/${params.row?.group?._id}`,}} className="table-link" >{params?.row?.group?.name}</Link>
                    :
                    <span>{params?.row?.group?.name}</span>
                }
                </>
                :
                <span>N/A</span>
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