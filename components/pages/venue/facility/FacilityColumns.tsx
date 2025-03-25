import { IFacility } from "@/lib/database/models/facility.model"
import { IVenue } from "@/lib/database/models/venue.model"
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import Link from "next/link"
import { GoInfo } from "react-icons/go"
import { IoTrashBinOutline } from "react-icons/io5"

export const FacilityColumns = (
    handleInfo:(data:IFacility)=>void, 
    handleEdit:(data:IFacility)=>void, 
    handleDelete:(data:IFacility)=>void,
    reader:boolean,
    updater:boolean,
    deleter:boolean,
    venueReader:boolean,
):GridColDef[] =>[
    {
        field:'name',
        headerName:'Name',
        width:200,
        renderCell:(param:GridRenderCellParams)=>{
            return(
                <>
                {
                    updater ?
                    <span onClick={()=>handleEdit(param.row)}  className="table-link" >{param.row?.name}</span>
                    :
                    <span>{param.row?.name}</span>
                }
                </>
            )
        }
    },
    {
        field:'rooms',
        headerName:'Rooms',
        width:150,
    },
    
    {
        field:'floor',
        headerName:'Floor',
        width:200,
    },
    
    {
        field:'venueId',
        headerName:'Venue',
        width:200,
        valueFormatter:(_, item:IFacility)=>{
            const venue = item?.venueId as IVenue;
            return venue?.name;
        },
        valueGetter:(_, item:IFacility)=>{
            const venue = item?.venueId as IVenue;
            return Object.values(venue);
        },
        renderCell:(param:GridRenderCellParams)=>{
            return(
                <>
                {
                    venueReader ? 
                    <Link href={`/dashboard/venues/${param.row?.venueId?._id}`}  className="table-link" >{param.row?.venueId?.name}</Link>
                    :
                    <span>{param.row?.venueId?.name}</span>
                }
                </>
            )
        }
    },
    
    {
        field:'id',
        headerName:'Actions',
        width:80,
        filterable:false,
        disableExport:true,
        // params:GridRenderCellParams
        renderCell:(params:GridRenderCellParams)=> {
            // console.log(params.row?.id)
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