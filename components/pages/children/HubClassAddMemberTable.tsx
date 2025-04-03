'use client'

import { canPerformAction, isSuperUser, isSystemAdmin, memberRoles } from "@/components/auth/permission/permission";
import AddButton from "@/components/features/AddButton";
import { useFetchMembersForHubClass } from "@/hooks/fetch/useHubclass";
import { useAuth } from "@/hooks/useAuth";
import { addMemberToHubclass } from "@/lib/actions/hubclass.action";
import { IMember } from "@/lib/database/models/member.model";
import { Modal, Paper } from "@mui/material"
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { enqueueSnackbar } from "notistack";
import { Dispatch, SetStateAction, useState } from "react"
import { HubClassAddMemberColumns } from "./HubClassAddMemberCoulmns";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import Hubclass, { IHubclass } from "@/lib/database/models/hubclass.model";

type HubClassAddMemberTableProps={
    hubClass:IHubclass,
    eventId:string;
    openMembers:boolean;
    setOpenMembers:Dispatch<SetStateAction<boolean>>;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<IHubclass[], Error>>;
}

const HubClassAddMemberTable = ({hubClass, eventId, refetch, openMembers, setOpenMembers}:HubClassAddMemberTableProps) => {
    const {user} = useAuth();
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    
    const [addLoading, setAddLoading] = useState<boolean>(false);

    const {members, loading, refetch:reload} = useFetchMembersForHubClass(eventId);

    const showMember = canPerformAction(user!, 'reader', {memberRoles});
    const isAdmin = isSuperUser(user!) || isSystemAdmin.reader(user!);

    const handleClose = ()=>{
        setOpenMembers(false);
    }

    const addMembers = async()=>{
        try {
            setAddLoading(true);
            const res = await addMemberToHubclass(hubClass?._id, selectedMembers)
            enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
            refetch();
            reload();
            setOpenMembers(false);
            setSelectedMembers([]);
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured adding members to the class');
        }finally{
            setAddLoading(false);
            setOpenMembers(false);
        }
    }

    const handleSelect =(id:string)=>{
        setSelectedMembers((pre)=>{
            const selected = pre.find((item)=> item === id);

            return selected ? pre.filter((item)=> item !== id)
            :
            [...pre, id]
        })
    }

    const paginationModel = { page: 0, pageSize: 10 };

  return (
    <Modal
        open={openMembers}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="flex-center"
        >
        <div className="flex flex-col rounded p-6 bg-white dark:bg-[#0F1214] dark:border w-[90%] lg:w-[60%]">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <span className="text-[1.2rem] font-semibold" >{hubClass?.title}</span>
                <span className="text-[0.9rem] dark:text-white" >Selected members: <span className="font-semibold" >{selectedMembers.length}</span></span>
            </div>

            <div className="flex w-full flex-col gap-4">
                <div className="flex justify-end gap-4">
                    {
                        selectedMembers.length > 0 &&
                        <AddButton onClick={addMembers} disabled={addLoading}  className="rounded" noIcon smallText text={addLoading ? 'loading...':'Proceed'} />
                    }
                    <AddButton onClick={handleClose} isCancel disabled={addLoading}  className="rounded" noIcon smallText text="Cancel" />
                </div>
                {/* {
                    response?.message &&
                    <Alert onClose={()=>setResponse(null)} severity={response.error ? 'error':'success'} >{response.message}</Alert>
                } */}
                <div className="flex w-full">
                    <Paper className='w-full' sx={{ height: 480, }}>
                        <DataGrid
                            rows={members}
                            columns={HubClassAddMemberColumns(handleSelect, selectedMembers, showMember, isAdmin)}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[5, 10]}
                            getRowId={(row:IMember)=>row._id}
                            loading={loading && !!eventId}
                            slots={{toolbar:GridToolbar}}
                            slotProps={{
                                toolbar:{
                                    showQuickFilter:true,
                                    printOptions:{
                                        hideFooter:true,
                                        hideToolbar:true
                                    }
                                }
                            }}
                            disableDensitySelector
                            // checkboxSelection
                            className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                            sx={{ border: 0 }}
                        />
                    </Paper>
                </div>
            </div>
        </div>
    </Modal>
  )
}

export default HubClassAddMemberTable