import { IChurch } from "@/lib/database/models/church.model";
import { IMember } from "@/lib/database/models/member.model";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import CustomCheck from "../group/new/CustomCheck";

export const HubClassAddMemberColumns = (
    handleSelect:(id:string)=>void,
    selection:string[],
    showMember:boolean,
    isAdmin:boolean,
):GridColDef[]=>[
    {
        field:'_id',
        headerName:'Selection',
        width:80,
        filterable:false,
        disableExport:true,
        renderCell:(params)=>(
            <div className="flex-center h-full">
                <CustomCheck onClick={()=>handleSelect(params.row?._id)} checked={!!selection.find((item)=>item === params.row?._id)} />
            </div>
        )
    },
    {
            field:'name',
            headerName:'Member',
            width:180,
            renderCell:(param:GridRenderCellParams)=>(
                <>
                {
                    showMember ?
                    <Link className="table-link" href={`/dashboard/members/${param.row?._id}`} >{param?.row?.name}</Link>
                    :
                    <span>{param?.row?.name}</span>
                }
                </>
            )
        },
    
        {
            field:'gender',
            headerName:'Gender',
            width:100,
        },
        {
            field:'ageRange',
            headerName:'Age Group',
            width:110,
        },
        {
            field:'church',
            headerName:'Church',
            width:200,
            valueFormatter:(_, member:IMember)=>{
                const church = member?.church as IChurch;
                return church ? church?.name : '';
            },
            valueGetter:(_, member:IMember)=>{
                const church = member?.church as IChurch;
                return church ? church?.name : '';
            },
            renderCell:(params:GridRenderCellParams)=>(
                <>
                {
                    isAdmin ?
                    <Link href={{pathname:`/dashboard/churches`, query:{id:params.row?.church?._id}}} className="table-link" >{params?.row?.church?.name}</Link>
                    :
                    <span>{params?.row?.church?.name}</span>
                }
                </>
            )
        },
]