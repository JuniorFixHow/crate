import { GridRenderCellParams } from "@mui/x-data-grid"
import CustomCheck from "../../group/new/CustomCheck"
import Link from "next/link"
import { IoTrashBinOutline } from "react-icons/io5"
import { IMember } from "@/lib/database/models/member.model";
import { CgUnavailable } from "react-icons/cg";

export const SingleActivityColumns = (
    members:string[],
    handleCheckClick:(id:string)=>void,
    handleDelete:(data:IMember)=>void,
    readMember:boolean,
    updater:boolean,
)=>[
    {
        field:'_id',
        headerName:'Selection',
        width:80,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex-center h-full">
                {
                    updater?
                    <CustomCheck onClick={()=>handleCheckClick(params?.row?._id)} checked ={members.includes(params.row?._id)} />
                    :
                    <CgUnavailable />
                }
                </div>
            )
        }
    },
    {
        field:'name',
        headerName:'Name',
        width:200,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    readMember ?
                    <Link className="table-link" href={`/dashboard/members/${params.row?._id}`} >{params.row?.name}</Link>
                    :
                    <span>{params.row?.name}</span>
                }
                </>
            )
        }
    },

    {
        field:'gender',
        headerName:'Gender',
        width:100
    },
    {
        field:'ageRange',
        headerName:'Age Group',
        width:120
    },
    {
        field:'marital',
        headerName:'Marital Status',
        width:120
    },
    
    {
        field:'phone',
        headerName:'Phone',
        width:120
    },
    {
                field:'id',
                headerName:'Action',
                width:80,
                renderCell:(params:GridRenderCellParams)=> {
                    return(
                        <div className="flex h-full flex-row items-center gap-4">
                            {
                                updater ?
                                <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                                :
                                <span>None</span>
                            }
                        </div>
                    )
                },
        }
]