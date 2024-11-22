import Image from 'next/image'
import React, { Dispatch, SetStateAction } from 'react'
import AddButton from '../AddButton'

type ScanSuccessProps = {
    setStage:Dispatch<SetStateAction<number>>
}

const ScanSuccess = ({setStage}:ScanSuccessProps) => {
  return (
    <div className='flex justify-center items-center flex-col h-[50vh] bg-white border rounded dark:bg-black p-4' >
        <Image src='/scan.png' alt='scan' height={100} width={100} />
        <span className='text-blue-700 font-extrabold text-2xl' >Scan Successful</span>
        <span className='font-semibold text-gray-600' >Kwaku Duah</span>
        <AddButton onClick={()=>setStage(2)} text='Scan Again' noIcon smallText className='mt-2 rounded-full px-8 py-1 w-fit font-semibold' />
    </div>
  )
}

export default ScanSuccess