import SearchBar from "@/components/features/SearchBar"
import SearchSelectSectionsForSet from "@/components/features/SearchSelectSectionsForSet"
import { useFetchQuestionForSet } from "@/hooks/fetch/useQuestion"
import {  useFetchSetRespondents } from "@/hooks/fetch/useResponse"
import { LinearProgress } from "@mui/material"
import {  useState } from "react"
import ByQuestion from "./ByQuestion"
import { SearchQuestion, SearchResponseMemberWithoutSection, ViewProps } from "./fxn"
import ByRespondent from "./ByRespondent"
import NoResponse from "./NoResponse"
import ByTable from "./ByTable"

type ResponseMainProps = {
    setId:string
}

const ResponseMain = ({setId}:ResponseMainProps) => {
    const {members} = useFetchSetRespondents(setId);
    const [sectionId, setSectionId] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [viewMode, setViewMode] = useState<string>('By Question');

    const {questions, isPending} = useFetchQuestionForSet(setId);

    const searchedQuestions = SearchQuestion(questions, sectionId, search);
    const searchedMembers = SearchResponseMemberWithoutSection(members, search);

    // console.log("Members: ",members);
    // useEffect(()=>{
    //     updateThem();
    // },[])


  return (
    <div className="flex flex-col gap-6" >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md: justify-between">
            <SearchSelectSectionsForSet setId={setId} setSelect={setSectionId} />
            <div className="flex flex-col gap-4 md:flex-row">
                <select className="border px-2 w-fit outline-none py-[0.3rem] rounded bg-transparent" onChange={(e)=>setViewMode(e.target.value)}>
                    <option className="dark:bg-black dark:text-white" value="By Question">By Question</option>
                    <option className="dark:bg-black dark:text-white" value="By Respondent">By Respondent</option>
                    <option className="dark:bg-black dark:text-white" value="Table">Table</option>
                </select>
                <SearchBar className="py-[0.3rem] w-fit" setSearch={setSearch} reversed />
            </div>
        </div>
        {
            viewMode === 'By Question' &&
            <div className="flex flex-col">
                {
                    isPending ? 
                    <LinearProgress className="w-full" />
                    :
                    <div className="flex flex-col gap-4">
                        {
                            searchedQuestions?.length > 0 ?
                            SearchQuestion(questions, sectionId, search)?.map((question)=>(
                                <ByQuestion key={question?._id} question={question} />
                            ))
                            :
                            <NoResponse view={viewMode as ViewProps} />
                        }
                    </div>
                }
            </div>
        }
        {
            viewMode === 'By Respondent' &&
            <div className="flex flex-col">
                {
                    isPending ? 
                    <LinearProgress className="w-full" />
                    :
                    <div className="flex flex-col gap-4">
                        {
                            searchedMembers?.length > 0 ?
                            SearchResponseMemberWithoutSection(members,  search)?.map((member)=>(
                                <ByRespondent key={member?._id} sectionId={sectionId} member={member} />
                            ))
                            :
                            <NoResponse view={viewMode as ViewProps} />
                        }
                    </div>
                }
            </div>
        }

        {
            viewMode === 'Table' &&
            <ByTable sectionId={sectionId} setId={setId} />
        }
    </div>
  )
}

export default ResponseMain