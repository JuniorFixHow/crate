import { IPayment } from "@/lib/database/models/payment.model";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { GoInfo } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";
import { monthFirstDate } from "./fxn";
import Link from "next/link";
import { IChurch } from "@/lib/database/models/church.model";
import { IVendor } from "@/lib/database/models/vendor.model";
import { IMember } from "@/lib/database/models/member.model";
import { IRegistration } from "@/lib/database/models/registration.model";
import { IEvent } from "@/lib/database/models/event.model";

export const RevenueColumns = (
    handleInfo:(data:IPayment)=>void,
    handleDelete:(data:IPayment)=>void,
    handleNew:(data:IPayment)=>void,
):GridColDef[] => [
    
    {
        field:'createdAt',
        headerName:'Paid on',
        width:140,
        valueFormatter:(value:string)=> new Date(value).toLocaleDateString(),
        valueGetter:(value:string)=> new Date(value).toLocaleDateString(),
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    <span onClick={()=>handleNew(params?.row)}  className="table-link" >{monthFirstDate(params.row?.createdAt)}</span>
                </div>
            )
        }
    },

    {
        field:'eventId',
        headerName:'Event',
        valueFormatter:(value:IEvent)=>value?.name,
        valueGetter:(value:IEvent)=>value?._id,
        width:180,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link className="table-link" href={{pathname:`/dashboard/events/${params.row?.eventId?._id}`, }} >{params.row?.eventId?.name}</Link>
            )
        }
    },

    {
        field:'amount',
        headerName:'Amount ($)',
        width:100,
    },
    {
        field:'dueAmount',
        headerName:'Due Amount ($)',
        width:120,
    },
    {
        field:'purpose',
        headerName:'Purpose',
        width:100,
    },
    {
        field:'payer',
        headerName:'Paid By Member',
        width:180,
        valueFormatter:(value:IRegistration )=>{
            const member = value?.memberId as IMember;
            return member?.name
        },
        valueGetter:(value:IRegistration )=>{
            const member = value?.memberId as IMember;
            return member?.name
        },
        
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    params.row?.payer ?
                    <Link className="table-link" href={{pathname:'/dashboard/events/badges', query:{id:params.row?.payer?._id}}} >{params.row?.payer?.memberId?.name}</Link>
                    :
                    <span>N/A</span>
                    // <Link className="table-link" href={{pathname:'/dashboard/churches', query:{id:params.row?.churchId?._id}}} >{params.row?.churchId?.name}</Link>
                }
                </>
            )
        }
    },
    {
        field:'churchId',
        headerName:'Paid By Church',
        valueFormatter:(value:IChurch)=>value?.name,
        valueGetter:(value:IChurch)=>value?.name,
        // valueSetter:(value:IChurch)=>value?.name,
        width:180,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    !params.row?.payer ?
                    <Link className="table-link" href={{pathname:'/dashboard/churches', query:{id:params.row?.churchId?._id}}} >{params.row?.churchId?.name}</Link>
                    :
                    <span>N/A</span>
                }
                </>
            )
        }
    },
    {
        field:'church',
        headerName:'Church Involved',
        valueFormatter:(value:IChurch)=>value?.name,
        valueGetter:(value:IChurch)=>value?.name,
        // valueSetter:(value:IChurch)=>value?.name,
        width:180,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link className="table-link" href={{pathname:'/dashboard/churches', query:{id:params.row?.churchId?._id}}} >{params.row?.churchId?.name}</Link>
            )
        }
    },
    {
        field:'payee',
        headerName:'Received By',
        valueFormatter:(value:IVendor)=>value?.name,
        valueGetter:(value:IVendor)=>value?.name,
        width:180,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link className="table-link" href={{pathname:'/dashboard/users', query:{id:params.row?.payee?._id}}} >{params.row?.payee?.name}</Link>
            )
        }
    },
    
    
    {
        field:'_id',
        headerName:'Actions',
        filterable:false,
        disableExport:true,
        width:120,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    <GoInfo onClick={()=>handleInfo(params?.row)}  className="cursor-pointer text-green-700" />
                    <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                </div>
            )
        }
    },
] 