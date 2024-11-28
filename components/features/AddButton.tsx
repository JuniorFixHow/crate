import { ComponentProps } from "react";
import { RiAddCircleLine } from "react-icons/ri";

export type AddButtonProps = {
    text:string,
    noIcon?:boolean,
    smallText?:boolean,
    isDanger?:boolean,
    isCancel?:boolean,
} & ComponentProps<'button'>
const AddButton = ({text, isDanger, isCancel, noIcon, smallText, className, ...props}:AddButtonProps) => {
  return (
    <button {...props}  className={`flex ${isDanger ?'bg-red-800 hover:bg-red-700 dark:hover:border-red-700' : isCancel ? 'bg-[#B5B5B5] hover:bg-[#8a8989] dark:hover:border-slate-500': 'bg-[#3C60CA] hover:bg-blue-800  dark:hover:border-blue-600' }  cursor-pointer dark:bg-transparent dark:border px-2 py-1 flex-row items-center gap-2 ${className}`}>
      {
        !noIcon &&
        <RiAddCircleLine color="#fff" />
      }
        <span className={`${smallText && 'text-[0.8rem]'} text-white`} >{text}</span>
    </button>
  )
}

export default AddButton