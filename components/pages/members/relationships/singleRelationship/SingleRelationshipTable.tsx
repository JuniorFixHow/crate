'use client'

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {  Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import SearchBar from "@/components/features/SearchBar";
import AddButton from "@/components/features/AddButton";
// import { ErrorProps } from "@/types/Types";
import { IRelationship } from "@/lib/database/models/relationship.model";
import { deleteRelationship, getRelationship } from "@/lib/actions/relationship.action";
import DeleteDialog from "@/components/DeleteDialog";
import NewRelationship from "@/components/misc/NewRelationship";

// import { useFetchMemberRelationships } from "@/hooks/fetch/useRelationship";
// import { SearchSingleRelationship } from "../fxn";
import { SingleRelationshipColumns } from "./SingleRelationshipColumns";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { IMember } from "@/lib/database/models/member.model";
import { enqueueSnackbar } from "notistack";
import { useAuth } from "@/hooks/useAuth";
import { isChurchAdmin, memberRoles, relationshipRoles } from "@/components/auth/permission/permission";
import { checkIfAdmin } from "@/components/Dummy/contants";
import SingleRelationshipInfoModal from "./SingleRelationshipInfoModal";

type SingleRelationshipTableProps = {
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<IRelationship[], Error>>;
    relationships: IRelationship[];
    isPending:boolean;
    member:IMember
}

const SingleRelationshipTable = ({refetch, relationships, member, isPending}:SingleRelationshipTableProps) => {
    const [currentRelationship, setCurrentRelationship] = useState<IRelationship|null>(null);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [newMode, setNewMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    // const [search, setSearch] = useState<string>('');
    // const [response, setReponse] = useState<ErrorProps>(null);
    const {user} = useAuth();

    

    const searchParams = useSearchParams();

   
    useEffect(() => {
        const fetchRelationship = async () => {
          const data = searchParams?.get('id');
          if (data) {
            const rel: IRelationship = await getRelationship(data); // Await the promise
            setCurrentRelationship(rel);
            setInfoMode(true);
          }
        };
      
        fetchRelationship(); // Call the async function
      }, [searchParams]);

    const paginationModel = { page: 0, pageSize: 10 };

    const handleEdit = (data:IRelationship)=>{
        setCurrentRelationship(data);
        setNewMode(true);
    }

   

    const hadndleInfo = (data:IRelationship)=>{
        setCurrentRelationship(data);
        setInfoMode(true);
    }
    const hadndleDelete = (data:IRelationship)=>{
        setCurrentRelationship(data);
        setDeleteMode(true);
    }

    const handleDeleteRelationship = async()=>{
        try {
            if(currentRelationship){
                const res = await deleteRelationship(currentRelationship._id);
                // setReponse(res);
                setDeleteMode(false)
                refetch();
                enqueueSnackbar(res?.message, {variant:res?.error?'error':'success'})
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured removing relationship', {variant:'error'})
        }
    }

    const handleOpenNew = () =>{
        setNewMode(true);
        setCurrentRelationship(null);
    }

    const message = `You're about to delete this relationsip. Do you want to continue?`;
    if(!user) return;
    
    const isAdmin = checkIfAdmin(user);
    const showRelAdd = isAdmin || isChurchAdmin.creator(user) || relationshipRoles.creator(user);
    const showRelRead = isAdmin || isChurchAdmin.reader(user) || relationshipRoles.reader(user);
    const showRelDelete = isAdmin || isChurchAdmin.deleter(user) || relationshipRoles.deleter(user);
    const showRelEdit = isAdmin || isChurchAdmin.updater(user) || relationshipRoles.updater(user);
    const showMember = isAdmin || isChurchAdmin.reader(user) || memberRoles.reader(user);

    return (
      <div className='table-main2' >
          <div className="flex flex-col gap-5 lg:flex-row items-start justify-end w-full">
            {/* <SearchSelectChurch setSelect={setChurchId} isGeneric /> */}
            <div className="flex flex-row gap-4  items-center px-0 lg:px-4">
                {
                    showRelAdd &&
                    <AddButton onClick={handleOpenNew} smallText text='Add Relationship' noIcon className='rounded py-1' />
                }
            </div>
          </div> 
          <SingleRelationshipInfoModal currentMember={member} noChurch currentRelationship={currentRelationship} setCurrentRelationship={setCurrentRelationship} infoMode={infoMode} setInfoMode={setInfoMode} />
          <DeleteDialog value={deleteMode} setValue={setDeleteMode} title={`Delete Relationship`} message={message} onTap={handleDeleteRelationship} />
          <NewRelationship fixedSelection={[member]} refetch={refetch} currentRelationship={currentRelationship}  infoMode={newMode} setInfoMode={setNewMode} />
  
            {/* {
                response?.message &&
                <Alert severity={response.error ? 'error':'success'} >{response.message}</Alert>
            } */}
          <div className="flex w-full">
            {
                <Paper className='w-full' sx={{ height: 'auto', }}>
                    <DataGrid
                        rows={relationships}
                        columns={SingleRelationshipColumns(handleEdit, hadndleInfo,  hadndleDelete, member, showRelRead, showRelDelete, showRelEdit, showMember)}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10, 15, 20, 30, 50]}
                        getRowId={(row:IRelationship):string=>row._id}
                        loading={isPending}
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
                        // checkboxSelection
                        className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                        sx={{ border: 0 }}
                    />
                </Paper>
            }
          </div>
  
      </div>
    )
}

export default SingleRelationshipTable