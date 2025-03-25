import { ICYPSet } from "@/lib/database/models/cypset.model";
import { IEvent } from "@/lib/database/models/event.model";
import { Tooltip } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { FaPen } from "react-icons/fa";
import { IoTrashBinOutline } from "react-icons/io5";

export const PublicColumns = (
    handleDelete:(data:ICYPSet)=>void,
    handleEdit:(data:ICYPSet)=>void,
    reader:boolean,
    updater:boolean,
    deleter:boolean,
    eReader:boolean,
):GridColDef[] => [
    {
        field:'createdAt',
        headerName:'Created At',
        width:100,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <span  >{new Date(params?.row?.createdAt).toLocaleDateString()}</span>
            )
        }
    },
    {
        field:'title',
        headerName:'Title',
        width:350,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    (reader || updater) ?
                    <Link className="table-link" href={`/dashboard/events/public/${params.row?._id}`} >{params.row?.title}</Link>
                    :
                    <span>{params.row?.title}</span>
                }
                </>
            )
        }
    },
    {
        field:'sections',
        headerName:'Sections',
        width:100,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    <span  >{params?.row?.sections?.length}</span>
                </div>
            )
        }
    },
    {
        field:'published',
        headerName:'Status',
        width:120,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    <span  >{params?.row?.published ? 'Published':'Unpublished'}</span>
                </div>
            )
        }
    },
    {
        field:'eventId',
        headerName:'Event',
        width:120,
        valueFormatter:(_, set:ICYPSet)=>{
            const event = set.eventId as IEvent;
            return event?.name;
        },
        valueGetter:(_, set:ICYPSet)=>{
            const event = set.eventId as IEvent;
            return event?.name;
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    eReader ?
                    <Link className="table-link" href={`/dashboard/events/${params.row?.eventId?._id}`} >{params.row?.eventId?.name}</Link>
                    :
                    <span >{params.row?.eventId?.name}</span>
                }
                </>
            )
        }
    },
    
    {
        field:'_id',
        headerName:'Actions',
        width:120,
        filterable:false,
        disableExport:true,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    {
                        deleter &&
                        <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                    }
                    {
                        updater &&
                        <Tooltip onClick={()=>handleEdit(params.row)} title='Edit' >
                            <FaPen className="cursor-pointer text-blue-900" />
                        </Tooltip>
                    }
                    {
                        !deleter && !updater &&
                        <span>None</span>
                    }
                </div>
            )
        }
    },
] 