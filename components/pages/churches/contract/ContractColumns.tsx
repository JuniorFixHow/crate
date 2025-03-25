import { IContract } from "@/lib/database/models/contract.model";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { GoInfo } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";
import { calculateTotalService } from "./single/fxn";

export const ContractColumns = (
    handleInfo:(data:IContract)=>void,
    handleDelete:(data:IContract)=>void,
    reader:boolean,
    updater:boolean,
    deleter:boolean,
):GridColDef[]=>[
    {
        field:'title',
        headerName:'Title',
        width:200,
        renderCell:(item:GridRenderCellParams)=>{
            return(
                <>
                {
                    (reader || updater) ?
                    <Link className="table-link" href={`/dashboard/churches/contracts/${item.row?._id}`} >{item.row?.title}</Link>
                    :
                    <span>{item.row?.title}</span>
                }
                </>
            )
        }
    },
    {
        field:'offeree',
        headerName:'Offeree',
        width:200,
        valueFormatter:(_, contract:IContract)=>{
            const offeree = contract?.offeree;
            return offeree ? offeree?.name : '';
        },
        valueGetter:(_, contract:IContract)=>{
            const offeree = contract?.offeree;
            return offeree ? offeree?.name : '';
        },
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
        valueFormatter:(_, contract:IContract)=>{
            const witness = contract?.witness;
            return witness ? witness?.name : '';
        },
        valueGetter:(_, contract:IContract)=>{
            const witness = contract?.witness;
            return witness ? witness?.name : '';
        },
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
                <span>{calculateTotalService(item.row?.services, item.row?.quantity)}</span>
            )
        }
    },
    {
        field:'from',
        headerName:'Commenced',
        width:100,
        valueFormatter:(_, contract:IContract)=>{
            const from = contract?.date?.from;
            return from ? from : '';
        },
        valueGetter:(_, contract:IContract)=>{
            const from = contract?.date?.from;
            return from ? from : '';
        },
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
        valueGetter:(_, contract:IContract)=>{
            const to = contract?.date?.to;
            return to ? to : '';
        },
        valueFormatter:(_, contract:IContract)=>{
            const to = contract?.date?.to;
            return to ? to : '';
        },
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