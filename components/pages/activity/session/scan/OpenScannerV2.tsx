'use client'
import { Dispatch, SetStateAction, useState } from 'react'
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner'
import { useNotification } from '@/hooks/useSound'
import { ErrorProps } from '@/types/Types'
import { isLate } from '@/components/pages/session/fxn'
import Subtitle from '@/components/features/Subtitle'
import AddButton from '@/components/features/AddButton'
import { enqueueSnackbar } from 'notistack'
import { IClasssession } from '@/lib/database/models/classsession.model'
import { IMinistry } from '@/lib/database/models/ministry.model'
import { createCAttendance } from '@/lib/actions/cattendance.action'
import { ICAttendance } from '@/lib/database/models/classattendance.model'

type OpenScannerV2Props = {
    setStage:Dispatch<SetStateAction<number>>,
    currentSession:IClasssession,
    setResult:Dispatch<SetStateAction<ErrorProps>>,
    setLoading: Dispatch<SetStateAction<boolean>>
}

const OpenScannerV2 = ({setStage, currentSession, setResult, setLoading}:OpenScannerV2Props) => {
    const {isSoundEnabled} =useNotification();
    const [hasScanned, setHasScanned] = useState<boolean>(false);

    const classId = currentSession?.classId as IMinistry;

    const handleScan =(results:IDetectedBarcode[])=>{
        results.forEach(async(result)=>{

            // console.log('RAW: ',result.rawValue.split(',')[0]);
            const memberId = result.rawValue.split(',')[0];
            setResult(null);
            try {
                if(classId && memberId){
                    
                    setLoading(true);
                    const data:Partial<ICAttendance> = {
                        member:memberId,
                        sessionId:currentSession._id,
                        late: isLate(currentSession?.to)
                    }
                    // console.log('Data: ',data)
                    const res:ErrorProps = await createCAttendance(classId?._id, data);
                    console.log(res);
                    setResult(res);
                    setHasScanned(true);
                    setStage(3);
                }
                
            } catch (error) {
                console.log(error)
                setResult({message:'Error occured during the scan', error:true})
            }finally{
                setLoading(false);
            }
        })
        
    }
    // console.log(hasScanned)
  return (
    <div className='flex flex-col gap-3 bg-white border rounded dark:bg-[#0F1214] p-4' >
        <Subtitle text='Scan Badge' />
        {
            !hasScanned &&
            <div className="flex flex-col gap-4">
                <small className='text-center font-semibold' >Place the badge in front of your camera</small>
                <div className="flex self-center justify-center w-[25vw] h-[50%]">
                    <Scanner  components={{audio:isSoundEnabled, onOff:hasScanned}} onError={()=>enqueueSnackbar('Error occured opening camera', {variant:'error'})} onScan={(res)=>handleScan(res)} />
                </div>
                <AddButton onClick={()=>setStage(1)}  className='w-fit px-8 py-1 rounded' text='Go Back' noIcon smallText isCancel />
            </div>
        }
    </div>
  )
}

export default OpenScannerV2