import { isEligible } from "@/functions/misc";
import { IMember } from "@/lib/database/models/member.model";
import { IRegistration } from "@/lib/database/models/registration.model";
import {  GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { RiDeleteBin6Line } from "react-icons/ri";

export const SingleGroupColumns =(
    handleDelete:(data:IMember)=>void
):GridColDef[] =>[
    {
        field:'memberId',
        headerName:'Member',
        width:140,
        valueFormatter:(_, reg:IRegistration)=>{
            const member = reg.memberId as IMember;
            return member?.name;
        },
        valueGetter:(_, reg:IRegistration)=>{
            const member = reg.memberId as IMember;
            return Object.values(member);
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link className="table-link text-center" href={{pathname:`/dashboard/events/badges`, query:{regId:params.row?._id}}} >{params?.row?.memberId.name}</Link>
            )
        }
    },

    {
        field:'status',
        headerName:'Checked-in',
        width:100,
        valueFormatter:(_, reg:IRegistration)=>{
            const rooms = reg.roomIds;
            return rooms && rooms?.length > 0 ? 'Yes':'No'
        },
        valueGetter:(_, reg:IRegistration)=>{
            const rooms = reg.roomIds;
            return rooms && rooms?.length > 0 ? 'Yes':'No'
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <span>{params?.row?.roomIds?.length  === 0 ? 'No':'Yes'}</span>
            )
        }
    },
    {
        field:'badgeIssued',
        headerName:'Badge Issued',
        width:100,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex-center h-full">
                    <span>{params?.row?.badgeIssued}</span>
                </div>
            )
        }
    },
    {
        field:'mefra',
        headerName:'MEFRA',
        width:100,
        valueFormatter:(_, reg:IRegistration)=>{
            const member = reg.memberId as IMember;
            return isEligible(member?.ageRange) ? 'Yes' : 'No';
        },
        valueGetter:(_, reg:IRegistration)=>{
            const member = reg.memberId as IMember;
            return isEligible(member?.ageRange) ? 'Yes' : 'No';
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex-center h-full">
                    <span>{isEligible(params.row?.memberId?.ageRange) ? 'Yes':'No'}</span>
                </div>
            )
        }
    },

    {
        field:'id',
        headerName:'Action',
        width:80,
        filterable:false,
        disableExport:true,
        // params:GridRenderCellParams
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex-center h-full">
                    <RiDeleteBin6Line onClick={()=>handleDelete(params?.row.memberId)}  className="cursor-pointer" />
                </div>
            )
        }
    },
] 