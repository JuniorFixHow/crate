import { ICard } from "@/lib/database/models/card.model";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { GoInfo } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";

export const CardColumns = (
    handleInfo:(data:ICard)=>void,
    handleDelete:(data:ICard)=>void,
)=>[
    {
        field:'name',
        headerName:'Title',
        width:180,
        // renderCell:(param:GridRenderCellParams)=>{
        //     return
        // }
    },

    {
        field:'type',
        headerName:'Type',
        width:100
    },
    {
        field:'createdAt',
        headerName:'Issued on',
        width:100,
         renderCell:(param:GridRenderCellParams)=>{
            return(
                <span>{new Date(param.row?.createdAt)?.toLocaleDateString()}</span>
            )
        }
    },
    {
        field:'expDate',
        headerName:'Expiry',
        width:100,
         renderCell:(param:GridRenderCellParams)=>{
            return(
                <span>{new Date(param.row?.expDate)?.toLocaleDateString()}</span>
            )
        }
    },

    {
                field:'id',
                headerName:'Actions',
                width:80,
                renderCell:(params:GridRenderCellParams)=> {
                    return(
                        <div className="flex h-full flex-row items-center gap-4">
                            <GoInfo onClick={()=>handleInfo(params?.row)}  className="cursor-pointer text-green-700" />
                            <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                        </div>
                    )
                },
        }
]