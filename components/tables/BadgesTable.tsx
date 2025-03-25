'use client'
import { BadgesColumns, checkIfAdmin } from '@/components/Dummy/contants'
import BadgeInfoModal from '@/components/features/badges/BadgeInfoModal'
// import SearchBar from '@/components/features/SearchBar'
import { searchBadge } from '@/functions/search'
import {  Paper } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { useRouter, useSearchParams } from 'next/navigation'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
// import RegistrationFilterBar from '../features/badges/RegistrationFilterBar'
import { useFetchRegistrations } from '@/hooks/fetch/useRegistration'
import { IRegistration } from '@/lib/database/models/registration.model'
import { deleteReg, getReg } from '@/lib/actions/registration.action'
import DeleteDialog from '../DeleteDialog'
// import { ErrorProps } from '@/types/Types'
import { IMember } from '@/lib/database/models/member.model'
import { enqueueSnackbar } from 'notistack'
import AddButton from '../features/AddButton'
import { useAuth } from '@/hooks/useAuth'
import {  campusRoles, canPerformAction, eventRegistrationRoles,  groupRoles,  memberRoles, roomRoles } from '../auth/permission/permission'

type BadgesTableProps = {
    // noHeader?:boolean,
    eventId:string,
    setEventId?:Dispatch<SetStateAction<string>>
}


const BadgesTable = ({eventId}:BadgesTableProps) => {
    const searchParams = useSearchParams();

    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [currentEventReg, setCurrentEventReg] = useState<IRegistration|null>(null);
    // const [deleteError, setDeleteError] = useState<ErrorProps>(null)

    const paginationModel = { page: 0, pageSize: 15 };
    const router = useRouter();
    const {user} = useAuth();

    const {registrations, loading, refetch} = useFetchRegistrations();
    const member = currentEventReg?.memberId as unknown as IMember;

  
    const handleInfo = (data:IRegistration)=>{
        setInfoMode(true);
        setCurrentEventReg(data);
    }

    const handleDelete = (data:IRegistration)=>{
        setDeleteMode(true);
        setCurrentEventReg(data);
    }

    useEffect(() => {
        const id = searchParams?.get('regId');
        if (!id) return;
    
        const fetchRegistration = async () => {
            try {
                const reg: IRegistration = await getReg(id);
                setCurrentEventReg(reg);
                setInfoMode(true);
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchRegistration();
    }, [searchParams]);
    
    // console.log(currentEventReg)


    const handleDeleteReg = async()=>{
        // setDeleteError(null);
        try {
            if(currentEventReg){
                const res  = await deleteReg(currentEventReg?._id)
                setDeleteMode(false);
                setCurrentEventReg(null);
                router.refresh();
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                refetch();
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured trying to delete the registration', {variant:'error'})
        }
    }

    const message = `You're about to remove this member from the event registrations. This will delete their attendance records as well. Are you sure of what you're doing?`
    // if(!user) return;
    const isAdmin = checkIfAdmin(user);

    const showView = canPerformAction(user!, 'reader', {eventRegistrationRoles})
    const showDelete = canPerformAction(user!, 'deleter', {eventRegistrationRoles})
    const showCampus = canPerformAction(user!, 'reader', {campusRoles});
    const showMember = canPerformAction(user!, 'reader', {memberRoles});
    const showRoom = canPerformAction(user!, 'reader', {roomRoles});
    const showGroup = canPerformAction(user!, 'reader', {groupRoles});
    const showPrint = canPerformAction(user!, 'updater', {eventRegistrationRoles});



  return (
    <div className='table-main2' >
        {
            // !noHeader &&
            <div className="flex flex-row items-start justify-end">
                {/* <RegistrationFilterBar 
                    setBadge={setBadge} setDate={setDate}
                    setRoom={setRoom} reset={reset}
                /> */}
                {
                    showPrint &&
                    <AddButton smallText text='Print Badges' onClick={()=>router.push('/dashboard/events/badges/new')} className='py-2 rounded' noIcon  />
                }
            </div>
        }


        <DeleteDialog onTap={handleDeleteReg} title={`Delete ${member?.name}`}  value={deleteMode} setValue={setDeleteMode} message={message} />
        <BadgeInfoModal user={user!} infoMode={infoMode} setInfoMode={setInfoMode} currentEventReg={currentEventReg} setCurrentEventReg={setCurrentEventReg} />
        {/* table */}

        <div className="flex flex-col gap-2">
           
        <div className="">
            <Paper  className='w-full' sx={{ height: 'auto', }}>
                <DataGrid
                    getRowId={(row:IRegistration)=>row._id}
                    rows={searchBadge(registrations, eventId)}
                    columns={BadgesColumns(handleInfo, handleDelete, showView, showDelete, isAdmin, showCampus, showMember, showRoom, showGroup)}
                    initialState={{ 
                        pagination: { paginationModel },
                        columns:{
                            columnVisibilityModel:{
                                email:false,
                                ageRange:false,
                                gender:false,
                                phone:false,
                                mstatus:false,
                                marital:false,
                                employ:false,
                                voice:false,
                                role:false,
                                church:false,
                                campus:false,
                                createdAt:false,
                            }
                        } 
                    }}
                    pageSizeOptions={[5, 10, 15, 20, 50, 100]}
                    // checkboxSelection
                    className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                    sx={{ border: 0 }}
                    slots={{toolbar:GridToolbar}}
                    loading={loading}
                    slotProps={{
                        toolbar:{
                            showQuickFilter:true,
                            printOptions:{
                                hideFooter:true,
                                hideToolbar:true,
                            }
                        }
                    }}
                />
            </Paper>
            
        </div>
    </div>
    </div>
  )
}

export default BadgesTable