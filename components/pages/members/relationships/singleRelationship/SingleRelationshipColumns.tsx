import { IMember } from "@/lib/database/models/member.model";
import { IRelationship } from "@/lib/database/models/relationship.model";
import { Tooltip } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { GoInfo } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";
import { ConvertibleRelationship, getOtherUserFirst, getRelationValue } from "../fxn";

export const SingleRelationshipColumns = (
    handleEdit:(data:IRelationship)=>void,
    handleInfo:(data:IRelationship)=>void,
    handleDelete:(data:IRelationship)=>void,
    member:IMember
):GridColDef[]=>[
    {
        field:'title',
        headerName:'Title',
        width:200,
        renderCell:({row}:GridRenderCellParams)=>(
            <span onClick={()=>handleEdit(row)} className="table-link" >{row?.title || 'No title'}</span>
        )
    },
    
    {
        field:'members',
        headerName:'Related to',
        width:200,
        valueFormatter:(_, rel:IRelationship)=>{
            const members = rel?.members as IMember[];
            const morethan2 = rel?.members?.length > 2;
            const suffix = `+${rel?.members?.length - 2} ${rel?.members?.length === 3 ? 'other':'others'}`
            return `${getOtherUserFirst(members, member)?.name} ${morethan2 && suffix}`
        },
        valueGetter:(_, rel:IRelationship)=>{
            const members = rel?.members as IMember[];
            const morethan2 = rel?.members?.length > 2;
            const suffix = `+${rel?.members?.length - 2} ${rel?.members?.length === 3 ? 'other':'others'}`
            return `${getOtherUserFirst(members, member)?.name} ${morethan2 && suffix}`
        },
        renderCell:({row}:GridRenderCellParams)=>(
            <div className="flex gap-1">
                <Link href={`/dashboard/members/${getOtherUserFirst(row?.members, member)?._id}`} className="table-link" >{getOtherUserFirst(row?.members, member)?.name}</Link>
                {
                    row?.members?.length > 2 &&
                    <span>{`+${row?.members?.length - 2} ${row?.members?.length === 3 ? 'other':'others'}`}</span>
                }
            </div>
        )
    },
    {
        field:'type',
        headerName:'Relationship',
        width:120,
        valueFormatter:(_, rel:IRelationship)=>{
            const members = rel?.members as IMember[];
            return getRelationValue(members, member, rel?.type as ConvertibleRelationship)
        },
        valueGetter:(_, rel:IRelationship)=>{
            const members = rel?.members as IMember[];
            return getRelationValue(members, member, rel?.type as ConvertibleRelationship)
        },
        renderCell:({row}:GridRenderCellParams)=>(
            <span>{getRelationValue(row?.members, member, row?.type)}</span>
        )
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
                        <Tooltip title='View more of this entity' >
                            <GoInfo onClick={()=>handleInfo(params?.row)}  className="cursor-pointer text-green-700" />
                        </Tooltip>
                        <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                    </div>
                )
            }
    },
]