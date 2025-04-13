import { IMusichub } from "@/lib/database/models/musichub.model";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { GoInfo } from "react-icons/go";
import CustomCheck from "../../group/new/CustomCheck";

export const EventMusicHubColumns = (
    handleInfo:(data:IMusichub)=>void,
    handleEdit:(data:IMusichub)=>void,
    updater:boolean,
    reader:boolean,
    selection:string[],
    handleSelection:(id:string)=>void
):GridColDef[] =>[
    {
        field:'selection',
        headerName:'Selection',
        filterable:false,
        disableExport:true,
        renderCell:(param:GridRenderCellParams)=>{
            const selected = selection.find((item)=> item===param.row?._id);
            return(
                <div className="flex h-full flex-center">
                    <CustomCheck checked={!!selected} onClick={()=>handleSelection(param.row?._id)} />
                </div>
            )
        }
    },
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
                        !reader &&
                        <span>None</span>
                    }
                </div>
            )
        },
    }
]