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
        field:'type',
        headerName:'Program',
        width:120,
    },
    {
        field:'frequency',
        headerName:'Frequency',
        width:120,
    },
    {
        field:'leaders',
        headerName:'Leaders',
        width:80,
        renderCell:(param:GridRenderCellParams)=>{
            return(
                <div className="flex-center">
                    <span>{param.row?.leaders?.length}</span>
                </div>
            )
        }
    },
    {
        field:'members',
        headerName:'Members',
        width:80,
        renderCell:(param:GridRenderCellParams)=>{
            return(
                <div className="flex-center">
                    <span>{param.row?.members?.length}</span>
                </div>
            )
        }
    },
    {
        field:'startDate',
        headerName:'Start Date',
        width:120,
    },
    {
        field:'endDate',
        headerName:'End Date',
        width:120,
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