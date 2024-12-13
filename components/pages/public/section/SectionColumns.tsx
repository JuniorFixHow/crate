import { ISection } from "@/lib/database/models/section.model";
import { GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { IoTrashBinOutline } from "react-icons/io5";

export const SectionColumns = (
    handleDelete:(data:ISection)=>void,
) => [
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
        field:'cypsetId',
        headerName:'Set',
        width:300,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link className="table-link" href={`/dashboard/events/public/${params.row?.cypsetId?._id}`} >{params.row?.cypsetId?.title}</Link>
            )
        }
    },
    
    {
        field:'_id',
        headerName:'Action',
        width:120,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex-center h-full flex-row gap-4">
                    <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                </div>
            )
        }
    },
] 