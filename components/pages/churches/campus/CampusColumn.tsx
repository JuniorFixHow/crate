import { ICampuse } from "@/lib/database/models/campuse.model";
import { GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { GoInfo } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";

export const CampusColumn = (
    handleInfo:(data:ICampuse)=>void, 
    handleNewCampus:(data:ICampuse)=>void,
    handleDeleteCampus:(data:ICampuse)=>void
) =>[
    {
        field:'name',
        headerName:'Name',
        width:200,
        renderCell:(param:GridRenderCellParams)=>{
            return(
                <span onClick={()=>handleNewCampus(param.row)}  className="table-link" >{param.row?.name}</span>
            )
        }
    },
    {
        field:'type',
        headerName:'Type',
        width:100,
    },
    {
        field:'churchId',
        headerName:'Church',
        width:200,
        renderCell:(param:GridRenderCellParams)=>{
            return(
                <Link href={{pathname:'/dashboard/churches', query:{id:param.row?.churchId?._id}}}  className="table-link" >{param.row?.churchId?.name}</Link>
            )
        }
    },
    {
        field:'members',
        headerName:'Members',
        width:100,
        renderCell:(param:GridRenderCellParams)=>{
            return(
                <>
                {
                    param?.row.members?.length ?
                    <Link href={{pathname:'/dashboard/members', query:{campuseId:param.row?._id}}}  className="table-link" >{param.row?.members?.length}</Link>
                    :
                    <span>0</span>
                }
                </>
            )
        }
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
                    <IoTrashBinOutline onClick={()=>handleDeleteCampus(params?.row)}  className="cursor-pointer text-red-700" />
                </div>
            )
        },
    }
]