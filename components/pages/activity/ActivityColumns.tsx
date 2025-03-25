import { IActivity } from "@/lib/database/models/activity.model";
import { IClassministry } from "@/lib/database/models/classministry.model";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { GoInfo } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";

export const ActivityColumns = (
    handleDelete:(data:IActivity)=>void,
    handleInfo:(data:IActivity)=>void,
    reader:boolean,
    deleter:boolean,
    minReader:boolean,
):GridColDef[]=>[
    {
        field:'name',
        headerName:'Name',
        width:200,
        renderCell:(param:GridRenderCellParams)=>{
            return(
                <>
                {
                    reader ?
                    <Link className="table-link" href={`/dashboard/activities/${param.row?._id}`} >{param.row?.name}</Link>
                    :
                    <span>{param.row?.name}</span>
                }
                </>
            )
        }
    },
    {
        field:'minId',
        headerName:'Ministry',
        width:120,
        valueFormatter:(_, act:IActivity)=>{
            const min = act?.minId as IClassministry;
            return min?.title ? min?.title : ''
        },
        valueGetter:(_, act:IActivity)=>{
            const min = act?.minId as IClassministry;
            return min?.title ? min?.title : ''
        },
        renderCell:({row}:GridRenderCellParams)=>(
            <>
            {
                minReader ?
                <Link className="table-link" href={`/dashboard/ministries/${row?.minId?._id}`} >{row?.minId?.title}</Link>
                :
                <span >{row?.minId?.title}</span>
            }
            </>
        )
    },
    {
        field:'frequency',
        headerName:'Frequency',
        width:120,
    },
    
    
    {
        field:'startDate',
        headerName:'Start Date',
        width:120,
        valueFormatter:(_, act:IActivity)=>{
            return new Date(act.startDate).toLocaleDateString();
        },
        valueGetter:(_, act:IActivity)=>{
            return new Date(act.startDate).toLocaleDateString();
        },
        renderCell:({row}:GridRenderCellParams)=>(
            <span>{new Date(row?.startDate)?.toLocaleDateString()}</span>
        )
    },
    {
        field:'endDate',
        headerName:'End Date',
        width:120,
        valueFormatter:(_, act:IActivity)=>{
            return new Date(act.endDate).toLocaleDateString();
        },
        valueGetter:(_, act:IActivity)=>{
            return new Date(act.endDate).toLocaleDateString();
        },
        renderCell:({row}:GridRenderCellParams)=>(
            <span>{new Date(row?.endDate)?.toLocaleDateString()}</span>
        )
    },

    {
            field:'id',
            headerName:'Actions',
            width:80,
            filterable:false,
            disableExport:true,
            renderCell:(params:GridRenderCellParams)=> {
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