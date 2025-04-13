import { IMusichub } from "@/lib/database/models/musichub.model";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { GoInfo } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";

export const MusicHubColumns = (
    handleInfo:(data:IMusichub)=>void,
    handleEdit:(data:IMusichub)=>void,
    handleDelete:(data:IMusichub)=>void,
    updater:boolean,
    reader:boolean,
    deleter:boolean
):GridColDef[] =>[
    {
        field:'title',
        headerName:'Name',
        width:180,
        renderCell:({row}:GridRenderCellParams)=>(
            <>
            {
                updater ?
                <span onClick={()=>handleEdit(row)}  className="table-link" >{row?.title}</span>
                :
                <span >{row?.title}</span>
            }
            </>
        )
    },
    {
        field:'nature',
        headerName:'Nature',
        width:100
    },
    {
        field:'type',
        headerName:'Type',
        width:180
    },
    {
        field:'appearance',
        headerName:'Appearance',
        width:100
    },
    {
        field:'affiliation',
        headerName:'Affiliation',
        width:100
    },
    {
        field:'contact',
        headerName:'Contact',
        width:100
    },
    {
        field:'email',
        headerName:'Email',
        width:100
    },
    {
        field:'id',
        headerName:'Actions',
        width:80,
        filterable:false,
        disableExport:true,
        // params:GridRenderCellParams
        renderCell:(params:GridRenderCellParams)=> {
            // console.log(params.row?.id)
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    {
                        reader &&
                        <GoInfo onClick={()=>handleInfo(params?.row)}  className="cursor-pointer text-green-700" />
                    }
                    {
                        deleter &&
                        <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                    }
                    {
                        !reader && !deleter &&
                        <span>None</span>
                    }
                </div>
            )
        },
    }
]