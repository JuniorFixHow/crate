import CustomCheck from "@/components/pages/group/new/CustomCheck";
import {  GridRenderCellParams } from "@mui/x-data-grid";
import CustomRadio from "./CustomRadio";
import { IRoom } from "@/lib/database/models/room.model";

export const SingleAssignmentCoulmns =(
    roomIds:string[],
    handleSelect:(id:string)=>void,
    currendRoom:IRoom,
    handleRadio:(data:IRoom)=>void,
    type:string
) => [
    {
        field:'id',
        headerName:'Assign',
        width:100,
        renderCell:(params:GridRenderCellParams) =>{
            return(
                <div className="h-full flex-center" >
                {
                    type === 'Member' ?
                    <CustomRadio onClick={()=>handleRadio(params?.row)} checked={currendRoom?._id === params?.row?._id} />
                    :
                    <CustomCheck onClick={()=>handleSelect(params?.row?._id)} checked={roomIds.includes(params?.row?._id)} />
                }
                </div>
            )
        }
    },
    {
        field:'venue',
        headerName:'Venue',
        width:140,
        renderCell:({row}:GridRenderCellParams)=>(
            <span>{row?.venueId?.name}</span>
        )
    },
    {
        field:'facId',
        headerName:'Facility',
        width:140,
        renderCell:({row}:GridRenderCellParams)=>(
            <span>{row?.facId?.name}</span>
        )
    },
    {
        field:'number',
        headerName:'Room Number',
        width:100,
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
    
]