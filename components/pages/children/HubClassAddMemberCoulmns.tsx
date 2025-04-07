import { IChurch } from "@/lib/database/models/church.model";
import { IMember } from "@/lib/database/models/member.model";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import CustomCheck from "../group/new/CustomCheck";
import { IRegistration } from "@/lib/database/models/registration.model";
import { IGroup } from "@/lib/database/models/group.model";

export const HubClassAddMemberColumns = (
    handleSelect:(id:string)=>void,
    selection:string[],
    showMember:boolean,
    isAdmin:boolean,
    showGroup:boolean,
):GridColDef[]=>[
    {
        field:'_id',
        headerName:'Selection',
        width:80,
        filterable:false,
        disableExport:true,
        renderCell:(params)=>(
            <div className="flex-center h-full">
                <CustomCheck onClick={()=>handleSelect(params.row?._id)} checked={!!selection.find((item)=>item === params.row?._id)} />
            </div>
        )
    },
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
]