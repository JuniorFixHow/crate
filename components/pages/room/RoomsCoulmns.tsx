import { IFacility } from "@/lib/database/models/facility.model";
import { IRoom } from "@/lib/database/models/room.model";
import { IVenue } from "@/lib/database/models/venue.model";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { GoInfo } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";

export const RoomsColumns = (
    handleInfo:(data:IRoom)=>void,
    handleDelete:(data:IRoom)=>void,
    handleNew:(data:IRoom)=>void,
    reader:boolean,
    updater:boolean,
    deleter:boolean,
    facReader:boolean,
):GridColDef[] => [
    {
        field:'venueId',
        headerName:'Room',
        width:200,
        valueFormatter:(_, item:IRoom)=>{
            const venue = item?.venueId as IVenue;
            return venue?.name;
        },
        valueGetter:(_, item:IRoom)=>{
            const venue = item?.venueId as IVenue;
            return Object.values(venue);
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    updater ?
                    <span onClick={()=>handleNew(params?.row)}  className="table-link" >{params?.row?.venueId?.name} {params?.row?.number} </span>
                    :
                    <span>{params?.row?.venueId?.name} {params?.row?.number} </span>
                }
                </>
            )
        }
    },

    {
        field:'facId',
        headerName:'Facility',
        width:200,
        valueFormatter:(_, item:IRoom)=>{
            const fac = item?.facId as IFacility;
            return fac?.name;
        },
        valueGetter:(_, item:IRoom)=>{
            const fac = item?.facId as IFacility;
            return Object.values(fac);
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    facReader ?
                    <Link className="table-link" href={{pathname:'/dashboard/venues/facilities', query:{id:params.row?.facId?._id}}} >{params.row?.facId?.name}</Link>
                    :
                    <span>{params.row?.facId?.name}</span>
                }
                </>
            )
        }
    },
    {
        field:'number',
        headerName:'Room No.',
        width:100,
    },
    {
        field:'roomType',
        headerName:'Room Type',
        width:120,
    },
    {
        field:'bedType',
        headerName:'Bed Type',
        width:120,
    },
    {
        field:'nob',
        headerName:'No. of Beds',
        width:120,
    },
    {
        field:'_id',
        headerName:'Actions',
        width:120,
        filterable:false,
        disableExport:true,
        renderCell:(params:GridRenderCellParams)=>{
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
        }
    },
] 