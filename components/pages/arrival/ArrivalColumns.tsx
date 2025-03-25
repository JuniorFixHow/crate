import { formatTimestamp } from "@/functions/dates";
import { ICampuse } from "@/lib/database/models/campuse.model";
import { IChurch } from "@/lib/database/models/church.model";
import { IMember } from "@/lib/database/models/member.model";
import { IRegistration } from "@/lib/database/models/registration.model";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { GoInfo } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";

export const ArrivalColumns = (
    handleInfo:(data:IRegistration)=>void,
    handleDelete:(data:IRegistration)=>void,
    reader:boolean,
    updater:boolean,
    showMember:boolean,
    showChurch:boolean,
    showCampus:boolean,
):GridColDef[]=>[
    {
        field:'memberId',
        headerName:'Member',
        width:200,
        valueFormatter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.name;
        },
        valueGetter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return Object.values(member);
        },
        renderCell:(param:GridRenderCellParams)=>{
            const member = param.row?.memberId;
            return(
                <>
                {
                    showMember ?
                    <Link className="table-link" href={{pathname:`/dashboard/events/badges`, query:{regId:param.row?._id}}} >{member?.name}</Link>
                    :
                    <span >{member?.name}</span>
                }
                </>
            )
        }
    },
    {
        field:'checkedIn',
        headerName:'Arrived On',
        valueFormatter:(_, reg:IRegistration)=>{
            return reg?.checkedIn?.checked ? new Date(reg?.checkedIn.date).toLocaleDateString():'';
        },
        valueGetter:(_, reg:IRegistration)=>{
            return reg?.checkedIn?.checked ? new Date(reg?.checkedIn.date).toLocaleDateString():'';
        },
        width:200,
        renderCell:(param:GridRenderCellParams)=>{
            return(
                    <span>{formatTimestamp(param.row?.checkedIn?.date)}</span>
                // <div className="flex-center">
                // </div>
            )
        }
    },

    {
        field:'email',
        headerName:'Email',
        width:150,
        valueFormatter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.email;
        },
        valueGetter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.email;
        },
        renderCell:({row:reg}:GridRenderCellParams)=>(
            <Link className="table-link" href={`mailto:${reg?.memberId?.email}`} >{reg?.memberId?.email}</Link>
        )
    },
    {
        field:'ageRange',
        headerName:'Age Range',
        width:150,
        valueFormatter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.ageRange;
        },
        valueGetter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.ageRange;
        },
        renderCell:({row:reg}:GridRenderCellParams)=>(
            <span  >{reg?.memberId?.ageRange}</span>
        )
    },
    {
        field:'gender',
        headerName:'Gender',
        width:150,
        valueFormatter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.gender;
        },
        valueGetter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.gender;
        },
        renderCell:({row:reg}:GridRenderCellParams)=>(
            <span  >{reg?.memberId?.gender}</span>
        )
    },
    {
        field:'phone',
        headerName:'Phone',
        width:150,
        valueFormatter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.phone;
        },
        valueGetter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.phone;
        },
        renderCell:({row:reg}:GridRenderCellParams)=>(
            <Link className="table-link" href={`tel:${reg?.memberId?.email}`} >{reg?.memberId?.phone}</Link>
        )
    },
    {
        field:'mstatus',
        headerName:'Member Status',
        width:150,
        valueFormatter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.status;
        },
        valueGetter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.status;
        },
        renderCell:({row:reg}:GridRenderCellParams)=>(
            <span  >{reg?.memberId?.status}</span>
        )
    },
    {
        field:'marital',
        headerName:'Marital Status',
        width:130,
        valueFormatter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.marital;
        },
        valueGetter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.marital;
        },
        renderCell:({row:reg}:GridRenderCellParams)=>(
            <span  >{reg?.memberId?.marital}</span>
        )
    },
    {
        field:'employ',
        headerName:'Employment Status',
        width:130,
        valueFormatter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.employ;
        },
        valueGetter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.employ;
        },
        renderCell:({row:reg}:GridRenderCellParams)=>(
            <span  >{reg?.memberId?.employ}</span>
        )
    },
    {
        field:'voice',
        headerName:'Voice',
        width:130,
        valueFormatter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.voice;
        },
        valueGetter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.voice;
        },
        renderCell:({row:reg}:GridRenderCellParams)=>(
            <span  >{reg?.memberId?.voice}</span>
        )
    },
    {
        field:'role',
        headerName:'Role',
        width:130,
        valueFormatter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.role;
        },
        valueGetter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.role;
        },
        renderCell:({row:reg}:GridRenderCellParams)=>(
            <span  >{reg?.memberId?.role}</span>
        )
    },
    // {
    //     field:'allergy',
    //     headerName:'Allergy',
    //     width:130,
    //     valueFormatter:(_, row:IRegistration)=>{
    //         const member  = row?.memberId as IMember;
    //         return member?.allergy;
    //     },
    //     valueGetter:(_, row:IRegistration)=>{
    //         const member  = row?.memberId as IMember;
    //         return member?.allergy;
    //     },
    //     // renderCell:({row:reg}:GridRenderCellParams)=>(
    //     //     <Link className="table-link" href={`mailto:${reg?.memberId?.email}`} >{reg?.memberId?.email}</Link>
    //     // )
    // },
    // {
    //     field:'dietary',
    //     headerName:'Dietary',
    //     width:130,
    //     valueFormatter:(_, row:IRegistration)=>{
    //         const member  = row?.memberId as IMember;
    //         return member?.dietary;
    //     },
    //     valueGetter:(_, row:IRegistration)=>{
    //         const member  = row?.memberId as IMember;
    //         return member?.dietary;
    //     },
    //     // renderCell:({row:reg}:GridRenderCellParams)=>(
    //     //     <Link className="table-link" href={`mailto:${reg?.memberId?.email}`} >{reg?.memberId?.email}</Link>
    //     // )
    // },
    {
        field:'church',
        headerName:'Church',
        width:150,
        valueFormatter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            const church = member?.church as IChurch;
            return church?.name;
        },
        valueGetter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            const church = member?.church as IChurch;
            return church?.name;
        },
        renderCell:({row:reg}:GridRenderCellParams)=>(
            <>
            {
                showChurch ?
                <Link className="table-link" href={{pathname:'/dashboard/churches', query:{id:reg?.memberId?.church?._id}}} >{reg?.memberId?.church?.name}</Link>
                :
                <span >{reg?.memberId?.church?.name}</span>
            }
            </>
        )
    },
    {
        field:'campus',
        headerName:'Campus',
        width:150,
        valueFormatter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            const campus = member?.campuseId as ICampuse;
            return campus?.name;
        },
        valueGetter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            const campus = member?.campuseId as ICampuse;
            return campus?.name;
        },
        renderCell:({row:reg}:GridRenderCellParams)=>(
            <>
            {
                showCampus ?
                <Link className="table-link" href={{pathname:'/dashboard/churches/campuses', query:{id:reg?.memberId?.campuseId?._id}}} >{reg?.memberId?.campuseId?.name}</Link>
                :
                <span>{reg?.memberId?.campuseId?.name}</span>
            }
            </>
        )
    },
    {
        field:'regType',
        headerName:'Type',
        width:120,
        valueFormatter:(_, row:IRegistration)=>{
            return row?.groupId ? 'Group':'Individual'
        },
        valueGetter:(_, row:IRegistration)=>{
            return row?.groupId ? 'Group':'Individual'
        },
        renderCell:(params:GridRenderCellParams) =>{
            return(
                <span >{params?.row?.groupId ? 'Group':'Individual'}</span>
            )
        }
    },

    {
            field:'id',
            headerName:'Actions',
            width:80,
            renderCell:(params:GridRenderCellParams)=> {
                return(
                    <div className="flex h-full flex-row items-center gap-4">
                        {
                            reader &&
                            <GoInfo onClick={()=>handleInfo(params?.row)}  className="cursor-pointer text-green-700" />
                        }
                        {
                            updater &&
                            <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                        }
                        {
                            !reader && !updater &&
                            <span>None</span>
                        }
                    </div>
                )
            },
    }
]