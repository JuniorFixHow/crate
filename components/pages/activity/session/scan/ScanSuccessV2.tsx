import Image from 'next/image'
import React, { Dispatch, SetStateAction,} from 'react'
import { ErrorProps } from '@/types/Types'
import { Alert, CircularProgress } from '@mui/material'
import { IMember } from '@/lib/database/models/member.model'
import AddButton from '@/components/features/AddButton'

type ScanSuccessV2Props = {
    setStage:Dispatch<SetStateAction<number>>,
    result:ErrorProps,
    loading:boolean
}

const ScanSuccessV2 = ({setStage, loading, result}:ScanSuccessV2Props) => {
    const res = result?.payload as IMember;
//   const res:Partial<IMember>|undefined = result?.payload;

  return (
    <div className='flex-center gap-5 flex-col h-[50vh] bg-white border rounded dark:bg-[#0F1214] p-4' >
      {
        loading ? 
        <CircularProgress size='2rem' />
        :
        <>
          <Image src={result?.error ? '/4989865.png':'/scan.png'} alt='scan' height={100} width={100} />
          {
            result?.message &&
            <Alert severity={result.error?'error':'success'} variant='standard' >{result.message}</Alert>
          }
          {
            !result?.error &&
            <span className='font-semibold text-gray-600' >{res?.name}</span>
          }
          <AddButton onClick={()=>setStage(2)} text='Scan Again' noIcon smallText className='mt-2 rounded-full px-8 py-1 w-fit font-semibold' />
        </>
      }
    </div>
  )
}

export default ScanSuccessV2