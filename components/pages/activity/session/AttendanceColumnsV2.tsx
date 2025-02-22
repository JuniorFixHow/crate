import { GridRenderCellParams } from "@mui/x-data-grid"
import Link from "next/link"
import { IoTrashBinOutline } from "react-icons/io5"
import { getJustTime } from "../../session/fxn"
import { ICAttendance } from "@/lib/database/models/classattendance.model"

export const AttendanceColumnsV2 = (
    handleDelete:(data:ICAttendance)=>void
)=> [
    {
        field:'member',
        headerName:'Member',
        width:170,
        renderCell:(params:GridRenderCellParams) => {
            return(
              <div className="flex items-center justify-center">
                <Link href={params?.row?.member?._id}  className='table-link' >{params?.row?.member?.name}</Link>
              </div>
            )  
        },
    },
    {
        field:'createdAt',
        headerName:'Time',
        width:120,
        renderCell:(params:GridRenderCellParams) => {
            return(
                <span className='' >{getJustTime(params?.row?.createdAt)}</span>
            )  
        },
    },
    {
        field:'late',
        headerName:'Late',
        width:90
    },
   
    {
        field:'sessionId',
        headerName:"Session",
        width:150,
        renderCell:(params:GridRenderCellParams) => {
            return(
              <div className="flex items-center justify-center">
                <Link href={{pathname:`/dashboard/ministries/sessions/${params.row?.sessionId?._id}`, }} className='table-link' >{params?.row?.sessionId?.name}</Link>
              </div>
            )  
        },
    },
    
    
    {
        field:'_id',
        headerName:'Actions',
        width:80,
        // params:GridRenderCellParams
        renderCell:(params:GridRenderCellParams)=> {
            // console.log(params.row?.id)
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                </div>
            )
        },
    }
]