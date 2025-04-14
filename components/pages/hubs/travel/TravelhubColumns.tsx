import { ITravelhub } from "@/lib/database/models/travelhub.model";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { GoInfo } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";
import { formatDateTime } from "../../session/fxn";
import { IRegistration } from "@/lib/database/models/registration.model";
import { IMember } from "@/lib/database/models/member.model";
import { IChurch } from "@/lib/database/models/church.model";

export const TravelhubColumns = (
    handleInfo:(data:ITravelhub)=>void,
    handleEdit:(data:ITravelhub)=>void,
    handleDelete:(data:ITravelhub)=>void,
    updater:boolean,
    reader:boolean,
    deleter:boolean,
    isAdmin:boolean,
):GridColDef[]=>[
    {
        field:'regId',
        headerName:'Member',
        width:190,
        valueFormatter:(_, traveller:ITravelhub)=>{
            const reg = traveller?.regId as IRegistration;
            const member = reg?.memberId as IMember;
            return member ? Object.values(member) : '';
        },
        valueGetter:(_, traveller:ITravelhub)=>{
            const reg = traveller?.regId as IRegistration;
            const member = reg?.memberId as IMember;
            return member ? Object.values(member) : '';
        },
        renderCell:(param:GridRenderCellParams)=>(
            <>
            {
                updater ?
                <span onClick={()=>handleEdit(param.row)} className="table-link" >{param.row?.regId?.memberId?.name}</span>
                :
                <span >{param.row?.regId?.memberId?.name}</span>
            }
            </>
        )
    },
    {
        field:'church',
        headerName:'Church',
        width:190,
        valueFormatter:(_, traveller:ITravelhub)=>{
            const reg = traveller?.regId as IRegistration;
            const member = reg?.memberId as IMember;
            const church = member?.church as IChurch;
            return church ? Object.values(church) : '';
        },
        valueGetter:(_, traveller:ITravelhub)=>{
            const reg = traveller?.regId as IRegistration;
            const member = reg?.memberId as IMember;
            const church = member?.church as IChurch;
            return church ? Object.values(church) : '';
        },
        renderCell:(param:GridRenderCellParams)=>(
            <>
            {
                isAdmin ?
                <Link href={{pathname:'/dashboard/churches', query:{id:param.row?.regId?.memberId?.church?._id}}}  className="table-link" >{param.row?.regId?.memberId?.church?.name}</Link>
                :
                <span>{param.row?.regId?.memberId?.church?.name}</span>
            }
            </>
        )
    },
    {
        field:'depAirport',
        headerName:'Departure Airport',
        width:180,
    },
    {
        field:'depTime',
        headerName:'Departure Time',
        width:130,
        valueFormatter:(_, traveller:ITravelhub)=>{
            const time = formatDateTime(traveller.depTime);
            return time ? time :'';
        },
        valueGetter:(_, traveller:ITravelhub)=>{
            const time = formatDateTime(traveller.depTime);
            return time ? time :'';
        },
    },
    {
        field:'arrAirport',
        headerName:'Arrival Airport',
        width:180,
    },
    {
        field:'arrTime',
        headerName:'Arrival Time',
        width:130,
        valueFormatter:(_, traveller:ITravelhub)=>{
            const time = formatDateTime(traveller.arrTime);
            return time ? time :'';
        },
        valueGetter:(_, traveller:ITravelhub)=>{
            const time = formatDateTime(traveller.arrTime);
            return time ? time :'';
        },
    },
    {
        field:'arrTerminal',
        headerName:'Arr. Terminal',
        width:100,
    },
    {
        field:'pickup',
        headerName:'Requires Pickup',
        width:100,
        valueFormatter:(_, traveller:ITravelhub)=>{
            const pickup = traveller?.pickup ? 'Yes':'No';
            return pickup;
        },
        valueGetter:(_, traveller:ITravelhub)=>{
            const pickup = traveller?.pickup ? 'Yes':'No';
            return pickup;
        },
    },
    {
        field:'notes',
        headerName:'Note',
        width:200,
    },
    { 
        field:'id',
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
                        reader &&
                        <GoInfo onClick={()=>handleInfo(params?.row)}  className="cursor-pointer text-green-700" />
                    }
                    {
                        deleter &&
                        <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                    }
                    {
                        !reader && !deleter &&
                        <span>None</span>
                    }
                </div>
            )
        },
    }
]