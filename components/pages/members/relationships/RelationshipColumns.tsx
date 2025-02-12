import { IRelationship } from "@/lib/database/models/relationship.model";
import { Tooltip } from "@mui/material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { GoInfo } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";

export const RelationshipColumns = (
    handleEdit:(data:IRelationship)=>void,
    handleInfo:(data:IRelationship)=>void,
    handleDelete:(data:IRelationship)=>void,
)=>[
    {
        field:'title',
        headerName:'Title',
        width:200,
        renderCell:({row}:GridRenderCellParams)=>(
            <span onClick={()=>handleEdit(row)} className="table-link" >{row?.title || 'No title'}</span>
        )
    },
    {
        field:'member',
        headerName:'Member',
        width:200,
        renderCell:({row}:GridRenderCellParams)=>(
            <Link href={`/dashboard/members/${row?.members[0]?._id}`} className="table-link" >{row?.members[0]?.name}</Link>
        )
    },
    {
        field:'members',
        headerName:'Related to',
        width:200,
        renderCell:({row}:GridRenderCellParams)=>(
            <div className="flex gap-2">
                <Link href={`/dashboard/members/${row?.members[1]?._id}`} className="table-link" >{row?.members[1]?.name}</Link>
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
        renderCell:({row}:GridRenderCellParams)=>(
            <Link href={`/dashboard/churches/${row?.churchId?._id}`} className="table-link" >{row?.churchId?.name}</Link>
        )
    },

    {
            field:'_id',
            headerName:'Actions',
            width:120,
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