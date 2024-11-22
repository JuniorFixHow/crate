import { EventRegProps } from "@/types/Types";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Image from "next/image";
import { IoTrashBinOutline } from "react-icons/io5";
import { MdOpenInNew } from "react-icons/md";

export const Grey = '#949191';
export const Blue = '#3C60CA';

export const RegColumns:GridColDef[] = [
    {
        field:'photo',
        headerName:'Photo',
        width:100,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className='mt-1 relative flex-row h-full items-center pb-2 flex' >
                    <Image alt="member" height={30} width={30}  objectFit="cover"  className="rounded-full object-cover" src={params.row?.photo} />
                </div>
            )
        }
    },
    {
        field:'name',
        headerName:'Name',
        width:170
    },
    {
        field:'ageRange',
        headerName:'Age Group',
        width:100
    },
    {
        field:'gender',
        headerName:'Gender',
        width:80
    },
    {
        field:'church',
        headerName:'Church',
        width:160
    },
    {
        field:'registerType',
        headerName:'Type',
        width:90
    },
    
    {
        field:'id',
        headerName:'Actions',
        width:120,
        // params:GridRenderCellParams
        renderCell:()=> {
            // console.log(params.row?.id)
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    <MdOpenInNew className="cursor-pointer" color={Blue} />
                </div>
            )
        },
    }
]

export const EventColumns:GridColDef[] = [
    {
        field:'name',
        headerName:'Name',
        width:170
    },
    {
        field:'location',
        headerName:'Location',
        width:120
    },
    {
        field:'type',
        headerName:'Type',
        width:130
    },
    {
        field:'sessions',
        headerName:'Sessions',
        width:90
    },
    {
        field:'adultPrice',
        headerName:"Adults' Price ($)",
        width:120
    },
    {
        field:'childPrice',
        headerName:"Children's Price ($)",
        width:130
    },
    
    {
        field:'id',
        headerName:'Actions',
        width:80,
        // params:GridRenderCellParams
        renderCell:()=> {
            // console.log(params.row?.id)
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    <MdOpenInNew className="cursor-pointer" color={Blue} />
                </div>
            )
        },
    }
]

export const MemberColumns:GridColDef[] = [
    {
        field:'photo',
        headerName:'Photo',
        width:100,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className='mt-1 relative flex-row h-full items-center pb-2 flex' >
                    <Image alt="member" height={30} width={30}  objectFit="cover"  className="rounded-full object-cover" src={params.row?.photo} />
                </div>
            )
        }
    },
    {
        field:'name',
        headerName:'Name',
        width:170
    },
    {
        field:'gender',
        headerName:'Gender',
        width:120
    },
    {
        field:'ageRange',
        headerName:'Age Group',
        width:120
    },
    {
        field:'status',
        headerName:'Status',
        width:160
    },
    {
        field:'registerType',
        headerName:'Type',
        width:120
    },
    {
        field:'id',
        headerName:'Actions',
        width:120,
        // params:GridRenderCellParams
        renderCell:()=> {
            // console.log(params.row?.id)
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    <MdOpenInNew className="cursor-pointer" color={Blue} />
                    <IoTrashBinOutline className="cursor-pointer text-red-700" />
                </div>
            )
        },
    }
]


export const BadgesColumns =(
    handleInfo:(data:EventRegProps)=>void
) => [
    {
        field:'memberId',
        headerName:'Name',
        width:170,
        renderCell:(params:GridRenderCellParams) => {
            return(
              <div className="flex items-center justify-center">
                <span className='hover:underline text-blue-800 cursor-pointer' >{params?.row?.memberId}</span>
              </div>
            )  
          },
    },
    {
        field:'regType',
        headerName:'Type',
        width:120
    },
    {
        field:'status',
        headerName:'Check-in status',
        width:130
    },
    {
        field:'badgeIssued',
        headerName:'Badge issued',
        width:120
    },
    {
        field:'groupId',
        headerName:"Group",
        width:130,
        renderCell:(params:GridRenderCellParams) => {
          return(
            <div className="flex items-center justify-center">
                {
                    params?.row?.regType === 'Individual'?
                    <span >N/A</span>
                    :
                    <span className='hover:underline text-blue-800 cursor-pointer' >{params?.row?.groupId}</span>
                }
            </div>
          )  
        },
    },
    {
        field:'roomId',
        headerName:"Room",
        width:120,
        renderCell:(params:GridRenderCellParams) => {
            return(
              <div className="flex items-center justify-center">
                  {
                      params?.row?.roomId?
                      <span className='hover:underline text-blue-800 cursor-pointer' >{params?.row?.roomId}</span>
                      :
                      <span >Unallocated</span>
                  }
              </div>
            )  
          },
    },
    
    {
        field:'id',
        headerName:'Actions',
        width:80,
        // params:GridRenderCellParams
        renderCell:(params:GridRenderCellParams)=> {
            // console.log(params.row?.id)
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    <MdOpenInNew onClick={()=>handleInfo(params?.row)}  className="cursor-pointer" color={Blue} />
                    <IoTrashBinOutline className="cursor-pointer text-red-700" />
                </div>
            )
        },
    }
]

export const AttendanceColumns:GridColDef[] = [
    {
        field:'member',
        headerName:'Member',
        width:170,
        renderCell:(params:GridRenderCellParams) => {
            return(
              <div className="flex items-center justify-center">
                <span className='hover:underline text-left w-full text-blue-800 cursor-pointer' >{params?.row?.member}</span>
              </div>
            )  
        },
    },
    {
        field:'time',
        headerName:'Time',
        width:120,
        renderCell:(params:GridRenderCellParams) => {
            return(
              <div className="flex items-center justify-center">
                <span className='' >{new Date(params?.row?.time).toLocaleTimeString()}</span>
              </div>
            )  
        },
    },
    {
        field:'late',
        headerName:'Late',
        width:90
    },
   
    {
        field:'sessionId',
        headerName:"Session",
        width:130,
        renderCell:(params:GridRenderCellParams) => {
            return(
              <div className="flex items-center justify-center">
                <span className='hover:underline w-full text-blue-800 cursor-pointer' >{params?.row?.sessionId}</span>
              </div>
            )  
        },
    },
    
    
    {
        field:'id',
        headerName:'Actions',
        width:80,
        // params:GridRenderCellParams
        renderCell:()=> {
            // console.log(params.row?.id)
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    <IoTrashBinOutline className="cursor-pointer text-red-700" />
                </div>
            )
        },
    }
]