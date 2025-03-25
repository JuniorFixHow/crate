import CustomCheck from "@/components/pages/group/new/CustomCheck";
import {  GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { IRoom } from "@/lib/database/models/room.model";
import Link from "next/link";
import { IVenue } from "@/lib/database/models/venue.model";

export const GroupSelectionCoulmns =(
    selectedRooms:IRoom[],
    handleSelect:(data:IRoom)=>void,
    venueReader:boolean,
    roomReader:boolean,
):GridColDef[] => [
    {
        field:'id',
        headerName:'Select',
        width:100,
        filterable:false,
        disableExport:true,
        renderCell:(params:GridRenderCellParams) =>{
            return(
                <div className="h-full flex-center" >
                    <CustomCheck onClick={()=>handleSelect(params?.row)} checked={selectedRooms.some((item)=>item._id === params?.row?._id)} />
                </div>
            )
        }
    },
    {
        field:'venueId',
        headerName:'Venue',
        valueFormatter:(_, room:IRoom)=>{
            const venue = room?.venueId as IVenue;
            return venue?.name;
        },
        valueGetter:(_, room:IRoom)=>{
            const venue = room?.venueId as IVenue;
            return Object.values(venue);
        },
        width:140,
        renderCell:({row}:GridRenderCellParams)=>(
            <>
            {
                venueReader ?
                <Link href={`/dashboard/venues/${row?.venueId?._id}`}  className="table-link" >{row?.venueId?.name}</Link>
                :
                <span>{row?.venueId?.name}</span>
            }
            </>
        )
        
    },
    {
        field:'number',
        headerName:'Room Number',
        width:100,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    roomReader ?
                    <Link className="table-link" href={{pathname:`/dashboard/rooms`, query:{id:params.row?._id}}} >{params?.row?.number}</Link>
                    :
                    <span>{params?.row?.number}</span>
                }
                </>
            )
        }
    },
    {
        field:'roomType',
        headerName:'Room Type',
        width:100,
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
    
]