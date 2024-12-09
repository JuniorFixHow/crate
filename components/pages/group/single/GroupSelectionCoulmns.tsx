import CustomCheck from "@/components/pages/group/new/CustomCheck";
import {  GridRenderCellParams } from "@mui/x-data-grid";
import { IRoom } from "@/lib/database/models/room.model";
import Link from "next/link";

export const GroupSelectionCoulmns =(
    selectedRooms:IRoom[],
    handleSelect:(data:IRoom)=>void,

) => [
    {
        field:'id',
        headerName:'Select',
        width:100,
        renderCell:(params:GridRenderCellParams) =>{
            return(
                <div className="h-full flex-center" >
                    <CustomCheck onClick={()=>handleSelect(params?.row)} checked={selectedRooms.some((item)=>item._id === params?.row?._id)} />
                </div>
            )
        }
    },
    {
        field:'venue',
        headerName:'Venue',
        width:140,
    },
    {
        field:'number',
        headerName:'Room Number',
        width:100,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link className="table-link text-center" href={{pathname:`/dashboard/rooms`, query:{id:params.row?._id}}} >{params?.row?.venue}</Link>
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