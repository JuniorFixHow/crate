import { IVendor } from "@/lib/database/models/vendor.model";
import { GridRenderCellParams } from "@mui/x-data-grid";
import Image from "next/image";
import Link from "next/link";
import { GoInfo } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";

export const VendorsColumns = (
    handleInfo:(data:IVendor)=>void,
    handleDelete:(data:IVendor)=>void,
    handleNew:(data:IVendor)=>void,
) => [
    {
        field:'name',
        headerName:'Vendor',
        width:200,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex flex-row gap-1 items-center justify-center">
                    <div className="flex justify-center items-center w-12 h-9 relative overflow-hidden">
                        <Image  fill alt="vendor" style={{objectFit:'cover', height:'100%', width:'100%'}} src={params?.row?.image}  className="rounded-full object-cover" />
                    </div>
                    <span onClick={()=>handleNew(params?.row)}  className="table-link" >{params?.row?.name}</span>
                </div>
            )
        }
    },

    {
        field:'email',
        headerName:'Email',
        width:120,
    },
    {
        field:'country',
        headerName:'Country',
        width:120,
    },
    {
        field:'church',
        headerName:'Church',
        width:100,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex gap-1 items-center justify-center">
                    <Link href={{pathname:'/dashboard/churches', query:{id:params?.row.church._id}}}    className="table-link" >{params?.row?.church.name}</Link>
                </div>
            )
        }
    },
    {
        field:'registrants',
        headerName:'Registrants',
        width:100,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex gap-1 items-center justify-center">
                    <Link href={{pathname:'/dashboard/members', query:{registeredBy:params?.row?._id}}}    className="table-link text-center" >{params?.row?.registrants}</Link>
                </div>
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
                    <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                </div>
            )
        },
    }
]