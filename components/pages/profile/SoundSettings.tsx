import {  ComponentProps} from "react"
import AddButton from "@/components/features/AddButton"
import Subtitle from "@/components/features/Subtitle"
import { Switch } from "@mui/material"
import { useNotification } from "@/hooks/useSound"

export type ProfileProps = ComponentProps<'div'>

const SoundSettings = ({className, ...props}:ProfileProps) => { 
    const { isSoundEnabled, toggleSound } = useNotification();  
    
  return (
    <div className={`flex-col ${className} justify-between w-full`} {...props} >
        <div className={` flex flex-col gap-4 md:gap-8`}  >
            <Subtitle text="Sound Setting" />

            <div className="flex flex-col gap-4 ml-3 md:ml-8">
                <div className="flex gap-4 items-start">
                    <div className="flex flex-col">
                        <span className="text-[0.9rem] text-slate-500 font-semibold" >Badge scan feedback</span>
                        <span className="text-[0.7rem] text-slate-400" >Receive sound feedback after a successful badge scan</span>
                    </div>

                    <Switch onChange={toggleSound} checked={isSoundEnabled} />
                </div>
                
            </div>
            
        </div>
        <AddButton text="Save Changes" noIcon smallText className="rounded w-fit p-2 self-end" />
    </div>
  )
}

export default SoundSettings