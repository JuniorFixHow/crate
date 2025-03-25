import { ICYPSet } from "@/lib/database/models/cypset.model";
import { ISection } from "@/lib/database/models/section.model";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { IoTrashBinOutline } from "react-icons/io5";

export const SectionColumns = (
    handleDelete:(data:ISection)=>void,
    reader:boolean,
    updater:boolean,
    deleter:boolean,
    sReader:boolean,
):GridColDef[] => [
    {
        field:'title',
        headerName:'Title',
        width:250,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    (reader || updater) ?
                    <Link className="table-link" href={`/dashboard/events/public/sections/${params.row?._id}`} >{params.row?.title}</Link>
                    :
                    <span >{params.row?.title}</span>
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
        field:'cypsetId',
        headerName:'Set',
        width:300,
        valueFormatter:(_, section:ISection)=>{
            const set = section?.cypsetId as ICYPSet;
            return set?.title;
        },
        valueGetter:(_, section:ISection)=>{
            const set = section?.cypsetId as ICYPSet;
            return set?.title;
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    sReader ?
                    <Link className="table-link" href={`/dashboard/events/public/${params.row?.cypsetId?._id}`} >{params.row?.cypsetId?.title}</Link>
                    :
                    <span >{params.row?.cypsetId?.title}</span>
                }
                </>
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
                <div className="flex-center h-full flex-row gap-4">
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