import {  ComponentProps, ReactNode } from 'react'

export type tileProps = {
    title:string,
    icon: ReactNode,
    text:string,
    fraction?:string
} & ComponentProps<'div'>
const Tile = ({title, icon, text, fraction, className, ...props}:tileProps) => {
  return (
    <div {...props}  className={`hidden items-center gap-4 lg:flex p-3 flex-row bg-white dark:bg-black dark:border rounded shadow-xl ${className}`} >
        {icon}
        <div className="flex flex-col">
            <span className='text-[#3C60CA] font-semibold' >{title}</span>
            <div className="flex flex-row">
                {
                    fraction &&
                    <span className='#C45E8D font-semibold' >{fraction} <span>/</span> </span>
                }
                <span className='font-semibold' >{text}</span>
            </div>
        </div>
    </div>
  )
}

export default Tile