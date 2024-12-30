
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
    const searchResults = SearchNavbar(NavItems, search);
  
    return (
      <div className="min-w-[18rem] z-10 scrollbar-custom overflow-y-scroll right-4 h-[14rem] bg-white dark:bg-[#0F1214] dark:border rounded shadow p-4 absolute -bottom-52">
        <IoCloseCircle
          onClick={() => setSearch('')}
          className="absolute top-1 right-1 cursor-pointer dark:text-white"
        />
        {searchResults.length > 0 ? (
          <div className="flex flex-col gap-2">
            {searchResults.map((item) => (
              <div key={item.title} className="flex flex-col gap-2">
                {/* Parent Item */}
                <div className="flex gap-2 items-center">
                  {item.icon}
                  {item.link ? (
                    <Link href={`${item.link}`} className="table-link">
                      {item.title}
                    </Link>
                  ) : (
                    <span>{item.title}</span>
                  )}
                </div>
                {/* Matching Children */}
                {item.children?.map((child) => (
                  <div key={child.path} className="flex flex-col gap-2 pl-4">
                    <div className="flex gap-2 items-center">
                      {child.image}
                      <Link href={`${child.path}`} className="table-link">
                        {child.text}
                      </Link>
                    </div>
                    {/* Nested Grandchildren */}
                    {child.children?.map((grandchild) => (
                      <div key={grandchild.path} className="flex gap-2 items-center pl-8">
                        {grandchild.image}
                        <Link href={`${grandchild.path}`} className="table-link">
                          {grandchild.text}
                        </Link>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-center size-full">No Result</div>
        )}
      </div>
    );
  };
  
  

export default SearchResult