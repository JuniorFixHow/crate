import { IAttendance } from "@/lib/database/models/attendance.model";
import { IMember } from "@/lib/database/models/member.model";
import { IRegistration } from "@/lib/database/models/registration.model";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Image from "next/image";
import Link from "next/link";
import { IoTrashBinOutline } from "react-icons/io5";
import { MdOpenInNew } from "react-icons/md";
import { getJustTime } from "../pages/session/fxn";
import { GoInfo } from "react-icons/go";
import { SessionPayload } from "@/lib/session";
import { UserRoles } from "./UserRoles";
import { IVendor } from "@/lib/database/models/vendor.model";
import { ICampuse } from "@/lib/database/models/campuse.model";
import { IChurch } from "@/lib/database/models/church.model";
import { IGroup } from "@/lib/database/models/group.model";
import { IRoom } from "@/lib/database/models/room.model";
import { ISession } from "@/lib/database/models/session.model";

export const Grey = '#949191';
export const Blue = '#3C60CA';
export const AdultsRange = ['11-20', '21-30', '31-40', '41-50', '51-60', '60+'];
export const ChildrenRange = ['6-10'];
export const ADRoles = ['SU', 'SA1', 'SA2', 'SA3', 'SA4'];

export const checkIfAdmin = (user:SessionPayload|null):boolean=>{
    if(user){
        const isAdmin = ADRoles.some((item) => user.roles?.includes(item));
        return isAdmin;
    }
    return false;
}

export const checkUserRole = (user:SessionPayload|null, title:string, code:string):boolean=>{
    if(user){
        const role = UserRoles.find(item=> item.title === title);
        if(role){
            const isAdmin = role.codes.find((item)=>item === code);   
            return !!isAdmin;
        }
    }
    return false;
}

export const RegColumns=(
    showInfo:boolean,
    showChurch:boolean,
    showCampus:boolean,
):GridColDef[]=> [
    {
        field:'photo',
        headerName:'Photo',
        filterable:false,
        disableExport:true,
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
        field:'phone',
        headerName:'Phone',
        width:120
    },
    {
        field:'status',
        headerName:'Status',
        width:120
    },
    {
        field:'marital',
        headerName:'Marital Status',
        width:120
    },
    {
        field:'voice',
        headerName:'Voice',
        width:120
    },
    {
        field:'employ',
        headerName:'Employment Status',
        width:120
    },
   
    
    
    

    {
        field:'church',
        headerName:'Church',
        width:160,
        valueFormatter: (_, row:IMember) => {
            const church = row?.church as IChurch;
            return church?.name;
        },
        valueGetter: (_, row:IMember) => {
            const church = row?.church as IChurch;
            return church ? Object.values(church) : 'N/A';
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    showChurch ?
                    <Link className="table-link" href={{pathname:`/dashboard/churches`, query:{id:params?.row?.church._id}}} >{params?.row?.church.name}</Link>
                    :
                    <span >{params?.row?.church.name}</span>
                }
                </>
            )
        }
    },
   
    
    {
        field:'campuseId',
        headerName:'Campus',
        width:160,
        filterable:true,
        valueFormatter: (_, row:IMember) => {
            const campus = row?.campuseId as ICampuse;
            return campus?.name;
        },
        valueGetter: (_, row:IMember) => {
            const campus = row?.campuseId as ICampuse;
            return campus ? Object.values(campus) : 'N/A';
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    params.row.campuseId ? 
                    <>
                    {
                        showCampus ?
                        <Link className="table-link" href={{pathname:`/dashboard/churches/campuses`, query:{id:params.row?.campuseId?._id}}} >{params.row?.campuseId?.name}</Link>
                        :
                        <span >{params.row?.campuseId?.name}</span>
                    }
                    </>
                    :
                    <span>None</span>
                }
                </>
            )
        }
    },
    {
        field:'registeredBy',
        headerName:'Registered By',
        width:160,
        valueFormatter: (_, row:IMember) => {
            const user = row?.registeredBy as IVendor;
            return user?.name;
        },
        valueGetter: (_, row:IMember) => {
            const user = row?.registeredBy as IVendor;
            return user ? Object.values(user) : 'N/A';
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <Link className="table-link" href={{pathname:`/dashboard/users/`, query:{id:params.row?.registeredBy?._id}}} >{params.row?.registeredBy?.name}</Link>
            )
        }
    },

    {
        field:'createdAt',
        headerName:'Registered On',
        width:120,
        valueFormatter: (_, value:IMember) => {
            return value?.createdAt && new Date(value?.createdAt)?.toLocaleDateString();
        },
        valueGetter: (_, value:IMember) => {
            return value?.createdAt && new Date(value?.createdAt)?.toLocaleDateString();
        },
        renderCell:({row}:GridRenderCellParams)=>{
            return(
                <span>{new Date(row?.createdAt)?.toLocaleDateString()}</span>
            )
        }
    },
    {
        field:'id',
        headerName:'Action',
        width:120,
        filterable:false,
        disableExport:true,
        // params:GridRenderCellParams
        renderCell:(params:GridRenderCellParams)=> {
            // console.log(params.row?.id)
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    {
                        showInfo ?
                        <Link href={`/dashboard/members/${params?.row?._id}`} >
                            <MdOpenInNew className="cursor-pointer" color={Blue} />
                        </Link>
                        :
                        <span className="text-red-600" >Denied</span>
                    }
                </div>
            )
        },
    }
]

