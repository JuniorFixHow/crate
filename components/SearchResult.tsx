
import { NavItems } from "./Dummy/Data"
import { SearchNavbar } from "@/functions/search"
import Link from "next/link"
import './features/customscroll.css'
import { Dispatch, SetStateAction } from "react"
import { IoCloseCircle } from "react-icons/io5"

type SearchResultProps = {
    search:string,
    setSearch:Dispatch<SetStateAction<string>>
}

const SearchResult = ({ search, setSearch }: SearchResultProps) => {
    return (
      <div className="min-w-[18rem] z-10 scrollbar-custom overflow-y-scroll right-4 h-[14rem] bg-white dark:bg-black dark:border rounded shadow p-4 absolute -bottom-52">
        <IoCloseCircle onClick={()=>setSearch('')} className="absolute top-1 right-1 cursor-pointer dark:text-white" />
        {
            SearchNavbar(NavItems, search).length > 0 ?
            <div className="flex flex-col gap-2">
            {SearchNavbar(NavItems, search).map((item) => (
                <div key={item.title} className="flex flex-col gap-2">
                {/* Parent Item */}
                <div className="flex gap-2 items-center">
                    {item.icon}
                    {
                        item.link ?
                        <Link href={`${item.link}`} className="table-link" >{item.title}</Link>
                        :
                        <span className="">{item.title}</span>
                    }
                </div>
                {/* Matching Children */}
                {item.children?.map((child) => (
                    <div key={child.path} className="flex gap-2 items-center pl-4">
                    {child.image}
                    <Link href={`${child.path}`}  className="table-link">{child.text}</Link>
                    </div>
                ))}
                </div>
            ))}
            </div>
            :
            <div className="flex-center size-full">
                No Result
            </div>
        }
      </div>
    );
  };
  

export default SearchResult