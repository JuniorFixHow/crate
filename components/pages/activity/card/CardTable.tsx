'use client'
import DeleteDialog from '@/components/DeleteDialog';
import { IMember } from '@/lib/database/models/member.model';
import { Alert,  Paper } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import  {  useState } from 'react'
import { ErrorProps } from '@/types/Types';

import Link from 'next/link';
// import { ExcelButton } from '@/components/features/Buttons';
import AddButton from '@/components/features/AddButton';
import { ICard } from '@/lib/database/models/card.model';
import { deleteCard } from '@/lib/actions/card.action';
import { enqueueSnackbar } from 'notistack';
import { useFetchCards } from '@/hooks/fetch/useCard';
import { CardColumns } from './CardColumns';
// import CardInfoModal from './CardInfoModal';
import NewCard from './NewCard';



const MembersTable = () => {
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    // const [infoMode, setInfoMode] = useState<boolean>(false);
    const [newMode, setNewMode] = useState<boolean>(false);
    const [selection, setSelection] = useState<ICard[]>([]);
    const [currentCard, setCurrentCard] = useState<ICard|null>(null);
    const [deleteState, setDeleteState]= useState<ErrorProps>(null);
    // const [excelMode, setExcelMode] = useState<boolean>(false);
    
    const paginationModel = { page: 0, pageSize: 15 };
    // console.log(searchMember(search, members))

    const {cards, loading, refetch} = useFetchCards();
    const member = currentCard?.member as IMember;
    

    const handleSelect = (card:ICard)=>{
      setSelection((prev)=>{
        const selected = prev.find((item)=>item._id === card._id);
        return selected ? prev.filter((item)=>item._id !== card._id)
        :
        [...prev, card]
      })
    }     

    const handleDelete=(data:ICard)=>{
        setDeleteMode(true);
        setCurrentCard(data);
    }

    // const handleInfo=(data:ICard)=>{
    //     setInfoMode(true);
    //     setCurrentCard(data);
    // }

    const handleEdit=(data:ICard)=>{
        setNewMode(true);
        setCurrentCard(data);
    }

    const handleNew=()=>{
        setNewMode(true);
        setCurrentCard(null);
    }

    const handleDeleteMember = async()=>{
        setDeleteState(null)
        if(currentCard){
          try {
            const res = await deleteCard(currentCard._id);
            setDeleteMode(false);
            setCurrentCard(null);
            enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
            refetch();
          } catch (error) {
            console.log(error)
            enqueueSnackbar('Error occured deleting member', {variant:'error'});
          }
        }
      }



    const message=`Are you sure you want to delete this card?`

  return (
    <div className='table-main2' >
        <div className="flex flex-col gap-2 md:flex-row items-center justify-between">
            <span className='font-bold text-xl' >Members</span>
            <div className="flex gap-3 items-center">
              {
                selection?.length > 0 &&
                <AddButton noIcon isCancel onClick={handleNew} text='Preview' smallText className="w-fit rounded"  />
              }
              <AddButton onClick={handleNew} text='Add Card' smallText className="w-fit rounded"  />
              <Link href={`/dashboard/members/new`} >
              </Link>
            </div>
        </div>

        {
            deleteState?.message &&
            <Alert onClose={()=>setDeleteState(null)} severity={deleteState.error ? 'error':'success'} >{deleteState.message}</Alert>
        }
        <DeleteDialog title={`Delete ${member?.name}'s card`} value={deleteMode} setValue={setDeleteMode} message={message} onTap={handleDeleteMember} />
        {/* <CardInfoModal infoMode={infoMode} setInfoMode={setInfoMode} currentCard={currentCard} setCurrentCard={setCurrentCard} /> */}
        <NewCard editMode={newMode} setEditMode={setNewMode} currentCard={currentCard} setCurrentCard={setCurrentCard} />
        {/* <MemberImportModal infoMode={excelMode} setInfoMode={setExcelMode} /> */}
        <div className="flex flex-col ">
        
          <Paper className='bg-blue-300' sx={{ height: 'auto', }}>
              <DataGrid
                  rows={cards}
                  getRowId={(row:ICard):string=>row._id}
                  columns={CardColumns( handleEdit ,handleDelete, handleSelect, selection )}
                  initialState={{ pagination: { paginationModel },  
                  // scroll: { top: 1000, left: 1000 },
                }}
                  pageSizeOptions={[5, 10, 15, 20, 50, 100]}
                  // dis
                  slots={{toolbar:GridToolbar}}
                  loading={loading}
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
                  // checkboxSelection
                  className='dark:bg-[#0F1214] dark:border-slate-200 dark:border dark:text-[#3C60CA]'
                  sx={{ border: 0,}}
              />
          </Paper>
        </div>
    </div>
  )
}

export default MembersTable