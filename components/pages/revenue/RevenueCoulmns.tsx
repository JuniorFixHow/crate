import { IPayment } from "@/lib/database/models/payment.model";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { GoInfo } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";
import { monthFirstDate } from "./fxn";
import Link from "next/link";

export const RevenueColumns = (
    handleInfo:(data:IPayment)=>void,
    handleDelete:(data:IPayment)=>void,
    handleNew:(data:IPayment)=>void,
) => [
    
    {
        field:'createdAt',
        headerName:'Paid on',
        width:140,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    <span onClick={()=>handleNew(params?.row)}  className="table-link" >{monthFirstDate(params.row?.createdAt)}</span>
                </div>
            )
        }
    },
    {
        field:'amount',
        headerName:'Amount ($)',
        width:100,
    },
    {
        field:'purpose',
        headerName:'Purpose',
        width:100,
    },
    {
        field:'payer',
        headerName:'Member',
        width:180,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link className="table-link" href={{pathname:'/dashboard/events/badges', query:{id:params.row?.payer?._id}}} >{params.row?.payer?.memberId?.name}</Link>
            )
        }
    },
    {
        field:'church',
        headerName:'Church',
        width:180,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link className="table-link" href={{pathname:'/dashboard/churches', query:{id:params.row?.payer?.memberId?.church?._id}}} >{params.row?.payer?.memberId?.church?.name}</Link>
            )
        }
    },
    {
        field:'payee',
        headerName:'Received By',
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