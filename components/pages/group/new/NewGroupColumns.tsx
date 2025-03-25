import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import CustomCheck from "./CustomCheck";
import Link from "next/link";
import { IRegistration } from "@/lib/database/models/registration.model";
import { IMember } from "@/lib/database/models/member.model";
import { IChurch } from "@/lib/database/models/church.model";

export const NewGroupColumns = (
    members:string[],
    handleCheckClick:(id:string)=>void,
    showMember:boolean,
    isAdmin:boolean,
):GridColDef[]=>[
    {
        field:'id',
        headerName:'Selection',
        width:80,
        filterable:false,
        disableExport:true,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex-center h-full">

                <CustomCheck onClick={()=>handleCheckClick(params?.row?.memberId._id)} checked ={members.includes(params.row?.memberId._id)} />
                </div>
            )
        }
    },
    {
        field:'name',
        headerName:'Member',
        width:140,
        valueFormatter:(_,reg:IRegistration)=>{
            const member = reg?.memberId as IMember;
            return member?  member?.name : '';
        },
        valueGetter:(_,reg:IRegistration)=>{
            const member = reg?.memberId as IMember;
            return member?  Object.values(member) : '';
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    showMember ?
                    <Link href={`/dashboard/members/${params?.row?.memberId._id}`} className="table-link text-center" >{params?.row?.memberId.name}</Link>
                    :
                    <span >{params?.row?.memberId.name}</span>
                }
                </>
            )
        }
    },
    // {
    //     field:'country',
    //     headerName:'Country',
    //     width:100,
    //     renderCell:(params:GridRenderCellParams)=>{
    //         return(
    //             <span   >{params?.row?.memberId?.church?.zoneId?.country}</span>
    //         )
    //     }
    // },
    {
        field:'church',
        headerName:'Church',
        width:140,
        valueFormatter:(_,reg:IRegistration)=>{
            const member = reg?.memberId as IMember;
            const church = member?.church as IChurch;
            return church?  church?.name : '';
        },
        valueGetter:(_,reg:IRegistration)=>{
            const member = reg?.memberId as IMember;
            const church = member?.church as IChurch;
            return church?  church?.name : '';
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    isAdmin ?
                    <Link href={{pathname:'/dashboard/churches', query:{id:params?.row?.memberId?.church?._id}}}  className="table-link" >{params?.row?.memberId?.church?.name}</Link>
                    :
                    <span>{params?.row?.memberId?.church?.name}</span>
                }
                </>
            )
        }
    },
    {
        field:'email',
        headerName:'Email',
        width:140,
        valueFormatter:(_,reg:IRegistration)=>{
            const member = reg?.memberId as IMember;
            return member?  member?.email : '';
        },
        valueGetter:(_,reg:IRegistration)=>{
            const member = reg?.memberId as IMember;
            return member?  member?.email : '';
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <span className="" >{params?.row?.memberId?.email}</span>
            )
        }
    },
    {
        field:'status',
        headerName:'Status',
        width:120,
        valueFormatter:(_,reg:IRegistration)=>{
            const member = reg?.memberId as IMember;
            return member?  member?.status : '';
        },
        valueGetter:(_,reg:IRegistration)=>{
            const member = reg?.memberId as IMember;
            return member?  member?.status : '';
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <span className="" >{params?.row?.memberId?.status}</span>
            )
        }
    },
]