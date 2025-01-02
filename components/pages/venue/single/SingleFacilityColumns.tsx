import { IFacility } from "@/lib/database/models/facility.model"
import { GridRenderCellParams } from "@mui/x-data-grid"
import { IoTrashBinOutline } from "react-icons/io5"

export const SingleFacilityColumns = (
    handleEdit:(data:IFacility)=>void, 
    handleDelete:(data:IFacility)=>void
) =>[
    {
        field:'name',
        headerName:'Name',
        width:200,
        renderCell:(param:GridRenderCellParams)=>{
            return(
                <span onClick={()=>handleEdit(param.row)}  className="table-link" >{param.row?.name}</span>
            )
        }
    },
    {
        field:'rooms',
        headerName:'Rooms',
        width:150,
    },
    
    {
        field:'floor',
        headerName:'Floors',
        width:200,
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
                    {/* <GoInfo onClick={()=>handleInfo(params?.row)}  className="cursor-pointer text-green-700" /> */}
                    <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                </div>
            )
        },
    }
]