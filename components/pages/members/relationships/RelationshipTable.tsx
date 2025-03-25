'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import SearchBar from "@/components/features/SearchBar";
import AddButton from "@/components/features/AddButton";
// import { ErrorProps } from "@/types/Types";
import { IRelationship } from "@/lib/database/models/relationship.model";
import { deleteRelationship, getRelationship } from "@/lib/actions/relationship.action";
// import SearchSelectChurch from "@/components/shared/SearchSelectChurch";
import DeleteDialog from "@/components/DeleteDialog";
import NewRelationship from "@/components/misc/NewRelationship";
import RelationshipInfoModal from "./RelationshipInfoModal";
import { RelationshipColumns } from "./RelationshipColumns";
import { SearchRelationshipV2 } from "./fxn";
import { useFetchRelationship } from "@/hooks/fetch/useRelationship";
import { useAuth } from "@/hooks/useAuth";
import { enqueueSnackbar } from "notistack";
import { canPerformAction,  isSuperUser, isSystemAdmin, memberRoles, relationshipRoles } from "@/components/auth/permission/permission";
import SearchSelectChurchesV3 from "@/components/features/SearchSelectChurchesV3";

const RelationshipTable = () => {
    const [currentRelationship, setCurrentRelationship] = useState<IRelationship|null>(null);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [newMode, setNewMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    // const [search, setSearch] = useState<string>('');
    const [churchId, setChurchId] = useState<string>('');
    // const [response, setReponse] = useState<ErrorProps>(null);

    const {relationships, isPending, refetch} = useFetchRelationship();
    const {user} = useAuth();
    const router = useRouter();

    const searchParams = useSearchParams();

    const showRelAdd = canPerformAction(user!, 'creator', {relationshipRoles});
    const showRelRead = canPerformAction(user!, 'creator', {relationshipRoles});
    const showRelDelete = canPerformAction(user!, 'deleter', {relationshipRoles});
    const showRelEdit = canPerformAction(user!, 'updater', {relationshipRoles});
    const admin = canPerformAction(user!, 'admin', {relationshipRoles});
    const showMember = canPerformAction(user!, 'reader', {memberRoles});

    const isAdmin = isSystemAdmin.reader(user!) || isSuperUser(user!);

    useEffect(()=>{
        if(user && !admin){
            router.replace('/dashboard/forbidden?p=Relationship Admin')
        }
    },[user, admin, router])


   
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
                setDeleteMode(false);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                refetch();
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured removing relationship', {variant:'error'});
        }
    }

    const handleOpenNew = () =>{
        setNewMode(true);
        setCurrentRelationship(null);
    }
    
    const message = `You're about to delete this relationsip. Do you want to continue?`
    
    const cId = (isAdmin ? churchId : user?.churchId) as string;
    
    if(!admin) return;

    
    return (
      <div className='table-main2' >
          <div className="flex flex-col gap-5 lg:flex-row items-start lg:justify-between w-full">
            {
                isAdmin &&
                <SearchSelectChurchesV3 setSelect={setChurchId} />
            }
            <div className="flex flex-row gap-4  items-center px-0 lg:px-4">
                {
                    showRelAdd &&
                    <AddButton onClick={handleOpenNew} smallText text='Add Relationship' noIcon className='rounded py-1' />
                }
            </div>
          </div> 
          <RelationshipInfoModal currentRelationship={currentRelationship} setCurrentRelationship={setCurrentRelationship} infoMode={infoMode} setInfoMode={setInfoMode} />
          <DeleteDialog value={deleteMode} setValue={setDeleteMode} title={`Delete Relationship`} message={message} onTap={handleDeleteRelationship} />
          <NewRelationship refetch={refetch} currentRelationship={currentRelationship}  infoMode={newMode} setInfoMode={setNewMode} />
  
            {/* {
                response?.message &&
                <Alert severity={response.error ? 'error':'success'} >{response.message}</Alert>
            } */}
          <div className="flex w-full">
            {
                <Paper className='w-full' sx={{ height: 'auto', }}>
                    <DataGrid
                        rows={SearchRelationshipV2(relationships, cId)}
                        columns={RelationshipColumns(handleEdit, hadndleInfo,  hadndleDelete, showRelRead, showRelDelete, showRelEdit, showMember, isAdmin)}
                        initialState={{ 
                            pagination: { paginationModel },
                            columns:{
                                columnVisibilityModel:{
                                    churchId:false
                                }
                            } 
                        }}
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

export default RelationshipTable