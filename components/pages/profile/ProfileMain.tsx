'use client'
import Title from "@/components/features/Title"
import ProfileNav from "./ProfileNav"
import ProfileContent from "./ProfileContent"
import { useState } from "react"

const ProfileMain = () => {
    const [currentTitle, setCurrentTitle] = useState<string>('Account');
  return (
    <div className="page grow" >
        <Title text="Account & Settings" />
        <div className="flex flex-col md:flex-row gap-5 grow items-center md:items-stretch">
            <ProfileNav text={currentTitle} setText={setCurrentTitle} />
            <ProfileContent currentTitle={currentTitle} />
        </div>
    </div>
  )
}

export default ProfileMain