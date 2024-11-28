import {  ComponentProps} from "react"
import AddButton from "@/components/features/AddButton"
import Subtitle from "@/components/features/Subtitle"

export type ProfileProps = ComponentProps<'div'>

const Security = ({className, ...props}:ProfileProps) => {   
    
  return (
    <div className={`flex-col ${className} justify-between w-full`} {...props} >
        <div className={` flex flex-col gap-4 md:gap-8`}  >
            <Subtitle text="Security Settings" />

            <div className="flex flex-col gap-4 ml-3 md:ml-8">
                <div className="flex flex-col">
                    <span className="text-[0.8rem] font-semibold dark:text-white" >Current Password</span>
                    <input type="password" name="name"  className="border-b outline-none px-1 py-1 text-slate-400 text-[0.8rem]" />
                </div>
                
                <div className="flex flex-col">
                    <span className="text-[0.8rem] font-semibold dark:text-white" >New Password</span>
                    <input type="password" name="npassword"  className="border-b outline-none px-1 py-1 text-slate-400 text-[0.8rem]" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[0.8rem] font-semibold dark:text-white" >Repeat New Password</span>
                    <input type="password" name="nrpassword"  className="border-b outline-none px-1 py-1 text-slate-400 text-[0.8rem]" />
                </div>
                
            </div>
            
        </div>
        <AddButton text="Save Changes" noIcon smallText className="rounded w-fit p-2 self-end" />
    </div>
  )
}

export default Security