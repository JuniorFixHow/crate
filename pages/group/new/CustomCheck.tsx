import { ComponentProps } from "react"
import { IoIosCheckmark } from "react-icons/io"

export type CustomCheckProps = {
    checked:boolean,
} & ComponentProps<'div'>

const CustomCheck = ({checked, className, ...props}:CustomCheckProps) => {
  return (
    <div {...props}  className={`${checked? 'bg-violet-700 dark:bg-black':'bg-transparent dark:transparent border-slate-300'} cursor-pointer w-4 h-4 rounded-[0.15rem] border flex-center ${className}`} >
        {
            checked &&
            <IoIosCheckmark className={` text-white`} />
        }
    </div>
  )
}

export default CustomCheck