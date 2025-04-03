'use client'

import { canPerformAction, eventOrganizerRoles, eventRegistrationRoles, memberRoles } from "@/components/auth/permission/permission";
import { checkIfAdmin } from "@/components/Dummy/contants";
import { useAuth } from "@/hooks/useAuth";
import { IHubclass } from "@/lib/database/models/hubclass.model";
import { IMember } from "@/lib/database/models/member.model";
import { Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useState } from "react"
import AddButton from "@/components/features/AddButton";
import DeleteDialog from "@/components/DeleteDialog";
import { enqueueSnackbar } from "notistack";

import { useFetchChildrenrole } from "@/hooks/fetch/useChildrenrole";
import { IChildrenrole } from "@/lib/database/models/childrenrole.model";
import { deleteChildrenrole } from "@/lib/actions/childrenrole.action";
import { HubLeadersColumns } from "./HubLeadersColumn";
import HubclassLeaderModal from "./HubclassLeaderModal";

type HubLeadersTableProps = {
    hubClass:IHubclass;
}

const HubLeadersTable = ({ hubClass}:HubLeadersTableProps) => {
    const {user} = useAuth();
    const [currentRole, setCurrentRole] = useState<IChildrenrole|null>(null);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [openLeaders, setOpenLeaders] = useState<boolean>(false);
    const {refetch, roles, isPending} = useFetchChildrenrole(hubClass?._id);

    // console.log("Children: ", children)
    const roleMember = currentRole?.memberId as IMember;

    const isAdmin = checkIfAdmin(user);
    const showMember = canPerformAction(user!, 'reader', {memberRoles});
    const deleter = canPerformAction(user!, 'deleter', {eventRegistrationRoles, eventOrganizerRoles});
    const updater = canPerformAction(user!, 'updater', {eventRegistrationRoles, eventOrganizerRoles});

    const handleDelete = (data:IChildrenrole)=>{
        setCurrentRole(data);
        setDeleteMode(true);
    }

    const deleteRole = async()=>{
        try {
            if(currentRole){
                const res = await deleteChildrenrole(currentRole?._id);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                refetch();
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured removing leader from class', {variant:'error'});
        }finally{
            setDeleteMode(false);
        }
    }

    const handleOpenLeaders = ()=>{
        if(!hubClass){
            enqueueSnackbar("Please choose a class", {variant:'error'});
        }else{
            setOpenLeaders(true);
            setCurrentRole(null);
        }
    }

    const handleEdit = (data:IChildrenrole)=>{
        setOpenLeaders(true);
        setCurrentRole(data);
    }

    const message = `You're about to remove ${roleMember?.name} as ${currentRole?.title}. Proceed?`

    const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div className="flex flex-col gap-5">
        {
            updater &&
            <AddButton onClick={handleOpenLeaders} className="self-end rounded" noIcon text="Add Leader" isCancel smallText />
        }
        <HubclassLeaderModal
            infoMode={openLeaders}
            setInfoMode={setOpenLeaders}
            hubClass={hubClass}
            refetch={refetch}
            currentRole={currentRole}
            setCurrentRole={setCurrentRole}
            updater={updater}
        />
        <DeleteDialog title={`Remove ${roleMember?.name}`} message={message} onTap={deleteRole} value={deleteMode} setValue={setDeleteMode} />
        <div className="flex flex-col gap-4 w-full">
            
            <Paper className='w-full' sx={{ height: 'auto', }}>
                <DataGrid
                    loading={isPending && !!hubClass}
                    rows={roles}
                    columns={HubLeadersColumns(handleEdit, handleDelete, showMember, isAdmin, deleter)}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    getRowId={(row:IChildrenrole):string=>row._id}
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

export default HubLeadersTable