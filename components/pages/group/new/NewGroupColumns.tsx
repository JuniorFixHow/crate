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

                <CustomCheck onClick={()=>handleCheckClick(params?.row?.id)} checked ={members.includes(params.row?.id)} />
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
                <Link href={`/dashboard/members/${params?.row?.id}`} className="table-link text-center" >{params?.row?.name}</Link>
            )
        }
    },
    {
        field:'country',
        headerName:'Country',
        width:100,
    },
    {
        field:'church',
        headerName:'Church',
        width:140,
    },
    {
        field:'email',
        headerName:'Email',
        width:140,
    },
    {
        field:'status',
        headerName:'Status',
        width:80,
    },
]