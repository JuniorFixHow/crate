import { ZoneProps } from "@/types/Types"
import {  GridRenderCellParams } from "@mui/x-data-grid"
import { GoInfo } from "react-icons/go"
import { IoTrashBinOutline } from "react-icons/io5"

export const ZoneColumns =(
    onZoneClick:(data:ZoneProps)=>void, 
    onDelete:(data:ZoneProps)=>void,
    handleInfo:(data:ZoneProps)=>void
)=> [
    {
        field:'name',
        headerName:'Name',
        width:170,
        renderCell:(params:GridRenderCellParams) => {
            return(
              <div className="flex items-center justify-center">
                <span onClick={()=>onZoneClick(params.row)}  className='hover:underline text-left w-full text-blue-800 cursor-pointer' >{params?.row?.name}</span>
              </div>
            )  
        },
    },
    {
        field:'country',
        headerName:'Country',
        width:120,
        
    },
    {
        field:'state',
        headerName:'State',
        width:90
    },
   
    {
        field:'registrants',
        headerName:"Registrants",
        width:100,
        
    },
    {
        field:'groups',
        headerName:"Groups",
        width:100, 
    },
    {
        field:'churches',
        headerName:"Churches",
        width:100, 
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
                    <IoTrashBinOutline onClick={()=>onDelete(params?.row)} className="cursor-pointer text-red-700" />
                </div>
            )
        },
    }
]