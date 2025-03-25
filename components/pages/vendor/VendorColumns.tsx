import { IChurch } from "@/lib/database/models/church.model";
import { IVendor } from "@/lib/database/models/vendor.model";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Image from "next/image";
import Link from "next/link";
import { GoInfo } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";

export const VendorsColumns = (
    handleInfo:(data:IVendor)=>void,
    handleDelete:(data:IVendor)=>void,
    handleNew:(data:IVendor)=>void,
    reader:boolean,
    updater:boolean,
    deleter:boolean,
    showMember:boolean,
    showchurch:boolean,
):GridColDef[] => [
    {
        field:'name',
        headerName:'Vendor',
        width:200,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex flex-row gap-1 items-center">
                    <div className="flex justify-center items-center w-9 h-9 relative overflow-hidden">
                        <Image  fill alt="vendor" src={params?.row?.image}  className="rounded-full object-cover" />
                    </div>
                    {
                        updater ?
                        <span onClick={()=>handleNew(params?.row)}  className="table-link w-fit" >{params?.row?.name}</span>
                        :
                        <span>{params?.row?.name}</span>
                    }
                </div>
            )
        }
    },

    {
        field:'email',
        headerName:'Email',
        width:120,
        renderCell:(param:GridRenderCellParams)=>{
            return(
                <Link className="table-link" href={`mailto:${param.row?.email}`} >{param.row?.email}</Link>
            )
        }
    },
    {
        field:'role',
        headerName:'Type',
        width:120,
    },
    {
        field:'church',
        headerName:'Church',
        width:150,
        valueFormatter:(_, user:IVendor)=>{
            const church = user?.church as IChurch;
            return church?.name;
        },
        valueGetter:(_, user:IVendor)=>{
            const church = user?.church as IChurch;
            return Object.values(church);
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                    {
                       showchurch ? 
                       <Link href={{pathname:'/dashboard/churches', query:{id:params?.row.church._id}}}    className="table-link" >{params?.row?.church.name}</Link>
                       :
                        <span>{params?.row?.church.name}</span>
                    }
                </>
            )
        }
    },
    {
        field:'registrants',
        headerName:'Registrants',
        width:100,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                    {
                        showMember ?
                        <Link href={{pathname:'/dashboard/members', query:{registeredBy:params?.row?._id}}}    className="table-link text-center" >{params?.row?.registrants}</Link>
                        :
                        <span>{params?.row?.registrants}</span>
                    }
                </>
            )
        }
    },

    {
        field:'id',
        headerName:'Actions',
        width:80,
        filterable:false,
        disableExport:true,
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