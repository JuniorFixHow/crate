'use client'
import { Dispatch, SetStateAction, useState } from 'react'
import Subtitle from '../Subtitle'
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner'
import AddButton from '../AddButton'
import { useNotification } from '@/hooks/useSound'
import { ISession } from '@/lib/database/models/session.model'
import { ErrorProps } from '@/types/Types'
import { IAttendance } from '@/lib/database/models/attendance.model'
import { isLate } from '@/components/pages/session/fxn'
import { createAttendance } from '@/lib/actions/attendance.action'

type OpenScannerProps = {
    setStage:Dispatch<SetStateAction<number>>,
    currentSession:ISession,
    setResult:Dispatch<SetStateAction<ErrorProps>>,
    setLoading: Dispatch<SetStateAction<boolean>>
}

const OpenScanner = ({setStage, currentSession, setResult, setLoading}:OpenScannerProps) => {
    const {isSoundEnabled} =useNotification();
    const [hasScanned, setHasScanned] = useState<boolean>(false);


    const handleScan =(results:IDetectedBarcode[])=>{
        results.forEach(async(result)=>{

            // console.log('RAW: ',result.rawValue.split(',')[0]);
            const memberId = result.rawValue.split(',')[0];
            setResult(null);
            try {
                if(currentSession){
                    const eventId = typeof currentSession?.eventId === 'object' && currentSession.eventId._id.toString();
                    // console.log('EventId ',eventId)
                    if(eventId && memberId){
                        
                        setLoading(true);
                        const data:Partial<IAttendance> = {
                            member:memberId,
                            sessionId:currentSession._id,
                            late: isLate(currentSession?.to)
                        }
                        // console.log('Data: ',data)
                        const res:ErrorProps = await createAttendance(eventId, data);
                        console.log(res);
                        setResult(res);
                        setHasScanned(true);
                        setStage(3);
                    }
                }
            } catch (error) {
                setResult({message:'Error occured during the scan', error:true})
            }finally{
                setLoading(false);
            }
        })
        
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
                    <Scanner  components={{audio:isSoundEnabled, onOff:hasScanned}} onError={()=>alert('Error occured opening camera')} onScan={(res)=>handleScan(res)} />
                </div>
                <AddButton onClick={()=>setStage(1)}  className='w-fit px-8 py-1 rounded' text='Go Back' noIcon smallText isCancel />
            </div>
        }
    </div>
  )
}

export default OpenScanner