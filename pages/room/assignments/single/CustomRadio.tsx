import { ComponentProps } from "react"

export type CustomRadioProps = {
    checked:boolean,
} & ComponentProps<'div'>

const CustomRadio = ({checked, className, ...props}:CustomRadioProps) => {
  return (
    <div {...props}  className={`${checked? 'bg-violet-700 dark:bg-black':'bg-transparent dark:transparent border-slate-300'} cursor-pointer w-4 h-4 rounded-full border flex-center ${className}`} >
        {
            checked &&
            <div className="h-[4px] w-[4px] bg-white rounded-full" />
        }
    </div>
  )
}

export default CustomRadio