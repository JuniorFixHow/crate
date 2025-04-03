'use client'

import { canPerformAction, eventOrganizerRoles, eventRegistrationRoles, memberRoles } from "@/components/auth/permission/permission";
import { checkIfAdmin } from "@/components/Dummy/contants";
import { useAuth } from "@/hooks/useAuth";
import { IHubclass } from "@/lib/database/models/hubclass.model";
import { IMember } from "@/lib/database/models/member.model";
import { Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { useState } from "react"
import { HubMembersColumns } from "./HubMembersColumn";
import AddButton from "@/components/features/AddButton";
import DeleteDialog from "@/components/DeleteDialog";
import { enqueueSnackbar } from "notistack";
import { removeMemberFromHubclass } from "@/lib/actions/hubclass.action";
import HubClassAddMemberTable from "./HubClassAddMemberTable";
import { useFetchMembersForHubClass } from "@/hooks/fetch/useHubclass";

type HubMembersTableProps = {
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<IHubclass[], Error>>;
    loading:boolean;
    hubClass:IHubclass;
    eventId:string;
}

const HubMembersTable = ({ hubClass, eventId, refetch, loading}:HubMembersTableProps) => {
    const {user} = useAuth();
    const [currentMember, setCurrentMember] = useState<IMember|null>(null);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [openMembers, setOpenMembers] = useState<boolean>(false);
    const {refetch:reload} = useFetchMembersForHubClass(eventId);

    const children = hubClass?.children as IMember[];
    // console.log("Children: ", children)

    const isAdmin = checkIfAdmin(user);
    const showMember = canPerformAction(user!, 'reader', {memberRoles});
    const deleter = canPerformAction(user!, 'deleter', {eventRegistrationRoles, eventOrganizerRoles});
    const updater = canPerformAction(user!, 'updater', {eventRegistrationRoles, eventOrganizerRoles});

    const handleDelete = (data:IMember)=>{
        setCurrentMember(data);
        setDeleteMode(true);
    }

    const deleteMember = async()=>{
        try {
            if(currentMember){
                const res = await removeMemberFromHubclass(hubClass?._id, [currentMember?._id]);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                refetch();
                reload();
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured removing member from class', {variant:'error'});
        }finally{
            setDeleteMode(false);
        }
    }

    const handleOpenMembers = ()=>{
        if(!hubClass){
            enqueueSnackbar("Please choose a class", {variant:'error'});
        }else{
            setOpenMembers(true);
        }
    }

    const message = `You're about to remove ${currentMember?.name} from '${hubClass?.title}' calss. Proceed?`

    const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div className="flex flex-col gap-5">
        {
            updater &&
            <AddButton onClick={handleOpenMembers} className="self-end rounded" noIcon text="Add Members" isCancel smallText />
        }
        <HubClassAddMemberTable refetch={refetch!} eventId={eventId} hubClass={hubClass} openMembers={openMembers} setOpenMembers={setOpenMembers} />
        <DeleteDialog title={`Remove ${currentMember?.name}`} message={message} onTap={deleteMember} value={deleteMode} setValue={setDeleteMode} />
        <div className="flex flex-col gap-4 w-full">
            
            <Paper className='w-full' sx={{ height: 'auto', }}>
                <DataGrid
                    loading={loading}
                    rows={children}
                    columns={HubMembersColumns(handleDelete, showMember, isAdmin, deleter)}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    getRowId={(row:IMember):string=>row._id}
                    slots={{
                        toolbar:GridToolbar
                    }}
                    slotProps={{
                        toolbar:{
                            printOptions:{
                                hideFooter:true,
                                hideToolbar:true
                            },
                            showQuickFilter:true
                        }
                    }}
                    // checkboxSelection
                    className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                    sx={{ border: 0 }}
                />
            </Paper>
        </div>
    </div>
  )
}

export default HubMembersTable