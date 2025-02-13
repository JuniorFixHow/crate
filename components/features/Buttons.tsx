import { ComponentProps } from "react"
import { RiFileExcel2Line } from "react-icons/ri"

type ExcelButtonProps = {
    text?:string
} & ComponentProps<'button'>

export const ExcelButton =({text, className, ...props}:ExcelButtonProps)=>{
    return(
        <button {...props} type='button' className={`bg-transparent flex items-center gap-1 font-semibold border rounded hover:bg-slate-100 dark:hover:bg-transparent dark:hover:border-green-600 px-6 py-[0.4rem] ${className}`} >
            <RiFileExcel2Line className='text-green-600' /> {text??'Import'}
        </button>
    )
}