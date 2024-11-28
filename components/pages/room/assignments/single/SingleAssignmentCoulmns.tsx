import CustomCheck from "@/components/pages/group/new/CustomCheck";
import {  GridRenderCellParams } from "@mui/x-data-grid";
import CustomRadio from "./CustomRadio";
import { EventRegProps } from "@/types/Types";

export const SingleAssignmentCoulmns =(
    rooms:string[],
    handleSelect:(id:string)=>void,
    currendId:string,
    handleRadio:(id:string)=>void,
    data:EventRegProps
) => [
    {
        field:'id',
        headerName:'Select',
        width:100,
        renderCell:(params:GridRenderCellParams) =>{
            return(
                <div className="h-full flex-center" >
                {
                    data?.regType === 'Individual' ?
                    <CustomRadio onClick={()=>handleRadio(params?.row?.id)} checked={currendId === params?.row?.id} />
                    :
                    <CustomCheck onClick={()=>handleSelect(params?.row?.id)} checked={rooms.includes(params?.row?.id)} />
                }
                </div>
            )
        }
    },
    {
        field:'venue',
        headerName:'Venue',
        width:140,
    },
    {
        field:'number',
        headerName:'Room Number',
        width:100,
    },
    {
        field:'roomType',
        headerName:'Room Type',
        width:100,
    },
    {
        field:'bedType',
        headerName:'Bed Type',
        width:120,
    },
    
]