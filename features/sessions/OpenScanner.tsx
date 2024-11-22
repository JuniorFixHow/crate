'use client'
import { Dispatch, SetStateAction, useState } from 'react'
import Subtitle from '../Subtitle'
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner'
import AddButton from '../AddButton'

type OpenScannerProps = {
    setStage:Dispatch<SetStateAction<number>>
}

const OpenScanner = ({setStage}:OpenScannerProps) => {
    const [hasScanned, setHasScanned] = useState<boolean>(false)
    const handleScan =(results:IDetectedBarcode[])=>{
        results.forEach((result)=>{
            console.log(JSON.parse(result?.rawValue))
        })
        setHasScanned(true);
        setStage(3);
    }
    // console.log(hasScanned)
  return (
    <div className='flex flex-col gap-3 bg-white border rounded dark:bg-black p-4' >
        <Subtitle text='Scan Badge' />
        {
            !hasScanned &&
            <div className="flex flex-col gap-4">
                <small className='text-center font-semibold' >Place the badge in front of your camera</small>
                <div className="flex self-center justify-center w-[25vw] h-[50%]">
                    <Scanner components={{audio:false, onOff:hasScanned}} onError={()=>alert('Error occured opening camera')} onScan={(res)=>handleScan(res)} />
                </div>
                <AddButton onClick={()=>setStage(1)}  className='w-fit px-8 py-1 rounded' text='Go Back' noIcon smallText isCancel />
            </div>
        }
    </div>
  )
}

export default OpenScanner