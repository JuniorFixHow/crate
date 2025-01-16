import AddButton from "@/components/features/AddButton";
import SearchBar from "@/components/features/SearchBar";
import { searchMember } from "@/functions/search";
import { useFetchMembersForActivities } from "@/hooks/fetch/useActivity";
import { addMembersToActivity } from "@/lib/actions/activity.action";
import { IMember } from "@/lib/database/models/member.model";
import { ErrorProps } from "@/types/Types";
import { Alert, LinearProgress, Modal, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Dispatch, SetStateAction, useState } from "react";
import { SingleActivityAddMemberColumns } from "./SingleActivityAddMemberColumns";

type SingleActAddMemberProps={
    showMember:boolean;
    setShowMember:Dispatch<SetStateAction<boolean>>;
    actId:string;
}

const SingleActAddMember = ({showMember, setShowMember, actId}:SingleActAddMemberProps) => {
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [search, setSearch] = useState<string>('');
    const [response, setResponse] = useState<ErrorProps>(null);
    const [addLoading, setAddLoading] = useState<boolean>(false);
    const {loading, members} = useFetchMembersForActivities(actId);

    const handleSelect = (id:string)=>{
        setSelectedMembers((prev)=>{
            return prev.includes(id) ?
            prev.filter((item)=> item !== id)
            :
            [...prev, id]
        });
    }

    const handleClose = ()=>{
        setShowMember(false);
    }

    const addMembers = async()=>{
        try {
            setAddLoading(true);
            const res = await addMembersToActivity(actId, selectedMembers) as ErrorProps;
            setResponse(res);
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured adding members', error:true});
        }finally{
            setAddLoading(false);
        }
    }

    const paginationModel = { page: 0, pageSize: 10 };

  return (
    <Modal
        open={showMember}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="flex-center"
        >
        <div className="flex flex-col rounded p-6 bg-white dark:bg-[#0F1214] dark:border w-[90%] lg:w-[60%]">
            <div className="flex gap-4 items-center">
                <span className="text-[0.9rem] dark:text-white" >Selected members: <span className="font-semibold" >{selectedMembers.length}</span></span>
            </div>

            <div className="flex w-full flex-col gap-4">
                <div className="flex items-start justify-end gap-4">
                    <SearchBar reversed={false} setSearch={setSearch} />
                    {
                        selectedMembers.length > 0 &&
                        <AddButton onClick={addMembers} disabled={addLoading}  className="rounded" noIcon smallText text={addLoading ? 'loading...':'Proceed'} />
                    }
                    <AddButton onClick={handleClose} isCancel disabled={addLoading}  className="rounded" noIcon smallText text="Cancel" />
                </div>
                {
                    response?.message &&
                    <Alert onClose={()=>setResponse(null)} severity={response.error ? 'error':'success'} >{response.message}</Alert>
                }
                <div className="flex w-full">
                    {
                        loading ?
                        <LinearProgress className="w-full" />
                        :
                        <Paper className='w-full' sx={{ height: 480, }}>
                        <DataGrid
                            rows={searchMember(search, members)}
                            columns={SingleActivityAddMemberColumns(selectedMembers, handleSelect)}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[5, 10, 15, 20, 30, 50]}
                            getRowId={(row:IMember)=>row._id}
                            // checkboxSelection
                            className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                            sx={{ border: 0 }}
                        />
                    </Paper>
                    }
                </div>
            </div>
        </div>
    </Modal>
  )
}

export default SingleActAddMember