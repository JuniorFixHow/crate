'use client'
import SearchSelectEventsV2 from '@/components/features/SearchSelectEventsV2'
import Subtitle from '@/components/features/Subtitle'
import { useFetchExpectedIncome } from '@/hooks/fetch/useRevenue'
import { IExpectedRevenue } from '@/types/Types'
import { Paper } from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import { IncomeColumns } from './IncomeCulumns'
import { useAuth } from '@/hooks/useAuth'
import { canPerformAction,  churchRoles,  isSuperUser,  isSystemAdmin,  paymentRoles } from '@/components/auth/permission/permission'
import { useRouter } from 'next/navigation'

const IncomeTable = () => {
  const {user} = useAuth();
  const [eventId, setEventId] = useState<string>('');
  const {income, isPending} = useFetchExpectedIncome(eventId);
  // console.log(income[0])
  const router = useRouter();

  const reader = (canPerformAction(user!, 'reader', {paymentRoles}) && isSystemAdmin.reader(user!)) || isSuperUser(user!);
  const showChurch = canPerformAction(user!, 'reader', {churchRoles});

  useEffect(()=>{
    if(user && !reader){
      router.replace('/dashboard/forbidden?p=Global Reader')
    }
  },[reader, user, router])

  const paginationModel = { page: 0, pageSize: 15 };

  if(!reader) return;
  return (
    <div className='table-main2' >
      <Subtitle text='Income' />
      <SearchSelectEventsV2 setSelect={setEventId} />
      <Paper className='bg-blue-300' sx={{ height: 'auto', }}>
          <DataGrid
              rows={income}
              getRowId={(row:IExpectedRevenue):string=>row.church?._id}
              columns={IncomeColumns(showChurch)}
              initialState={{ pagination: { paginationModel },  
              // scroll: { top: 1000, left: 1000 },
              columns:{
                columnVisibilityModel:{
                  adp:false,
                  chp:false
                }
              }
            }}
              pageSizeOptions={[5, 10, 15, 20, 50, 100]}
              // dis
              slots={{toolbar:GridToolbar}}
              loading={!!eventId && isPending}
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
  )
}

export default IncomeTable