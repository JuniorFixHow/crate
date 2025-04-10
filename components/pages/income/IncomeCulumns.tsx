import { IChurch } from "@/lib/database/models/church.model";
import { IExpectedRevenue } from "@/types/Types";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";

export const IncomeColumns=(
    showChurch:boolean
):GridColDef[]=>[
    {
        field:'church',
        headerName:'Church',
        filterable:true,
        valueFormatter:(_, value:IExpectedRevenue)=> {
            const church = value?.church as IChurch;
            return church?.name;
        },
        valueGetter:(_, value:IExpectedRevenue)=> {
            const church = value?.church as IChurch;
            return Object.values(church);
        },
        width:180,
        renderCell:({row}:GridRenderCellParams)=>(
            <>
            {
                showChurch?
                <Link className="table-link" href={{pathname:'/dashboard/churches', query:{id:row?.church?._id}}} >{row?.church?.name}</Link>
                :
                <span>{row?.church?.name}</span>
            }
            </>
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