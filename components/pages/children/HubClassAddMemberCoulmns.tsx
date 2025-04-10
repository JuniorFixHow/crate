import { IChurch } from "@/lib/database/models/church.model";
import { IMember } from "@/lib/database/models/member.model";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import CustomCheck from "../group/new/CustomCheck";
import { IRegistration } from "@/lib/database/models/registration.model";
import { IGroup } from "@/lib/database/models/group.model";
import { RegistrationWithRelationships } from "@/types/Types";
import { ConvertibleRelationship, getOtherUserFirst, getRelationValue } from "../members/relationships/fxn";

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

        {
            field:'rel',
            headerName:'Relationship',
            width:100,
            valueFormatter:(_, data:RegistrationWithRelationships)=>{
                const member = data.memberId as IMember;
                const rel = data?.relationships?.[0];
                const members = rel?.members as IMember[];
                return rel ? getRelationValue(members, member, rel?.type as ConvertibleRelationship):'None';
            },
            valueGetter:(_, data:RegistrationWithRelationships)=>{
                const member = data.memberId as IMember;
                const rel = data?.relationships?.[0];
                const members = rel?.members as IMember[];
                return rel ? getRelationValue(members, member, rel?.type as ConvertibleRelationship):'None';
            }
        },
        
        
        {
            field:'relatedTo',
            headerName:'Related To',
            width:200,
            valueFormatter:(_, data:RegistrationWithRelationships)=>{
                const member = data.memberId as IMember;
                const rel = data?.relationships?.[0];
                if(rel){
                    const members = rel?.members as IMember[];
                    const morethan2 = rel?.members?.length > 2;
                    const suffix = `+${rel?.members?.length - 2} ${rel?.members?.length === 3 ? 'other':'others'}`
                    return `${getOtherUserFirst(members, member)?.name} ${morethan2 && suffix}`;
                    
                }
                return 'N/A';
            },
            valueGetter:(_, data:RegistrationWithRelationships)=>{
                const rel = data?.relationships?.[0];
                if(rel){
                    const member = data.memberId as IMember;
                    const members = rel?.members as IMember[];
                    const morethan2 = rel?.members?.length > 2;
                    const suffix = `+${rel?.members?.length - 2} ${rel?.members?.length === 3 ? 'other':'others'}`
                    return `${getOtherUserFirst(members, member)?.name} ${morethan2 && suffix}`;
                    
                }
                return 'N/A';
            },
            renderCell:({row}:GridRenderCellParams)=>
                {
                    const member = row?.memberId as IMember;
                    const members = row?.relationships?.[0]?.members;
                return(
                <div className="flex gap-1">
                    {
                        members?.length > 0 ?
                        <>
                            <>
                            {
                                showMember?
                                <Link href={`/dashboard/members/${getOtherUserFirst(members, member)?._id}`} className="table-link" >{getOtherUserFirst(members, member)?.name}</Link>
                                :
                                <span >{getOtherUserFirst(members, member)?.name}</span>
                            }
                            </>
                            {
                                members?.length > 2 &&
                                <span>{`+${members?.length - 2} ${members?.length === 3 ? 'other':'others'}`}</span>
                            }
                        </>
                        :
                        <span>N/A</span>
                    }
                </div>
            )}
        },
]