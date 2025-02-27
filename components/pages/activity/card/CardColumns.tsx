import { ICard } from "@/lib/database/models/card.model";
import { IMember } from "@/lib/database/models/member.model";
import { Tooltip } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { FiPrinter } from "react-icons/fi";
import { GoInfo } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";
import CustomCheck from "../../group/new/CustomCheck";

export const CardColumns = (
    // handleInfo:(data:ICard)=>void,
    handleEdit:(data:ICard)=>void,
    handleDelete:(data:ICard)=>void,
    handlePrint:(data:ICard)=>void,
    selection:ICard[]
):GridColDef[]=>[
    {
        field:'_id',
        headerName:'Select',
        width:80,
        disableExport:true,
        filterable:false,
        renderCell:(param:GridRenderCellParams)=>{
            return (
                <div className="flex-center h-full">
                    <CustomCheck onClick={()=>handlePrint(param.row)} checked={selection.flatMap((item)=>item?._id).includes(param.row?._id)} />
                </div>
            )
        }
    },
    {
        field:'member',
        headerName:'Member',
        width:180,
        valueFormatter:(value:IMember)=>value?.name,
        valueGetter:(value:IMember)=>value?.name,
        renderCell:(param:GridRenderCellParams)=>{
            return (
                // <span className="table-link" onClick={()=>handleEdit(param.row)} >{param.row?.member?.name}</span>
                <Tooltip title={`visit ${param.row?.member?.name}`} >
                    <Link className="table-link" href={`/dashboard/members/${param.row?.member?._id}`} >{param.row?.member?.name}</Link>
                </Tooltip>
            )
        }
    },

    
    {
        field:'createdAt',
        headerName:'Created on',
        width:100,
        valueFormatter:(value:string)=> new Date(value)?.toLocaleDateString(),
        valueGetter:(value:string)=>new Date(value)?.toLocaleDateString(),
         renderCell:(param:GridRenderCellParams)=>{
            return(
                <span>{new Date(param.row?.createdAt)?.toLocaleDateString()}</span>
            )
        }
    },
    {
        field:'expDate',
        headerName:'Expiry',
        width:100,
        valueFormatter:(value:string)=> value === 'Never' ?  'Never' : new Date(value)?.toLocaleDateString(),
        valueGetter:(value:string)=> value === 'Never' ?  'Never' : new Date(value)?.toLocaleDateString(),
         renderCell:(param:GridRenderCellParams)=>{
            const exp = param.row?.expDate === 'Never' ? 'Never' : new Date(param.row?.expDate)?.toLocaleDateString();
            return(
                <span>{exp}</span>
            )
        }
    },
    {
        field:'lastPrinted',
        headerName:'Last Printed Date',
        width:140,
        valueFormatter:(value:string)=> new Date(value)?.toLocaleDateString(),
        valueGetter:(value:string)=>new Date(value)?.toLocaleDateString(),
         renderCell:(param:GridRenderCellParams)=>{
            const exp = param.row?.lastPrinted  ? new Date(param.row?.expDate)?.toLocaleDateString() : 'None';
            return(
                <span>{exp}</span>
            )
        }
    },

    {
        field:'id',
        headerName:'Actions',
        width:120,
        filterable:false,
        disableExport:true,
        renderCell:(params:GridRenderCellParams)=> {
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    <Tooltip title='Card info' >
                        <GoInfo onClick={()=>handleEdit(params?.row)}  className="cursor-pointer text-green-700" />
                    </Tooltip>
                    <Tooltip title='Print Card' >
                        <FiPrinter onClick={()=>handlePrint(params.row)} className="text-blue-500 cursor-pointer" />
                    </Tooltip>
                    <Tooltip title='Delete Card' >
                        <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                    </Tooltip>
                </div>
            )
        },
    }
]