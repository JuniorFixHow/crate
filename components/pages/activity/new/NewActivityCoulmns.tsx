import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import CustomCheck from "../../group/new/CustomCheck";
import Link from "next/link";
import { CgUnavailable } from "react-icons/cg";

export const NewActivityColumns = (
    members:string[],
    handleCheckClick:(id:string)=>void,
    showMember:boolean,
    updater:boolean,
    creator:boolean
):GridColDef[] =>[
    {
        field:'_id',
        headerName:'Selection',
        width:80,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex-center h-full">
                {
                    (updater || creator) ?
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
                    showMember ?
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
        field:'employ',
        headerName:'Employ. Status',
        width:120
    },
    {
        field:'phone',
        headerName:'Phone',
        width:120
    },
]