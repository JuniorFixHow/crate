import { IActivity } from "@/lib/database/models/activity.model";
import { GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { GoInfo } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";

export const ActivityColumns = (
    handleDelete:(data:IActivity)=>void,
    handleInfo:(data:IActivity)=>void,
)=>[
    {
        field:'name',
        headerName:'Name',
        width:200,
        renderCell:(param:GridRenderCellParams)=>{
            return(
                <Link className="table-link" href={`/dashboard/activities/${param.row?._id}`} >{param.row?.name}</Link>
            )
        }
    },
    {
        field:'minId',
        headerName:'Ministry',
        width:120,
        renderCell:({row}:GridRenderCellParams)=>(
            <Link className="table-link" href={`/dashboard/ministries/${row?.minId?._id}`} >{row?.minId?.title}</Link>
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
        renderCell:({row}:GridRenderCellParams)=>(
            <span>{new Date(row?.startDate)?.toLocaleDateString()}</span>
        )
    },
    {
        field:'endDate',
        headerName:'End Date',
        width:120,
        renderCell:({row}:GridRenderCellParams)=>(
            <span>{new Date(row?.endDate)?.toLocaleDateString()}</span>
        )
    },

    {
            field:'id',
            headerName:'Actions',
            width:80,
            renderCell:(params:GridRenderCellParams)=> {
                return(
                    <div className="flex h-full flex-row items-center gap-4">
                        <GoInfo onClick={()=>handleInfo(params?.row)}  className="cursor-pointer text-green-700" />
                        <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                    </div>
                )
            },
    }
]