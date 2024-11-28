import Image from 'next/image'
import React, { Dispatch, SetStateAction,} from 'react'
import AddButton from '../AddButton'
import { ErrorProps } from '@/types/Types'
import { CircularProgress } from '@mui/material'
import { IMember } from '@/lib/database/models/member.model'

type ScanSuccessProps = {
    setStage:Dispatch<SetStateAction<number>>,
    result:ErrorProps,
    loading:boolean
}

const ScanSuccess = ({setStage, loading, result}:ScanSuccessProps) => {
  const res:Partial<IMember> = result?.payload!;

  return (
    <div className='flex-center flex-col h-[50vh] bg-white border rounded dark:bg-black p-4' >
      {
        loading ? 
        <CircularProgress size='2rem' />
        :
        <>
          <Image src={result?.error ? '/4989865.png':'/scan.png'} alt='scan' height={100} width={100} />
          <span className={`${result?.error ? 'text-red-700':'text-blue-700'} font-extrabold text-2xl text-center`} >{result?.error? result?.message:'Scan Successful'}</span>
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

export default ScanSuccess