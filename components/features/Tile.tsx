import { formatDashboardLink } from '@/functions/misc';
import Link from 'next/link';
import { ParsedUrlQueryInput } from 'querystring';
import {  ComponentProps, ReactNode } from 'react'

export type tileProps = {
    title:string,
    icon: ReactNode,
    link?:string;
    query?:string|ParsedUrlQueryInput|null,
    text:string,
    fraction?:string
} & ComponentProps<'div'>
const Tile = ({title, icon, text,  link, fraction, query, className, ...props}:tileProps) => {
  return (
    <div {...props}  className={`hidden items-center gap-4 lg:flex p-3 flex-row bg-white dark:bg-[#0F1214] dark:border rounded shadow-xl ${className}`} >
        {icon}
        <div className="flex flex-col">
            <span className='text-[#3C60CA] font-semibold' >{title}</span>
            <div className="flex flex-row">
                {
                    fraction &&
                    <span className='#C45E8D font-semibold' >{fraction} <span>/</span> </span>
                }
                {
                    !link ?
                    <span className='font-semibold' >{text}</span>
                    :
                    formatDashboardLink(text) === 0 ?
                    <span className='font-semibold' >0</span>
                    :
                    <Link href={{pathname:link, query}}  className='table-link' >{text}</Link>
                }
            </div>
        </div>
    </div>
  )
}

export default Tile