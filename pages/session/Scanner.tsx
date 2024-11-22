'use client'
import OpenScanner from '@/features/sessions/OpenScanner';
import ScanSuccess from '@/features/sessions/ScanSuccess';
import SelectSessionScan from '@/features/sessions/SelectSessionScan'
import { SessionProps } from '@/types/Types';
import React, { useState } from 'react'

const Scanner = () => {
    const [currentSession, setCurrentSession] = useState<SessionProps|null>(null);
    const [stage, setStage] = useState<number>(1);
  return (
    <div className='w-full' >
        {
            stage === 1 &&
            <SelectSessionScan setStage={setStage} currentSession={currentSession!} setCurrentSession={setCurrentSession} />
        }
        {
            stage === 2 &&
            <OpenScanner setStage={setStage} />
        }
        {
            stage === 3 &&
            <ScanSuccess setStage={setStage} />
        }
    </div>
  )
}

export default Scanner