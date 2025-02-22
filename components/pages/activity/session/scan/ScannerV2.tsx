'use client'
import { IClasssession } from "@/lib/database/models/classsession.model";
import { useState } from "react";
import SelectSessionScanV2 from "./SelectSessionScanV2";
import OpenScannerV2 from "./OpenScannerV2";
import ScanSuccessV2 from "./ScanSuccessV2";
import { ErrorProps } from "@/types/Types";

const ScannerV2 = () => {
    const [currentSession, setCurrentSession] = useState<IClasssession|null>(null);
    const [result, setResult] = useState<ErrorProps>(null);
    const [laoding, setLoading] = useState<boolean>(false);
    const [stage, setStage] = useState<number>(1);
  return (
    <div className='w-full' >
        {
            stage === 1 &&
            <SelectSessionScanV2 setStage={setStage} currentSession={currentSession!} setCurrentSession={setCurrentSession} />
        }
        {
            stage === 2 &&
            <OpenScannerV2 setLoading={setLoading} setResult={setResult} currentSession={currentSession!} setStage={setStage} />
        }
        {
            stage === 3 &&
            <ScanSuccessV2 loading={laoding} result={result} setStage={setStage} />
        }
    </div>
  )
}

export default ScannerV2