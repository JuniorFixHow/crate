import { IContract } from "@/lib/database/models/contract.model";
import { GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { GoInfo } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";
import { calculateTotalService } from "./single/fxn";

export const ContractColumns = (
    handleInfo:(data:IContract)=>void,
    handleDelete:(data:IContract)=>void,
)=>[
    {
        field:'title',
        headerName:'Title',
        width:200,
        renderCell:(item:GridRenderCellParams)=>{
            return(
                <Link className="table-link" href={`/dashboard/churches/contracts/${item.row?._id}`} >{item.row?.title}</Link>
            )
        }
    },
    {
        field:'offeree',
        headerName:'Offeree',
        width:200,
        renderCell:(item:GridRenderCellParams)=>{
            return(
                <span>{item.row?.offeree?.name}</span>
            )
        }
    },
    {
        field:'witness',
        headerName:'Witness',
        width:200,
        renderCell:(item:GridRenderCellParams)=>{
            return(
                <span>{item.row?.witness?.name}</span>
            )
        }
    },
    {
        field:'amount',
        headerName:'Amount($)',
        width:100,
        renderCell:(item:GridRenderCellParams)=>{
            return(
                <span>{calculateTotalService(item.row?.services)}</span>
            )
        }
    },
    {
        field:'from',
        headerName:'Commenced',
        width:100,
        renderCell:(item:GridRenderCellParams)=>{
            return(
                <span>{item.row?.date?.from}</span>
            )
        }
    },

    {
        field:'to',
        headerName:'Expires',
        width:100,
        renderCell:(item:GridRenderCellParams)=>{
            return(
                <span>{item.row?.date?.to}</span>
            )
        }
    },

    {
        field:'id',
        headerName:'Actions',
        width:80,
        // params:GridRenderCellParams
        renderCell:(params:GridRenderCellParams)=> {
            // console.log(params.row?.id)
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    <GoInfo onClick={()=>handleInfo(params?.row)}  className="cursor-pointer text-green-700" />
                    <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                </div>
            )
        },
    }
    
]