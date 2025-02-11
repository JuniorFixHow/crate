import { IMinistryrole } from "@/lib/database/models/ministryrole.model";
import { GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
// import { GoInfo } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";

export const MinistryroleColumns = (
    // handleInfo:(data:IMinistryrole)=>void,
    handleEdit:(data:IMinistryrole)=>void,
    handleDelete:(data:IMinistryrole)=>void,
)=>[
    {
        field:'title',
        headerName:'Title',
        width:200,
        renderCell:(param:GridRenderCellParams)=>(
            <span className="table-link" onClick={()=>handleEdit(param.row)} >{param.row?.title}</span>
        )
    },

    {
        field:'memberId',
        headerName:'Member',
        width:200,
        renderCell:(param:GridRenderCellParams)=>(
            <Link className="table-link" href={`/dashboard/members/${param.row?.memberId?._id}`} >{param.row?.memberId?.name}</Link>
        )
    },
    {
        field:'phone',
        headerName:'Phone',
        width:150,
        renderCell:(param:GridRenderCellParams)=>(
            <span>{param.row?.memberId?.phone}</span>
        )
    },
    {
        field:'email',
        headerName:'Email',
        width:150,
        renderCell:(param:GridRenderCellParams)=>(
            <Link className="table-link" target='_blank' href={`mailto:${param.row?.memberId?.email}`} >{param.row?.memberId?.email}</Link>
        )
    },

     {
            field:'id',
            headerName:'Actions',
            width:80,
            renderCell:(params:GridRenderCellParams)=> {
                return(
                    <div className="flex h-full flex-row items-center gap-4">
                        {/* <GoInfo onClick={()=>handleInfo(params?.row)}  className="cursor-pointer text-green-700" /> */}
                        <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                    </div>
                )
            },
        }
]