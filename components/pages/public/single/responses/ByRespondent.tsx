import { useFetchResponseForMember } from "@/hooks/fetch/useResponse"
import { IMember } from "@/lib/database/models/member.model"
import { IQuestion } from "@/lib/database/models/question.model"
import Link from "next/link"
import { ComponentProps } from "react"
import { SearchResponseWithJustSection } from "./fxn"
import { LinearProgress } from "@mui/material"
import { useAuth } from "@/hooks/useAuth"
import { canPerformAction, memberRoles } from "@/components/auth/permission/permission"

type ByRespondentProps = {
    member:IMember,
    sectionId:string;
} & ComponentProps<'div'>

const ByRespondent = ({member, sectionId, ...props}:ByRespondentProps) => {
    const {user} = useAuth();
    const {responses, loading} = useFetchResponseForMember(member?._id);
    const reader = canPerformAction(user!, 'reader', {memberRoles})

    if(!user) return;
  return (
    <div {...props} className="bg-slate-100 flex flex-col gap-5 dark:bg-transparent border rounded-md shadow-md p-4" >
        {
            reader ?
            <Link href={`/dashboard/members/${member?._id}`} className="text-[1.2rem] hover:underline w-fit font-semibold text-blue-500" >{member?.name}</Link>
            :
            <span className="text-[1.2rem] w-fit font-semibold" >{member?.name}</span>
        }
        <div className="flex flex-col">
            {
                loading ?
                <LinearProgress className="w-full" />
                :
                <div className="flex flex-col gap-5">
                    {
                        responses?.length ?
                        SearchResponseWithJustSection(responses, sectionId)?.map((response)=>{
                            const question = response?.questionId as IQuestion;
                            return(
                                <div key={response?._id}  className="flex flex-col gap-1 border-b">
                                    <div className="flex gap-3 flex-wrap">
                                        <span className="text-[1.1rem] font-semibold" >Question:</span>
                                        <span  className="text-[1rem] w-fit font-semibold" >{question?.label}</span>
                                    </div>
                                    <div className="flex gap-3 flex-wrap">
                                        <span className="text-[1.1rem] font-semibold" >Feedback:</span>
                                        <span className="font-semibold text-[1rem]" >{response?.answer}</span>

                                        <div className="flex gap-6">
                                            {
                                                response?.options  && 
                                                response?.options?.map((item)=>(
                                                    <span key={item} className="font-semibold text-[1rem]" >{item};</span>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        :
                        <span className="text-[1.1rem] font-semibold" >No responses</span>
                    }
                </div>
            }
        </div>
    </div>
  )
}

export default ByRespondent