import { IChurch } from "@/lib/database/models/church.model";
import { IMember } from "@/lib/database/models/member.model";
import { IRelationship } from "@/lib/database/models/relationship.model";
import { Tooltip } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { GoInfo } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";

export const RelationshipColumns = (
    handleEdit:(data:IRelationship)=>void,
    handleInfo:(data:IRelationship)=>void,
    handleDelete:(data:IRelationship)=>void,
    showRelRead:boolean,
    showRelDelete:boolean,
    showRelEdit:boolean,
    showMember:boolean,
    isAdmin:boolean,
):GridColDef[]=>[
    {
        field:'title',
        headerName:'Title',
        width:200,
        renderCell:({row}:GridRenderCellParams)=>(
            <>
            {
                showRelEdit ?
                <span onClick={()=>handleEdit(row)} className="table-link" >{row?.title || 'No title'}</span>
                :
                <span >{row?.title || 'No title'}</span>
            }
            </>
        )
    },
    {
        field:'member',
        headerName:'Member',
        width:200,
        valueFormatter:(_, rel:IRelationship)=>{
            const members = rel?.members as IMember[];
            return members[0]?.name;
        },
        valueGetter:(_, rel:IRelationship)=>{
            const members = rel?.members as IMember[];
            return members[0]?.name;
        },
        renderCell:({row}:GridRenderCellParams)=>(
            <>
            {
                showMember ?
                <Link href={`/dashboard/members/${row?.members[0]?._id}`} className="table-link" >{row?.members[0]?.name}</Link>
                :
                <span >{row?.members[0]?.name}</span>
            }
            </>
        )
    },
    {
        field:'members',
        headerName:'Related to',
        width:200,
        valueFormatter:(_, rel:IRelationship)=>{
            const members = rel?.members as IMember[];
            return members?.length > 1 ? `${members?.slice(1).map((member)=>member.name+'; ')}` : ''
        },
        valueGetter:(_, rel:IRelationship)=>{
            const members = rel?.members as IMember[];
            return members?.length > 1 ? `${members?.slice(1).map((member)=>member.name+'; ')}` : ''
        },
        renderCell:({row}:GridRenderCellParams)=>(
            <div className="flex gap-2">
                {
                    showMember?
                    <Link href={`/dashboard/members/${row?.members[1]?._id}`} className="table-link" >{row?.members[1]?.name}</Link>
                    :
                    <span >{row?.members[1]?.name}</span>
                }
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
    },
    {
        field:'churchId',
        headerName:'Church',
        width:200,
        valueFormatter:(_, rel:IRelationship)=>{
            const church = rel?.churchId as IChurch;
            return church?.name;
        },
        valueGetter:(_, rel:IRelationship)=>{
            const church = rel?.churchId as IChurch;
            return church?.name;
        },
        renderCell:({row}:GridRenderCellParams)=>(
            <>
            {
                isAdmin ?
                <Link href={`/dashboard/churches/${row?.churchId?._id}`} className="table-link" >{row?.churchId?.name}</Link>
                :
                <span >{row?.churchId?.name}</span>
            }
            </>
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
                        {
                            showRelRead &&
                            <Tooltip title='View more of this entity' >
                                <GoInfo onClick={()=>handleInfo(params?.row)}  className="cursor-pointer text-green-700" />
                            </Tooltip>
                        }
                        {
                            showRelDelete &&
                            <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                        }
                        {
                            !showRelRead && !showRelDelete &&
                            <span>None</span>
                        }
                    </div>
                )
            }
    },
]