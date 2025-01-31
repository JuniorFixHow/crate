'use client'
import { checkIfAdmin } from "@/components/Dummy/contants"
import AddButton from "@/components/features/AddButton"
import Subtitle from "@/components/features/Subtitle"
import { useAuth } from "@/hooks/useAuth"
import { IChurch } from "@/lib/database/models/church.model"
import { IVendor } from "@/lib/database/models/vendor.model"
import { IZone } from "@/lib/database/models/zone.model"
import Link from "next/link"
import { ComponentProps, Dispatch, SetStateAction } from "react"
import { FaPhone } from "react-icons/fa"
import { IoMdGlobe } from "react-icons/io"
import { MdOutlineEmail } from "react-icons/md"

type SearchUserItemProps = {
    vendor:IVendor,
    isSlected?:boolean,
    setSelection?:Dispatch<SetStateAction<IVendor[]>>
} & ComponentProps<'div'>

const SearchUserItem = ({vendor, isSlected, setSelection, ...props}:SearchUserItemProps) => {
    const {user} = useAuth();
    const isAdmin = checkIfAdmin(user);
    const church = vendor?.church as unknown as IChurch;
    const zone = church?.zoneId as unknown as IZone;

    const handleSelect = ()=>{
        setSelection!((pre)=>{
            const selected = pre.find((item)=> item._id === vendor?._id);
            return selected ?
            pre.filter((item)=>item._id !== vendor?._id)
            :
            [...pre, vendor]
        })
    }

  return (
    <div {...props}  className={`flex w-full flex-col gap-4 md:flex-row dark:bg-[#0F1214] justify-between items-start md:items-center bg-[#d6d6d6] p-2 rounded ${isSlected ? 'border-blue-500':'border-slate-400'} border`} >
        <div className="flex flex-col gap-2">
            <Link className="table-link" href={{pathname:`/dashboard/users`, query:{id:vendor?._id}}} >
                <Subtitle isLink text={vendor?.name} />
            </Link>
            <div className="flex flex-row gap-1 items-center">
                <MdOutlineEmail className="text-slate-500" />
                    <span className="text-[0.7rem] text-slate-500" >{vendor?.email}</span>
            </div>
            {
                vendor?.phone &&
                <div className="flex flex-row gap-1 items-center">
                    <FaPhone size={14}  className="text-slate-500" />
                    <span className="text-[0.7rem] text-slate-500" > {vendor?.phone}</span>
                </div>
            }
            {
                isAdmin &&
                <div className="flex flex-row gap-1 items-center">
                    <IoMdGlobe size={14}  className="text-slate-500" />
                    <span className="text-[0.7rem] text-slate-500" >{church?.name} - {zone?.name}</span>
                </div>
            }
        </div>
        <AddButton onClick={handleSelect} text={isSlected ? 'Unselect':'Select'} noIcon smallText className="rounded" />
    </div>
  )
}

export default SearchUserItem