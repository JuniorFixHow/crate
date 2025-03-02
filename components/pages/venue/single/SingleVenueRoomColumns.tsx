import { IRoom } from "@/lib/database/models/room.model"
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import { GoInfo } from "react-icons/go"
import { IoTrashBinOutline } from "react-icons/io5"
import CustomCheck from "../../group/new/CustomCheck"
import { IVenue } from "@/lib/database/models/venue.model"
// import { IEvent } from "@/lib/database/models/event.model"

export const SingleVenueRoomsColumns = (
    handleNew:(data:IRoom)=>void,
    handleInfo:(data:IRoom)=>void,
    handleDelete:(data:IRoom)=>void,
    selection:IRoom[],
    hnadleSelection:(data:IRoom)=>void
):GridColDef[] => [
    {
        field:'venueId',
        headerName:'Venue',
        width:200,
        valueFormatter:(_, value:IRoom)=>{
            const venue = value?.venueId as IVenue;
            return  venue?.name
        },
        valueGetter:(_, value:IRoom)=>{
            const venue = value?.venueId as IVenue;
            return Object.values(venue)
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    <CustomCheck onClick={()=>hnadleSelection(params.row)} checked={selection.flatMap((item)=>item?._id).includes(params.row?._id)} />
                    <span onClick={()=>handleNew(params?.row)}  className="table-link" >{params?.row?.floor} - {params?.row?.number} </span>
                </div>
            )
        }
    },
    
    
    {
        field:'roomType',
        headerName:'Room Type',
        width:120,
    },
    {
        field:'bedType',
        headerName:'Bed Type',
        width:120,
    },
    {
        field:'nob',
        headerName:'No. of Beds',
        width:120,
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
                    <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                    <GoInfo onClick={()=>handleInfo(params?.row)}  className="cursor-pointer text-green-700" />
                </div>
            )
        }
    },
]