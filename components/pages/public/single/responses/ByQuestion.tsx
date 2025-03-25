import { canPerformAction, memberRoles } from "@/components/auth/permission/permission"
import { useFetchResponseForQuestions } from "@/hooks/fetch/useResponse"
import { useAuth } from "@/hooks/useAuth"
import { IMember } from "@/lib/database/models/member.model"
import { IQuestion } from "@/lib/database/models/question.model"
import { LinearProgress } from "@mui/material"
import Link from "next/link"
import { ComponentProps } from "react"

type ByQuestionProps = {
    question:IQuestion
} & ComponentProps<'div'>

const ByQuestion = ({question, ...props}:ByQuestionProps) => {
    const {user} = useAuth();
    const {responses, loading} = useFetchResponseForQuestions(question?._id);

    const reader = canPerformAction(user!, 'reader', {memberRoles});
    // console.log('Responses: ',responses[0]?.sectionId)
    if(!user) return;
  return (
    <div {...props} className="bg-slate-100 flex flex-col gap-5 dark:bg-transparent border rounded-md shadow-md p-4" >
        <span className="text-[1.2rem] font-semibold" >{question?.label}</span>
        <div className="flex flex-col">
            {
                loading ? 
                <LinearProgress className="w-full" />
                :
                <div className="flex flex-col gap-5">
                    {
                        responses?.length ?
                        responses?.map((response)=>{
                            const member = response?.memberId as IMember;
                            return(
                                <div key={response?._id}  className="flex flex-col gap-1 border-b">
                                    {
                                        reader ?
                                        <Link href={`/dashboard/members/${member?._id}`} className="text-[1.1rem] hover:underline w-fit font-semibold text-blue-500" >{member?.name}</Link>
                                        :
                                        <span className="text-[1.1rem] w-fit font-semibold" >{member?.name}</span>
                                    }
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

export default ByQuestion