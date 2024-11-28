import Image from "next/image"
import { ChangeEvent, ComponentProps, useRef, useState, } from "react"
import { VendorProps } from "@/types/Types"
import SearchSelectChurch from "@/components/shared/SearchSelectChurch"
import AddButton from "@/components/features/AddButton"

export type ProfileProps = {
 user:VendorProps
} & ComponentProps<'div'>

const Account = ({user, className, ...props}:ProfileProps) => {
    const [photo, setPhoto] = useState<File|null>(null);
    const imageRef = useRef<HTMLInputElement>(null);

    const handleChange =(e:ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files?.[0] || null;
        setPhoto(file);
    }

    const handleClick = ()=>{
        imageRef.current?.click()
    }
    
  return (
    <div className={`flex-col ${className} justify-between`} {...props} >
        <div className={` flex flex-row items-center h-fit gap-4 md:gap-10`}  >
            <div className="flex flex-col gap-4">
                <input onChange={handleChange} ref={imageRef} type="file" className="hidden" accept="image/*" id="profile" />
                <div className="flex-center h-[8rem] w-[8rem] p-2 relative rounded-full bg-slate-300">
                    <Image src={photo? URL.createObjectURL(photo) : user?.image} height={100} width={100} className="rounded-full" alt="user" />
                </div>
                <button onClick={handleClick}   className="bg-slate-300 text-[0.8rem] dark:text-white rounded-full py-2 px-5 dark:bg-black dark:border hover:bg-slate-200 dark:hover:border-blue-600" >Change Picture</button>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <span className="text-[0.8rem] font-semibold dark:text-white" >Name</span>
                    <input type="text" name="name" defaultValue={user?.name} className="border-b px-1 outline-none py-1 text-slate-400 text-[0.8rem]" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[0.8rem] font-semibold dark:text-white" >Gender</span>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <input defaultChecked={user?.gender==='Male'} type="radio" name="gender" value='Male' />
                            <span className='text-[0.8rem] dark:text-white' >Male</span>
                        </div>
                        <div className="flex gap-2">
                            <input defaultChecked={user?.gender==='Female'} type="radio" name="gender" value='Female' />
                            <span className='text-[0.8rem] dark:text-white' >Female</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-[0.8rem] font-semibold dark:text-white" >Email</span>
                    <input type="email" name="email" defaultValue={user?.email} className="border-b px-1 outline-none py-1 text-slate-400 text-[0.8rem]" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[0.8rem] font-semibold dark:text-white" >Phone Number</span>
                    <input type="text" name="phone" defaultValue={user?.phone} className="border-b px-1 outline-none py-1 text-slate-400 text-[0.8rem]" />
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[0.8rem] font-semibold dark:text-white" >Local Church</span>
                    <SearchSelectChurch isGeneric />
                </div>
            </div>

            
        </div>


        <AddButton text="Save Changes" noIcon smallText className="rounded w-fit p-2 self-end" />
    </div>
  )
}

export default Account