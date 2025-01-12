import { formatTimestamp } from "@/functions/dates";
import { IRegistration } from "@/lib/database/models/registration.model";
import { GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { GoInfo } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";

export const ArrivalColumns = (
    handleInfo:(data:IRegistration)=>void,
    handleDelete:(data:IRegistration)=>void,
)=>[
    {
        field:'memberId',
        headerName:'Member',
        width:200,
        renderCell:(param:GridRenderCellParams)=>{
            const member = param.row?.memberId;
            return(
                <Link className="table-link" href={{pathname:`/dashboard/events/badges`, query:{regId:param.row?._id}}} >{member?.name}</Link>
            )
        }
    },
    {
        field:'checkedIn',
        headerName:'Arrived On',
        width:200,
        renderCell:(param:GridRenderCellParams)=>{
            return(
                <div className="flex-center">
                    <span>{formatTimestamp(param.row?.checkedIn?.date)}</span>
                </div>
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