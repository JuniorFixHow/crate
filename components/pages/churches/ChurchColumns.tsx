import {  GridRenderCellParams } from "@mui/x-data-grid"
import { IoTrashBinOutline } from "react-icons/io5"
import { GoInfo } from "react-icons/go";
import { IChurch } from "@/lib/database/models/church.model";

export const ChurchColumns = (
    handleInfo:(data:IChurch)=>void, 
    handleNewChurch:(data:IChurch)=>void,
    handleDeleteChurch:(data:IChurch)=>void
)=> [
    {
        field:'name',
        headerName:'Name',
        width:170,
        renderCell:(params:GridRenderCellParams) => {
            return(
              <div className="flex items-center justify-center">
                <span onClick={()=>handleNewChurch(params?.row)}   className='hover:underline text-left dark:underline w-full text-blue-800 cursor-pointer' >{params?.row?.name}</span>
              </div>
            )  
        },
    },
    {
        field:'country',
        headerName:'Country',
        width:120,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <span>{params.row.zoneId.country}</span>
               
            )
        }
        
    },
    {
        field:'state',
        headerName:'State',
        width:90,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <span>{params.row.zoneId.state}</span>
                
            )
        }
    },
    {
        field:'zone',
        headerName:"Zone",
        width:100, 
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <span>{params.row.zoneId.name}</span>
                
            )
        }
    },
   
    {
        field:'registrants',
        headerName:"Registrants",
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
                    <IoTrashBinOutline onClick={()=>handleDeleteChurch(params?.row)}  className="cursor-pointer text-red-700" />
                </div>
            )
        },
    }
]