export const EventColumns=(
    updater:boolean,
):GridColDef[] => [
    {
        field:'name',
        headerName:'Name',
        width:170,
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    updater ?
                    <Link className="table-link" href={`/dashboard/events/${params?.row._id}`} >{params?.row.name}</Link>
                    :
                    <span >{params?.row.name}</span>
                }
                </>
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
        filterable:false,
        disableExport:true,
        // params:GridRenderCellParams
        renderCell:(params:GridRenderCellParams)=> {
            // console.log(params.row?.id)
            return(
                <div className="flex-center h-full">
                    {
                        updater ?
                        <Link href={`/dashboard/events/${params?.row?._id}`} >
                            <MdOpenInNew className="cursor-pointer" color={Blue} />
                        </Link>
                        :
                        <span>None</span>
                    }
                </div>
            )
        },
    }
]

export const MemberColumns = (
    handleDelete:(data:IMember)=>void,
    handleInfo:(data:IMember)=>void,
    showChurch:boolean,
    showCampus:boolean,
    showInfo:boolean,
    showDelete:boolean,
    showMember:boolean,
    showUsers:boolean,
):GridColDef[]=> [
    {
        field:'photo',
        headerName:'Photo',
        width:100,
        disableExport: true,
        filterable: false,
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
                <div className="h-full">
                    {
                        showMember ?
                        <Link className="table-link" href={`/dashboard/members/${params?.row?._id}`} >{params?.row?.name}</Link>
                        :
                        <span >{params?.row?.name}</span>
                    }
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
        field:'phone',
        headerName:'Phone',
        width:120
    },
    {
        field:'status',
        headerName:'Status',
        width:120
    },
    {
        field:'marital',
        headerName:'Marital Status',
        width:120
    },
    // {
    //     field:'voice',
    //     headerName:'Voice',
    //     width:120
    // },
    {
        field:'employ',
        headerName:'Employment Status',
        width:120
    },
    {
        field:'ageRange',
        headerName:'Age Group',
        width:120
    },
    
    {
        field:'church',
        headerName:'Church',
        width:160,
        filterable:true,
        valueFormatter: (_, row:IMember) => {
            const church = row?.church as IChurch;
            return church?.name;
        },
        valueGetter: (_, row:IMember) => {
            const church = row?.church as IChurch;
            return church ? Object.values(church) : 'N/A';
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    showChurch ?
                    <Link className="table-link" href={{pathname:`/dashboard/churches`, query:{id:params.row?.church?._id}}} >{params.row?.church?.name}</Link>
                    :
                    <span >{params.row?.church?.name}</span>
                }    
                </>
            )
        }
    },
    {
        field:'campuseId',
        headerName:'Campus',
        width:160,
        filterable:true,
        valueFormatter: (_, row:IMember) => {
            const campus = row?.campuseId as ICampuse;
            return campus?.name;
        },
        valueGetter: (_, row:IMember) => {
            const campus = row?.campuseId as ICampuse;
            return campus ? Object.values(campus) : 'N/A';
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    params.row.campuseId ? 
                    <>
                     {
                        showCampus ?
                        <Link className="table-link" href={{pathname:`/dashboard/churches/campuses`, query:{id:params.row?.campuseId?._id}}} >{params.row?.campuseId?.name}</Link>
                        :
                        <span >{params.row?.campuseId?.name}</span>
                     }  
                    </>
                    :
                    <span>None</span>
                }
                </>
            )
        }
    },
    {
        field:'registeredBy',
        headerName:'Registered By',
        width:160,
        valueFormatter: (_, row:IMember) => {
            const user = row?.registeredBy as IVendor;
            return user?.name;
        },
        valueGetter: (_, row:IMember) => {
            const user = row?.registeredBy as IVendor;
            return user ? Object.values(user) : 'N/A';
        },
        renderCell:(params:GridRenderCellParams)=>{
            return(
                <>
                {
                    showUsers?
                    <Link className="table-link" href={{pathname:`/dashboard/users/`, query:{id:params.row?.registeredBy?._id}}} >{params.row?.registeredBy?.name}</Link>
                    :
                    <span >{params.row?.registeredBy?.name}</span>
                }
                </>
            )
        }
    },

    {
        field:'createdAt',
        headerName:'Registered On',
        width:120,
        valueFormatter: (_, member:IMember) => member?.createdAt && new Date(member?.createdAt)?.toLocaleDateString(),
        valueGetter: (_, member:IMember) =>  member?.createdAt && new Date(member?.createdAt)?.toLocaleDateString(),
        renderCell:({row}:GridRenderCellParams)=>{
            return(
                <span>{new Date(row?.createdAt)?.toLocaleDateString()}</span>
            )
        }
    },

    {
        field:'id',
        headerName:'Actions',
        filterable: false,
        width:120,
        disableExport: true,
        // params:GridRenderCellParams
        renderCell:(params:GridRenderCellParams)=> {
            // console.log(params.row?.id)
            return(
                <div className="h-full flex-center gap-3">
                    {/* <MdOpenInNew className="cursor-pointer" color={Blue} /> */}
                    {
                        showInfo &&
                        <GoInfo onClick={()=>handleInfo(params?.row)}  className="cursor-pointer text-green-700" />
                    }
                    {
                        showDelete &&
                        <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                    }
                    {
                        !showInfo && !showDelete &&
                        <span>None</span>
                    }
                </div>
            )
        },
    }
]


