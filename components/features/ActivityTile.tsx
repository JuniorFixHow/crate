import {  ComponentProps, } from 'react'
import Link from 'next/link'
import { ParsedUrlQueryInput } from 'querystring'

export type tileProps = {
    title:string,
    data?:string,
    link?:string,
    nodata?:boolean,
    query?:string|ParsedUrlQueryInput|null
} &  ComponentProps<'div'>
export const ActivityTile = ({title, nodata, data, link, query, className, ...props}:tileProps) => {
  return (
    <div {...props}  className={`hidden gap-4 lg:flex px-3 py-2 flex-col bg-white dark:bg-[#0F1214] dark:border rounded shadow-xl ${className}`} >
        <div className="flex flex-col">
            <span className='font-semibold dark:text-[0.9rem]' >{title}</span>
            {
                !nodata &&
                <>
                    {
                        (!data || parseFloat(data) === 0) ?
                        <span className='text-[0.9rem]' >0</span>
                        :
                        <Link href={{pathname:link, query}}  className='table-link' >{data}</Link>
                    }
                </>
            }
            {
                nodata &&
                
                <span className='text-[0.9rem]' >{data}</span>
            }
        </div>
    </div>
  )
}



