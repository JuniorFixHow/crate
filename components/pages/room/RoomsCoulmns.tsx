import { IRoom } from "@/lib/database/models/room.model";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { GoInfo } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";

export const RoomsColumns = (
    handleInfo:(data:IRoom)=>void,
    handleDelete:(data:IRoom)=>void,
    handleNew:(data:IRoom)=>void,
) => [
    {
        field:'venue',
        headerName:'Venue',
        width:140,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    <span onClick={()=>handleNew(params?.row)}  className="table-link" >{params?.row?.venue}</span>
                </div>
            )
        }
    },
    {
        field:'floor',
        headerName:'Floor',
        width:100,
    },
    {
        field:'number',
        headerName:'Room No.',
        width:100,
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
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    <GoInfo onClick={()=>handleInfo(params?.row)}  className="cursor-pointer text-green-700" />
                    <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                </div>
            )
        }
    },
] 