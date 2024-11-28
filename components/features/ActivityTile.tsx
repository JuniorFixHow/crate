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
    <div {...props}  className={`hidden gap-4 lg:flex p-3 flex-col bg-white dark:bg-black dark:border rounded shadow-xl ${className}`} >
        <div className="flex flex-col">
            <span className='font-semibold' >{title}</span>
            {
                !nodata &&
                <>
                    {
                        data?
                        <Link href={{pathname:link, query}}  className='table-link' >{data}</Link>
                        :
                        <span className='text-[0.9rem]' >0</span>
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



