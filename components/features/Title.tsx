'use client'
import { useRouter } from "next/navigation";

export type titleProps = {
    text:string;
    clickable?:boolean;
    link?:string
}
const Title = ({text, clickable, link}:titleProps) => {
    const router = useRouter();
    const handleNavigate = ()=>{
        if(clickable){
            router.push(link!)
        }
    }
  return (
    <span onClick={handleNavigate}  className={`text-2xl font-bold ${clickable && 'cursor-pointer hover:underline hover:text-[#3C60CA]'}`} >{text}</span>
  )
}

export default Title