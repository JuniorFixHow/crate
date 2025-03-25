'use client'

import {   Paper } from "@mui/material";
import { DataGrid, gridFilteredSortedRowIdsSelector, GridToolbar, gridVisibleColumnFieldsSelector, useGridApiRef } from "@mui/x-data-grid";
// import SearchBar from "@/components/features/SearchBar";
import AddButton from "@/components/features/AddButton";
// import SearchSelectEvents from "@/components/features/SearchSelectEvents";
import DeleteDialog from "@/components/DeleteDialog";
import RevenueInfoModal from "./RevenueInfoModal";
import NewRevenue from "./NewRevenue";
// import { ErrorProps } from "@/types/Types";
import { IPayment } from "@/lib/database/models/payment.model";
import { useFetchRevenues } from "@/hooks/fetch/useRevenue";
import { deletePayment } from "@/lib/actions/payment.action";
import { RevenueColumns } from "./RevenueCoulmns";
// import SearchSelectZones from "@/components/features/SearchSelectZones";
// import SearchSelectChurchForRoomAss from "@/components/features/SearchSelectChurchForRoomAss";
import { calcTotalRevenue,  } from "./fxn";
import { useEffect, useState } from "react";
// import SearchSelectGlobal from "@/components/features/SearchSelectGlobal";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useAuth } from "@/hooks/useAuth";
import { canPerformAction, churchRoles, eventRoles, memberRoles, paymentRoles, userRoles } from "@/components/auth/permission/permission";

const RevenueTable = () => {
    const {user} = useAuth();
    const router = useRouter();
    const [currentRevenue, setCurrentRevenue] = useState<IPayment|null>(null);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [newMode, setNewMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [eventId, setEventId] = useState<string>('');
    
    const [filteredRows, setFilteredRows] = useState<IPayment[]>([]);

    const searchParams = useSearchParams();

    const {revenues, loading, refetch} = useFetchRevenues();
    const apiRef = useGridApiRef();
    // console.log(revenues)
    const creator = canPerformAction(user!, 'creator', {paymentRoles});
    const reader = canPerformAction(user!, 'reader', {paymentRoles});
    const updater = canPerformAction(user!, 'updater', {paymentRoles});
    const deleter = canPerformAction(user!, 'deleter', {paymentRoles});
    const admin = canPerformAction(user!, 'admin', {paymentRoles});

    // const isAdmin = isSuperUser(user!) || isSystemAdmin.reader(user!);

    const showMember = canPerformAction(user!, 'reader', {memberRoles});
    const showUser = canPerformAction(user!, 'reader', {userRoles});
    const showEvent = canPerformAction(user!, 'reader', {eventRoles});
    const showChurch = canPerformAction(user!, 'reader', {churchRoles});

    useEffect(()=>{
        if(user && !admin){
            router.replace('/dashboard/forbidden?p=Payment Admin');
        }
    },[admin, user, router])
   
    useEffect(() => {
        const fetchChurch = async () => {
          const data = searchParams?.get('eventId');
          if (data) {
            setEventId(data);
          }
        };  
        fetchChurch(); 
      }, [searchParams]);

    const paginationModel = { page: 0, pageSize: 10 };

    const handleNewRevenue = (data:IPayment)=>{
        setCurrentRevenue(data);
        setNewMode(true);
    }

    const hadndleInfo = (data:IPayment)=>{
        setCurrentRevenue(data);
        setInfoMode(true);
    }
    const hadndleDelete = (data:IPayment)=>{
        setCurrentRevenue(data);
        setDeleteMode(true);
    }

    const handleDeleteRevenue = async()=>{
        try {
            if(currentRevenue){
                const res  = await deletePayment(currentRevenue._id);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                refetch();
                setDeleteMode(false);
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured deleting payment', {variant:'error'})
        }
    }

    const handleOpenNew = () =>{
        setNewMode(true);
        setCurrentRevenue(null);
    }

    const message = `You're about to delete payment information. Are you sure?`;

    const link = process.env.NEXT_PUBLIC_PAYMENT_LINK;

    const getFilteredRows = () => {
        const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
        const visibleColumnsField = gridVisibleColumnFieldsSelector(apiRef);
    
        const data = filteredSortedRowIds.map(id => {
            const row: Record<string, unknown> = {}; // Explicitly define the object as a dictionary
    
            visibleColumnsField.forEach((field: string) => {
                row[field] = apiRef.current.getCellParams(id, field).value;
            });
    
            return row;
        });
    
        return data;
    };

    if(!admin) return;

    return (
      <div className='table-main2' >

         <div className="flex items-center justify-between w-full">
            <div className="flex justify-between items-end w-full" >
                
                {
                    filteredRows?.length > 0 &&
                    <div className="flex gap-4">
                        <span className="font-bold" >Received:</span>
                        <span>${calcTotalRevenue(filteredRows)}</span>
                    </div>
                }
            </div>
         </div>

          <div className="flex flex-col items-center gap-5 md:flex-row md:justify-end w-full">
            {
                creator &&
                <div className="flex flex-row gap-4  items-center px-0 lg:px-4">
                    <AddButton onClick={handleOpenNew} smallText text='Record Payment' noIcon className='rounded' />
                    <Link href={link!} target='_blank' >
                        <AddButton smallText text='Pay Online' noIcon className='rounded' />
                    </Link>
                </div>
            }
          </div> 
          <RevenueInfoModal currentRevenue={currentRevenue} setCurrentRevenue={setCurrentRevenue} infoMode={infoMode} setInfoMode={setInfoMode} />
          <DeleteDialog value={deleteMode} setValue={setDeleteMode} title={`Delete Payment`} message={message} onTap={handleDeleteRevenue} />
          <NewRevenue updater={updater} currentRevenue={currentRevenue} setCurrentRevenue={setCurrentRevenue} infoMode={newMode} setInfoMode={setNewMode} />
  
           
          <div className="flex w-full">
            <Paper className='w-full' sx={{ height: 'auto', }}>
                <DataGrid
                    rows={revenues}
                    apiRef={apiRef}
                    
                    columns={RevenueColumns(hadndleInfo,  hadndleDelete, handleNewRevenue, reader, updater, deleter, showChurch, showMember, showUser, showEvent)}
                    initialState={{ 
                        pagination: { paginationModel },
                        columns:{
                            columnVisibilityModel:{
                                purpose:false,
                                church:false,
                                payee:false
                            }
                        },
                        filter:{
                            filterModel:{
                                items:[
                                    {
                                        field:'eventId', operator:'contains', value:eventId
                                    }
                                ]
                            }
                        }
                    }}
                    pageSizeOptions={[5, 10, 15, 20, 30, 50]}
                    slots={{
                        toolbar:GridToolbar
                    }}
                    loading={loading}
                    onFilterModelChange={(item)=>{
                        
                        const rows = getFilteredRows() as unknown as IPayment[];
                        setFilteredRows(rows);
                        console.log(item);
                    }}
                
                    
                    slotProps={{
                        toolbar:{
                            showQuickFilter:true,
                            printOptions:{
                            // disableToolbarButton:false,
                            hideToolbar:true,
                            hideFooter:true,
                            
                            }
                        }
                        }}
                    getRowId={(row:IPayment):string=>row._id}
                    // checkboxSelection
                    className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                    sx={{ border: 0 }}
                />
            </Paper>
            
          </div>
  
      </div>
    )
}

export default RevenueTable