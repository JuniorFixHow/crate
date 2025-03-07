import {  GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import { IoTrashBinOutline } from "react-icons/io5"
import { GoInfo } from "react-icons/go";
import { IChurch } from "@/lib/database/models/church.model";
import Link from "next/link";
import { IContract } from "@/lib/database/models/contract.model";
import { IZone } from "@/lib/database/models/zone.model";

export const ChurchColumns = (
    handleInfo:(data:IChurch)=>void, 
    // handleNewChurch:(data:IChurch)=>void,
    handleDeleteChurch:(data:IChurch)=>void
):GridColDef[]=> [
    {
        field:'name',
        headerName:'Name',
        width:170,
        renderCell:(params:GridRenderCellParams) => {
            return(
              <div className="flex items-center justify-center">
                <Link href={`/dashboard/churches/${params.row?._id}`}   className='hover:underline text-left dark:underline w-full text-blue-800 cursor-pointer' >{params?.row?.name}</Link>
              </div>
            )  
        },
    },
    {
        field:'location',
        headerName:'Location',
        width:200,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <span>{params.row?.location}</span>
               
            )
        }
        
    },
    {
        field:'email',
        headerName:'Email',
        width:200, 
    },
    
    {
        field:'contractId',
        headerName:"Licence",
        width:100,
        valueFormatter:(_, church:IChurch)=>{
            const contract = church?.contractId as IContract;
            return contract?.title ?? '';
        }, 
        valueGetter:(_, church:IChurch)=>{
            const contract = church?.contractId as IContract;
            return contract ? Object.values(contract) : '';
        }, 
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    params.row?.contractId ?
                    <Link className="table-link" href={{pathname:`/dashboard/churches/contracts/${params.row.contractId._id}`}} >{params.row?.contractId?.title}</Link>
                    :
                    <span>None</span>
                }
                </>
                
            )
        }
    },
    {
        field:'zone',
        headerName:"Zone",
        width:100, 
        valueFormatter:(_, church:IChurch)=>{
            const zone = church?.zoneId as IZone;
            return zone?.name;
        }, 
        valueGetter:(_, church:IChurch)=>{
            const zone = church?.zoneId as IZone;
            return Object.values(zone);
        }, 
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link className="table-link" href={{pathname:'/dashboard/zones', query:{id:params.row.zoneId._id}}} >{params.row.zoneId.name}</Link>
                
            )
        }
    },
   
    {
        field:'registrants',
        headerName:"Registrants",
        width:100,
        
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
                    <GoInfo onClick={()=>handleInfo(params?.row)}  className="cursor-pointer text-green-700" />
                    <IoTrashBinOutline onClick={()=>handleDeleteChurch(params?.row)}  className="cursor-pointer text-red-700" />
                </div>
            )
        },
    }
]