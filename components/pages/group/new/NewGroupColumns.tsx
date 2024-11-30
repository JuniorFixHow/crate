import { GridRenderCellParams } from "@mui/x-data-grid";
import CustomCheck from "./CustomCheck";
import Link from "next/link";

export const NewGroupColumns = (
    members:string[],
    handleCheckClick:(id:string)=>void
)=>[
    {
        field:'id',
        headerName:'Selection',
        width:80,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex-center h-full">

                <CustomCheck onClick={()=>handleCheckClick(params?.row?.memberId._id)} checked ={members.includes(params.row?.memberId._id)} />
                </div>
            )
        }
    },
    {
        field:'name',
        headerName:'Member',
        width:140,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link href={`/dashboard/members/${params?.row?.memberId._id}`} className="table-link text-center" >{params?.row?.memberId.name}</Link>
            )
        }
    },
    {
        field:'country',
        headerName:'Country',
        width:100,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <span   >{params?.row?.memberId?.church?.zoneId?.country}</span>
            )
        }
    },
    {
        field:'church',
        headerName:'Church',
        width:140,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link href={{pathname:'/dashboard/churches', query:{id:params?.row?.memberId?.church?._id}}}  className="table-link" >{params?.row?.memberId?.church?.name}</Link>
            )
        }
    },
    {
        field:'email',
        headerName:'Email',
        width:140,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <span className="" >{params?.row?.memberId?.email}</span>
            )
        }
    },
    {
        field:'status',
        headerName:'Status',
        width:120,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <span className="" >{params?.row?.memberId?.status}</span>
            )
        }
    },
]