import { StringStateProp } from "@/types/Types";
import { FaChevronRight } from "react-icons/fa";

const ProfileNav = ({setText, text}:StringStateProp) => {
    const links:string[] = ['Account','Security','Sounds'];
  return (
    <div className="p-4 w-full md:w-60 rounded bg-white shadow dark:bg-black dark:border"  >
        {
            links.map((item)=>(
                <div onClick={()=>setText(item)} key={item} className="flex px-1 cursor-pointer items-center justify-between py-3 border-b">
                    <span className={`text-[0.9rem] font-semibold ${text===item ? 'text-blue-600':'text-slate-400'}`} >{item}</span>
                    <FaChevronRight className={`${text===item ? 'text-blue-600':'text-slate-400'}`} />
                </div>
            ))
        }
    </div>
  )
}

export default ProfileNav