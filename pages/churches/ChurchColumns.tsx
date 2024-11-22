import {  GridRenderCellParams } from "@mui/x-data-grid"
import { IoTrashBinOutline } from "react-icons/io5"
import { GoInfo } from "react-icons/go";
import { ChurchProps } from "@/types/Types";

export const ChurchColumns = (
    handleInfo:(data:ChurchProps)=>void, 
    handleNewChurch:(data:ChurchProps)=>void,
    handleDeleteChurch:(data:ChurchProps)=>void
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
        
    },
    {
        field:'state',
        headerName:'State',
        width:90
    },
    {
        field:'zone',
        headerName:"Zone",
        width:100, 
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