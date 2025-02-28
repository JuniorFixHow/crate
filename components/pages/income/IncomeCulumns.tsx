import { IChurch } from "@/lib/database/models/church.model";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";

export const IncomeColumns:GridColDef[]=[
    {
        field:'church',
        headerName:'Church',
        filterable:true,
        valueFormatter:(value:IChurch)=> value?.name,
        valueGetter:(value:IChurch)=> value?.name,
        width:180,
        renderCell:({row}:GridRenderCellParams)=>(
            <Link className="table-link" href={{pathname:'/dashboard/churches', query:{id:row?.church?._id}}} >{row?.church?.name}</Link>
        ),
    },

    {
        field:'adp',
        headerName:'Adult Price',
        width:130,
    },
    {
        field:'chp',
        headerName:'Children Price',
        width:130,
    },
    {
        field:'adults',
        headerName:'Exp Adults',
        width:130,
    },
    {
        field:'children',
        headerName:'Exp Children',
        width:130,
    },
    {
        field:'total',
        headerName:'Exp Total',
        width:130,
    },
]