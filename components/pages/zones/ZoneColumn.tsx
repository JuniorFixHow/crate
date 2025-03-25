import { IZone } from "@/lib/database/models/zone.model"
import {  GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import { GoInfo } from "react-icons/go"
import { IoTrashBinOutline } from "react-icons/io5"

export const ZoneColumns =(
    onZoneClick:(data:IZone)=>void, 
    onDelete:(data:IZone)=>void,
    handleInfo:(data:IZone)=>void,
    reader:boolean,
    updater:boolean,
    deleter:boolean,
):GridColDef[]=> [
    {
        field:'name',
        headerName:'Name',
        width:170,
        renderCell:(params:GridRenderCellParams) => {
            return(
              <>
              {
                updater ?
                <span onClick={()=>onZoneClick(params.row)}  className='hover:underline text-left w-full text-blue-800 cursor-pointer' >{params?.row?.name}</span>
                :
                <span>{params?.row?.name}</span>
              }
              </>
            )  
        },
    },
    {
        field:'country',
        headerName:'Location',
        width:200,
        
    },
    
   
    {
        field:'registrants',
        headerName:"Registrants",
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
                        <IoTrashBinOutline onClick={()=>onDelete(params?.row)} className="cursor-pointer text-red-700" />
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