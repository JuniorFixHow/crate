'use client'
import AddButton from "@/components/features/AddButton"
import { NewPlaygroundProps } from "./NewPlayground"
import { FormEvent, useEffect, useState } from "react"
import { IQuestion } from "@/lib/database/models/question.model"
import QuestionForm from "@/components/misc/Qestion"
import QuestionPreview from "./QuestionPreview"
import { ErrorProps } from "@/types/Types"
import { Alert } from "@mui/material"
import { createQuestions } from "@/lib/actions/question.action"
import { useSearchParams } from "next/navigation"
import { getSection } from "@/lib/actions/section.action"
import { ISection } from "@/lib/database/models/section.model"
// import { ICYPSet } from "@/lib/database/models/cypset.model"

const NewEditor = ({currentSection}:NewPlaygroundProps) => {
  const [questions, setQuestions] = useState<Partial<IQuestion>[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] =useState<ErrorProps>(null);
  const searchParams = useSearchParams();
//   const cyp = currentSection.cypsetId as unknown as ICYPSet

  const handleSaveQuestions = async(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setResponse(null);
    try {
        setLoading(true);
        const res = await createQuestions(questions);
        setResponse(res);
    } catch (error) {
        console.log(error);
        setResponse({message:'Error occured saving questions', error:true})
    }finally{
        setLoading(false);
    }
  }

  useEffect(() => {
    const id = searchParams.get("copy");
    const getQuestions = async () => {
      if (id) {
        try {
          const res = await getSection(id) as ISection;
          const quests = res.questions as IQuestion[];  
          setQuestions(quests.map((question) => ({
            id: question.id,
            label: question.label,
            type: question.type,
            options: question.options,
            sectionId: currentSection._id, // Set new section ID
          })));
        } catch (error) {
          console.log(error);
          setResponse({ message: "Failed to fetch questions", error: true });
        }
      }
    };
  
    getQuestions();
  }, [currentSection._id, searchParams]);
  

  return (
    <form onSubmit={handleSaveQuestions}  className="bg-white dark:bg-black/50 dark:border py-6 rounded w-full min-h-[80vh] flex flex-col" >
        <div className="flex justify-between w-full border-b border-b-slate-300 pb-3 px-6">
            <div className="flex-center dark:text-black dark:bg-white text-[0.8rem] font-bold text-white w-10 h-10 bg-black p-2 rounded-full shadow">{currentSection?.number}</div>
            {
                response?.message &&
                <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
            }
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span>Questions:</span>
                    <span className="font-bold" >{questions.length}</span>
                </div>
                <AddButton disabled={loading} text={loading ? "loading..." : "Save"} noIcon smallText className="rounded" />
                <AddButton type="button" onClick={()=>setOpen(true)} text="Preview" isCancel noIcon smallText className="rounded" />
            </div>
        </div>
        <QuestionPreview section={currentSection} open={open} setOpen={setOpen} questions={questions} />
        <div className="flex w-full px-6 py-4">
            <QuestionForm sectionId={currentSection?._id} customQuestions={questions} setCustomQuestions={setQuestions} />
        </div>
    </form>
  )
}

export default NewEditor