import { IClassministry } from "@/lib/database/models/classministry.model";
import { GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { GoInfo } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";

export const ClassMinistryColumns = (
    handleDelete:(data:IClassministry)=>void,
    handleEdit:(data:IClassministry)=>void,
) =>[
    {
        field:'createdAt',
        headerName:'Created At',
        width:120,
        renderCell:({row}:GridRenderCellParams)=>(
            <span>{new Date(row?.createdAt)?.toLocaleDateString()}</span>
        )
    },
    {
        field:'title',
        headerName:'Title',
        width:200,
        renderCell:(param:GridRenderCellParams)=>(
            <Link className="table-link" href={`/dashboard/ministries/${param.row?._id}`} >{param.row?.title}</Link>
        )
    },

    {
        field:'id',
        headerName:'Actions',
        width:80,
        renderCell:(params:GridRenderCellParams)=> {
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    <GoInfo onClick={()=>handleEdit(params?.row)}  className="cursor-pointer text-green-700" />
                    <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                </div>
            )
        },
    }
]