import { IAttendance } from "@/lib/database/models/attendance.model";
import { IMember } from "@/lib/database/models/member.model";
import { IRegistration } from "@/lib/database/models/registration.model";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Image from "next/image";
import Link from "next/link";
import { IoTrashBinOutline } from "react-icons/io5";
import { MdOpenInNew } from "react-icons/md";
import { getJustTime } from "../pages/session/fxn";

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
        width:160,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link className="table-link" href={{pathname:`/dashboard/churches`, query:{id:params?.row?.church._id}}} >{params?.row?.church.name}</Link>
            )
        }
    },
    {
        field:'registerType',
        headerName:'Type',
        width:90
    },
    
    {
        field:'id',
        headerName:'Action',
        width:120,
        // params:GridRenderCellParams
        renderCell:(params:GridRenderCellParams)=> {
            // console.log(params.row?.id)
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    <Link href={`/dashboard/members/${params?.row?.id}`} >
                        <MdOpenInNew className="cursor-pointer" color={Blue} />
                    </Link>
                </div>
            )
        },
    }
]

export const EventColumns:GridColDef[] = [
    {
        field:'name',
        headerName:'Name',
        width:170,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link className="table-link" href={`/dashboard/events/${params?.row._id}`} >{params?.row.name}</Link>
            )
        }
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
        field:'_id',
        headerName:'Actions',
        width:80,
        // params:GridRenderCellParams
        renderCell:(params:GridRenderCellParams)=> {
            // console.log(params.row?.id)
            return(
                <div className="flex-center h-full">
                    <Link href={`/dashboard/events/${params?.row?._id}`} >
                        <MdOpenInNew className="cursor-pointer" color={Blue} />
                    </Link>
                </div>
            )
        },
    }
]

export const MemberColumns = (handleDelete:(data:IMember)=>void)=> [
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
        width:170,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <div className="flex-center h-full">
                    <Link className="table-link" href={`/dashboard/members/${params?.row?._id}`} >{params?.row?.name}</Link>
                </div>
            )
        }
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
        renderCell:(params:GridRenderCellParams)=> {
            // console.log(params.row?.id)
            return(
                <div className="h-full flex-center">
                    {/* <MdOpenInNew className="cursor-pointer" color={Blue} /> */}
                    <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                </div>
            )
        },
    }
]


export const BadgesColumns =(
    handleInfo:(data:IRegistration)=>void,
    handleDelete:(data:IRegistration)=>void,
) => [
    {
        field:'memberId',
        headerName:'Name',
        width:170,
        renderCell:(params:GridRenderCellParams) => {
            return(
              <div className="flex items-center justify-center">
                <Link href={`/dashboard/members/${params?.row?.memberId._id}`}  className='table-link' >{params?.row?.memberId.name}</Link>
              </div>
            )  
          },
    },
    {
        field:'regType',
        headerName:'Type',
        width:120,
        renderCell:(params:GridRenderCellParams) =>{
            return(
                <span >{params?.row.groupId ? 'Grooup':'Individual'}</span>
            )
        }
    },
    {
        field:'status',
        headerName:'Check-in status',
        width:130
    },
    {
        field:'badgeIssued',
        headerName:'Badge issued',
        width:140
    },
    {
        field:'groupId',
        headerName:"Group",
        width:130,
        renderCell:(params:GridRenderCellParams) => {
          return(
            <div className="flex items-center justify-center">
                {
                    params?.row?.groupId?
                    <Link href={`/dashboard/groups/${params?.row?.groupId._id}`}  className='table-link' >{params?.row?.groupId.name}</Link>
                    :
                    <span >N/A</span>
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
                      <Link href={`/dashboard/rooms/${params?.row?.room._id}`}  className='table-link' >{params?.row?.roomId.number}</Link>
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
                    <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                </div>
            )
        },
    }
]

export const AttendanceColumns = (
    handleDelete:(data:IAttendance)=>void
)=> [
    {
        field:'member',
        headerName:'Member',
        width:170,
        renderCell:(params:GridRenderCellParams) => {
            return(
              <div className="flex items-center justify-center">
                <span className='hover:underline text-left w-full text-blue-800 cursor-pointer' >{params?.row?.member?.name}</span>
              </div>
            )  
        },
    },
    {
        field:'createdAt',
        headerName:'Time',
        width:120,
        renderCell:(params:GridRenderCellParams) => {
            return(
                <span className='' >{getJustTime(params?.row?.createdAt)}</span>
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
        width:150,
        renderCell:(params:GridRenderCellParams) => {
            return(
              <div className="flex items-center justify-center">
                <Link href={`/dashboard/events/sessions/${params?.row?.sessionId._id}`} className='table-link' >{params?.row?.sessionId.name}</Link>
              </div>
            )  
        },
    },
    
    
    {
        field:'_id',
        headerName:'Actions',
        width:80,
        // params:GridRenderCellParams
        renderCell:(params:GridRenderCellParams)=> {
            // console.log(params.row?.id)
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                </div>
            )
        },
    }
]