export const BadgesColumns =(
    handleInfo:(data:IRegistration)=>void,
    handleDelete:(data:IRegistration)=>void,
    showDelete:boolean,
    showView:boolean,
    showChurch:boolean,
    showCampus:boolean,
    showMember:boolean,
    showRoom:boolean,
    showGroup:boolean,
):GridColDef[] => [
    {
        field:'memberId',
        headerName:'Name',
        width:170,
        valueFormatter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.name
        },
        valueGetter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return Object.values(member)
        },
        renderCell:(params:GridRenderCellParams) => {
            return(
              <>
                {
                    showMember ?
                    <Link href={`/dashboard/members/${params?.row?.memberId?._id}`}  className='table-link' >{params?.row?.memberId?.name}</Link>
                    :
                    <span >{params?.row?.memberId?.name}</span>
                }
              </>
            )  
          },
    },
    {
        field:'email',
        headerName:'Email',
        width:150,
        valueFormatter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.email;
        },
        valueGetter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.email;
        },
        renderCell:({row:reg}:GridRenderCellParams)=>(
            <Link className="table-link" href={`mailto:${reg?.memberId?.email}`} >{reg?.memberId?.email}</Link>
        )
    },
    {
        field:'ageRange',
        headerName:'Age Range',
        width:150,
        valueFormatter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.ageRange;
        },
        valueGetter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.ageRange;
        },
        renderCell:({row:reg}:GridRenderCellParams)=>(
            <span  >{reg?.memberId?.ageRange}</span>
        )
    },
    {
        field:'gender',
        headerName:'Gender',
        width:150,
        valueFormatter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.gender;
        },
        valueGetter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.gender;
        },
        renderCell:({row:reg}:GridRenderCellParams)=>(
            <span  >{reg?.memberId?.gender}</span>
        )
    },
    {
        field:'phone',
        headerName:'Phone',
        width:150,
        valueFormatter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.phone;
        },
        valueGetter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.phone;
        },
        renderCell:({row:reg}:GridRenderCellParams)=>(
            <Link className="table-link" href={`tel:${reg?.memberId?.email}`} >{reg?.memberId?.phone}</Link>
        )
    },
    {
        field:'mstatus',
        headerName:'Member Status',
        width:150,
        valueFormatter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.status;
        },
        valueGetter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.status;
        },
        renderCell:({row:reg}:GridRenderCellParams)=>(
            <span  >{reg?.memberId?.status}</span>
        )
    },
    {
        field:'marital',
        headerName:'Marital Status',
        width:130,
        valueFormatter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.marital;
        },
        valueGetter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.marital;
        },
        renderCell:({row:reg}:GridRenderCellParams)=>(
            <span  >{reg?.memberId?.marital}</span>
        )
    },
    {
        field:'employ',
        headerName:'Employment Status',
        width:130,
        valueFormatter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.employ;
        },
        valueGetter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.employ;
        },
        renderCell:({row:reg}:GridRenderCellParams)=>(
            <span  >{reg?.memberId?.employ}</span>
        )
    },
    {
        field:'voice',
        headerName:'Voice',
        width:130,
        valueFormatter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.voice;
        },
        valueGetter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.voice;
        },
        renderCell:({row:reg}:GridRenderCellParams)=>(
            <span  >{reg?.memberId?.voice}</span>
        )
    },
    {
        field:'role',
        headerName:'Role',
        width:130,
        valueFormatter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.role;
        },
        valueGetter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            return member?.role;
        },
        renderCell:({row:reg}:GridRenderCellParams)=>(
            <span  >{reg?.memberId?.role}</span>
        )
    },
    // {
    //     field:'allergy',
    //     headerName:'Allergy',
    //     width:130,
    //     valueFormatter:(_, row:IRegistration)=>{
    //         const member  = row?.memberId as IMember;
    //         return member?.allergy;
    //     },
    //     valueGetter:(_, row:IRegistration)=>{
    //         const member  = row?.memberId as IMember;
    //         return member?.allergy;
    //     },
    //     // renderCell:({row:reg}:GridRenderCellParams)=>(
    //     //     <Link className="table-link" href={`mailto:${reg?.memberId?.email}`} >{reg?.memberId?.email}</Link>
    //     // )
    // },
    // {
    //     field:'dietary',
    //     headerName:'Dietary',
    //     width:130,
    //     valueFormatter:(_, row:IRegistration)=>{
    //         const member  = row?.memberId as IMember;
    //         return member?.dietary;
    //     },
    //     valueGetter:(_, row:IRegistration)=>{
    //         const member  = row?.memberId as IMember;
    //         return member?.dietary;
    //     },
    //     // renderCell:({row:reg}:GridRenderCellParams)=>(
    //     //     <Link className="table-link" href={`mailto:${reg?.memberId?.email}`} >{reg?.memberId?.email}</Link>
    //     // )
    // },
    {
        field:'church',
        headerName:'Church',
        width:150,
        valueFormatter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            const church = member?.church as IChurch;
            return church?.name;
        },
        valueGetter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            const church = member?.church as IChurch;
            return church?.name;
        },
        renderCell:({row:reg}:GridRenderCellParams)=>(
            <>
            {
                showChurch ?
                <Link className="table-link" href={{pathname:'/dashboard/churches', query:{id:reg?.memberId?.church?._id}}} >{reg?.memberId?.church?.name}</Link>
                :
                <span >{reg?.memberId?.church?.name}</span>
            }
            </>
        )
    },
    {
        field:'campus',
        headerName:'Campus',
        width:150,
        valueFormatter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            const campus = member?.campuseId as ICampuse;
            return campus?.name;
        },
        valueGetter:(_, row:IRegistration)=>{
            const member  = row?.memberId as IMember;
            const campus = member?.campuseId as ICampuse;
            return campus?.name;
        },
        renderCell:({row:reg}:GridRenderCellParams)=>(
            <>
            {
                showCampus ?
                <Link className="table-link" href={{pathname:'/dashboard/churches/campuses', query:{id:reg?.memberId?.campuseId?._id}}} >{reg?.memberId?.campuseId?.name}</Link>
                :
                <span >{reg?.memberId?.campuseId?.name}</span>
            }
            </>
        )
    },
    {
        field:'regType',
        headerName:'Type',
        width:120,
        valueFormatter:(_, row:IRegistration)=>{
            return row?.groupId ? 'Group':'Individual'
        },
        valueGetter:(_, row:IRegistration)=>{
            return row?.groupId ? 'Group':'Individual'
        },
        renderCell:(params:GridRenderCellParams) =>{
            return(
                <span >{params?.row?.groupId ? 'Group':'Individual'}</span>
            )
        }
    },
    {
        field:'status',
        headerName:'Room Assign. Status',
        width:180,
        valueFormatter:(_, row:IRegistration)=>{
            return row?.roomIds!.length > 0 ? 'Assigned':'Pending'
        },
        valueGetter:(_, row:IRegistration)=>{
            return row?.roomIds!.length > 0 ? 'Assigned':'Pending'
        },
        renderCell:(params:GridRenderCellParams) =>{
            return(
                <span >{params?.row?.roomIds?.length > 0 ? 'Assigned':'Pending'}</span>
            )
        }
    },
    
    {
        field:'badgeIssued',
        headerName:'Badge Printed',
        width:140
    },
    {
        field:'groupId',
        headerName:"Group",
        width:130,
        valueFormatter:(_,row:IRegistration)=>{
            const group = row?.groupId as IGroup;
            return group ? group?.name : 'N/A'
        },
        valueGetter:(_,row:IRegistration)=>{
            const group = row?.groupId as IGroup;
            return group ? Object.values(group):'N/A'
        },
       
        renderCell:(params:GridRenderCellParams) => {
          return(
            <>
                {
                    params?.row?.groupId?
                    <>
                    {
                        showGroup ?
                        <Link href={`/dashboard/groups/${params?.row?.groupId?._id}`}  className='table-link' >{params?.row?.groupId?.name}</Link>
                        :
                        <span>{params?.row?.groupId?.name}</span>
                    }
                    </>
                    :
                    <span >N/A</span>
                }
            </>
          )  
        },
    },
    {
        field:'roomId',
        headerName:"Room",
        width:120,
        valueFormatter:(_, row:IRegistration)=>{
            const rooms = row?.roomIds as unknown as IRoom[];
            return rooms?.length ? rooms[0]?.number : 'Unallocated'
        },
        valueGetter:(_, row:IRegistration)=>{
            const rooms = row?.roomIds as unknown as IRoom[];
            return rooms?.length ? rooms[0]?.number : 'Unallocated'
        },
        renderCell:(params:GridRenderCellParams) => {
            return(
              <>
                  {
                      params?.row?.roomIds?.length > 0?
                      <>
                      {
                        showRoom ?
                        <Link href={{pathname:`/dashboard/rooms`, query:{id:params?.row?.roomIds[0]?._id}}}  className='table-link' >{params?.row?.roomIds[0]?.number}</Link>
                        :
                        <span >{params?.row?.roomIds[0]?.number}</span>
                      }
                      </>
                      :
                      <span >Unallocated</span>
                  }
              </>
            )  
          },
    },

    {
        field:'createdAt',
        headerName:'Registered On',
        width:110,
        valueFormatter:(_, value:IRegistration)=> value?.createdAt && new Date(value.createdAt).toLocaleDateString(),
        valueGetter:(_, value:IRegistration)=> value?.createdAt && new Date(value.createdAt).toLocaleDateString(),
        renderCell:({row}:GridRenderCellParams)=>(
            <span>{new Date(row?.createdAt).toLocaleDateString()}</span>
        )
    },
    
    {
        field:'id',
        headerName:'Actions',
        width:80,
        filterable:false,
        disableExport:true,
        // params:GridRenderCellParams
        renderCell:(params:GridRenderCellParams)=> {
            // console.log(params.row?.id)
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    {
                        showView &&
                        <MdOpenInNew onClick={()=>handleInfo(params?.row)}  className="cursor-pointer" color={Blue} />
                    }
                    {
                        showDelete &&
                        <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                    }
                    {
                        !showView && !showDelete &&
                        <span>None</span>
                    }
                </div>
            )
        },
    }
]

