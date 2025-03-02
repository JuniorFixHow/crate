import { IVenue } from "@/lib/database/models/venue.model"
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import Link from "next/link"
import { GoInfo } from "react-icons/go"
import { IoTrashBinOutline } from "react-icons/io5"
import { totalRoomsForVenue } from "./fxn"

export const VenueColumns = (
    handleInfo:(data:IVenue)=>void, 
    handleDelete:(data:IVenue)=>void
):GridColDef[] =>[
    {
        field:'name',
        headerName:'Name',
        width:200,
        renderCell:(param:GridRenderCellParams)=>{
            return(
                <Link href={`/dashboard/venues/${param?.row?._id}`}  className="table-link" >{param.row?.name}</Link>
            )
        }
    },
    {
        field:'location',
        headerName:'Location',
        width:150,
    },
    
    {
        field:'type',
        headerName:'Type',
        width:120,
    },
    {
        field:'facilities',
        headerName:'Facilities',
        width:200,
        valueFormatter:(_, value)=>{
            return totalRoomsForVenue(value?.facilities)
        },
        valueGetter:(_, value)=>{
            return totalRoomsForVenue(value?.facilities)
        },
        renderCell:(param:GridRenderCellParams)=>{
            return(
                <Link href={{pathname:`/dashboard/venues/facilities`, query:{venueId:param?.row?._id}}}  className="table-link" >{param.row?.facilities?.length}</Link>
            )
        }
    },
    {
        field:'rooms',
        headerName:'Rooms',
        width:200,
        valueFormatter:(_, value)=>{
            return totalRoomsForVenue(value?.facilities)
        },
        valueGetter:(_, value)=>{
            return totalRoomsForVenue(value?.facilities)
        },
        renderCell:(param:GridRenderCellParams)=>{
            return(
                <span>{totalRoomsForVenue(param.row?.facilities)}</span>
            )
        }
    },
    {
        field:'id',
        headerName:'Actions',
        width:80,
        // params:GridRenderCellParams
        renderCell:(params:GridRenderCellParams)=> {
            // console.log(params.row?.id)
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    <GoInfo onClick={()=>handleInfo(params?.row)}  className="cursor-pointer text-green-700" />
                    <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                </div>
            )
        },
    }
]