'use client'
import { useRouter } from "next/navigation";
import { ComponentProps } from "react";

export type titleProps = {
    text:string;
    clickable?:boolean;
    link?:string
} & ComponentProps<'span'>
const Title = ({text, clickable, link, className, ...props}:titleProps) => {
    const router = useRouter();
    const handleNavigate = ()=>{
        if(clickable){
            router.push(link!)
        }
    }
  return (
    <span {...props} onClick={handleNavigate}  className={`text-2xl font-bold ${clickable && 'cursor-pointer hover:underline hover:text-[#3C60CA]'} ${className}`} >{text}</span>
  )
}

export default Title