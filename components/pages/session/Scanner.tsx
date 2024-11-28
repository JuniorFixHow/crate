'use client'
import OpenScanner from '@/components/features/sessions/OpenScanner';
import ScanSuccess from '@/components/features/sessions/ScanSuccess';
import SelectSessionScan from '@/components/features/sessions/SelectSessionScan'
import { ISession } from '@/lib/database/models/session.model';
import { ErrorProps } from '@/types/Types';
import React, { useState } from 'react'

const Scanner = () => {
    const [currentSession, setCurrentSession] = useState<ISession|null>(null);
    const [result, setResult] = useState<ErrorProps>(null);
    const [laoding, setLoading] = useState<boolean>(false);
    const [stage, setStage] = useState<number>(1);
  return (
    <div className='w-full' >
        {
            stage === 1 &&
            <SelectSessionScan setStage={setStage} currentSession={currentSession!} setCurrentSession={setCurrentSession} />
        }
        {
            stage === 2 &&
            <OpenScanner setLoading={setLoading} setResult={setResult} currentSession={currentSession!} setStage={setStage} />
        }
        {
            stage === 3 &&
            <ScanSuccess loading={laoding} result={result} setStage={setStage} />
        }
    </div>
  )
}

export default Scanner