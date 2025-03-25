import { IService } from "@/lib/database/models/service.model";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { GoInfo } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";

export const ServiceColumns = (
    handleInfo:(data:IService)=>void, 
    handleNewCampus:(data:IService)=>void,
    handleDeleteCampus:(data:IService)=>void,
    reader:boolean,
    updater:boolean,
    deleter:boolean,
):GridColDef[] =>[
    {
        field:'name',
        headerName:'Name',
        width:200,
        renderCell:(param:GridRenderCellParams)=>{
            return(
                <>
                {
                    (reader || updater) ?
                    <span onClick={()=>handleNewCampus(param.row)}  className="table-link" >{param.row?.name}</span>
                    :
                    <span>{param.row?.name}</span>
                }
                </>
            )
        }
    },
    {
        field:'cost',
        headerName:'Cost ($)',
        width:120,
    },
    
    {
        field:'description',
        headerName:'Description',
        width:200,
        
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
                        <IoTrashBinOutline onClick={()=>handleDeleteCampus(params?.row)}  className="cursor-pointer text-red-700" />
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