export const AttendanceColumns = (
    handleDelete:(data:IAttendance)=>void,
    showMember:boolean,
    showSession:boolean,
    showDelete:boolean,
):GridColDef[]=> [
    {
        field:'member',
        headerName:'Member',
        width:170,
        valueFormatter: (_, row:IAttendance) => {
            const member = row?.member as IMember;
            return member?.name;
        },
        valueGetter: (_, row:IAttendance) => {
            const member = row?.member as IMember;
            return member ? Object.values(member) : 'N/A';
        },
        renderCell:(params:GridRenderCellParams) => {
            return(
                <>
                {
                    showMember ?
                    <div className="flex items-center justify-center">
                        <Link href={params?.row?.member?._id}  className='table-link' >{params?.row?.member?.name}</Link>
                    </div>
                    :
                    <span >{params?.row?.member?.name}</span>
                }
                </>
            )  
        },
    },
    {
        field:'createdAt',
        headerName:'Time',
        width:120,
        valueFormatter: (value:string) => new Date(value)?.toLocaleDateString(),
        valueGetter: (value:string) => new Date(value)?.toLocaleDateString(),
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
        valueFormatter: (_, row:IAttendance) => {
            const session = row?.sessionId as ISession;
            return session?.name;
        },
        valueGetter: (_, row:IAttendance) => {
            const session = row?.sessionId as ISession;
            return session ? Object.values(session) : 'N/A';
        },
        renderCell:(params:GridRenderCellParams) => {
            return(
                <>
                {
                    showSession ?
                    <div className="flex items-center justify-center">
                        <Link href={`/dashboard/events/sessions/${params?.row?.sessionId._id}`} className='table-link' >{params?.row?.sessionId.name}</Link>
                    </div>
                    :
                    <span >{params?.row?.sessionId.name}</span>
                }
                </>
            )  
        },
    },
    
    
    {
        field:'_id',
        headerName:'Actions',
        width:80,
        filterable:false,
        disableExport:true,
        // params:GridRenderCellParams
        renderCell:(params:GridRenderCellParams)=> {
            // console.log(params.row?.id)
            return(
                <div className="flex h-full flex-row items-center gap-4">
                    {
                        showDelete ?
                        <IoTrashBinOutline onClick={()=>handleDelete(params?.row)}  className="cursor-pointer text-red-700" />
                        :
                        <span>None</span>
                    }
                </div>
            )
        },
    }
]