'use client'
import React, { ReactNode } from 'react'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';

const queryClient = new QueryClient();

export default function Providers({children}:{children:ReactNode}){
  return (
    <QueryClientProvider client={queryClient} >
      <SnackbarProvider maxSnack={3} anchorOrigin={{vertical:'top', horizontal:'right'}} >
        {children}
      </SnackbarProvider> 
    </QueryClientProvider>
  )
}
