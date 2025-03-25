import { ISection } from "@/lib/database/models/section.model";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { IoTrashBinOutline } from "react-icons/io5";

export const SinglePublicColumns = (
    handleDelete:(data:ISection)=>void,
    reader:boolean,
    updater:boolean,
    deleter:boolean,
):GridColDef[] => [
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
                <>
                {
                    (reader || updater)?
                    <Link className="table-link" href={`/dashboard/events/public/sections/${params.row?._id}`} >{params.row?.title}</Link>
                    :
                    <span>{params.row?.title}</span>
                }
                </>
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
        filterable:false,
        disableExport:true,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="h-full flex items-center flex-row gap-4">
                    {
                        deleter ?
                        <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                        :
                        <span>None</span>
                    }
                </div>
            )
        }
    },
] 