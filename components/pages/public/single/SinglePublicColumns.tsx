import { ISection } from "@/lib/database/models/section.model";
import { GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { IoTrashBinOutline } from "react-icons/io5";

export const SinglePublicColumns = (
    handleDelete:(data:ISection)=>void,
) => [
    {
        field:'number',
        headerName:'Section No.',
        width:100,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    <span  >{params?.row?.number}</span>
                </div>
            )
        }
    },
    {
        field:'title',
        headerName:'Title',
        width:250,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link className="table-link" href={`/dashboard/events/public/sections/${params.row?._id}`} >{params.row?.title}</Link>
            )
        }
    },
    {
        field:'questions',
        headerName:'Questions',
        width:100,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    <span  >{params?.row?.questions?.length}</span>
                </div>
            )
        }
    },
    
    
    {
        field:'_id',
        headerName:'Action',
        width:120,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="h-full flex items-center flex-row gap-4">
                    <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                </div>
            )
        }
    },
] 