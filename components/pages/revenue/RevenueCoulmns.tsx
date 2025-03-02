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
                    <span onClick={()=>handleNew(params?.row)}  className="table-link" >{new Date(params.row?.createdAt).toLocaleDateString()}</span>
                </div>
            )
        }
    },

    {
        field:'eventId',
        headerName:'Event',
        valueFormatter:(_, value:IPayment)=>{
            const event = value?.eventId as IEvent;
            return  event?.name
        },
        valueGetter:(_, value:IPayment)=>{
            const event = value?.eventId as IEvent;
            return Object.values(event)
        },
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
        valueFormatter:(_, value:IPayment )=>{
            const reg = value?.payer as IRegistration;
            const member = reg?.memberId as IMember;
            return reg ? member?.name :'N/A'
        },
        valueGetter:(_, value:IPayment )=>{
            const reg = value?.payer as IRegistration;
            const member = reg?.memberId as IMember;
            return reg ? Object.values(member) : 'N/A'
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
        valueFormatter:(_, value:IPayment)=>{
            const church = value?.churchId as IChurch;
            return !value?.payer ? church?.name : 'N/A'
        },
        valueGetter:(_, value:IPayment)=>{
            const church = value?.churchId as IChurch;
            return !value?.payer ? Object.values(church) : 'N/A'
        },
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
        valueFormatter:(_, value:IPayment)=>{
            const church = value?.churchId as IChurch;
            return church?.name
        },
        valueGetter:(_, value:IPayment)=>{
            const church = value?.churchId as IChurch;
            return Object.values(church)
        },
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
        valueFormatter:(_, value:IPayment)=>{
            const user = value.payee as IVendor;
            return user?.name;
        },
        valueGetter:(_, value:IPayment)=>{
            const user = value.payee as IVendor;
            return Object.values(user);
        },
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