'use client'
import AddButton from "@/components/features/AddButton"
import { Alert } from "@mui/material"
import QuestionPreview from "../QuestionPreview"
import QuestionForm from "@/components/misc/Qestion"
import { FormEvent, useEffect, useState } from "react"
import { IQuestion } from "@/lib/database/models/question.model"
import { ErrorProps } from "@/types/Types"
import { ISection } from "@/lib/database/models/section.model"
import { deleteAndSaveQuestionsForSection, getSection } from "@/lib/actions/section.action"
import { canPerformAction, questionSectionRoles, questionSetRoles } from "@/components/auth/permission/permission"
import { ICYPSet } from "@/lib/database/models/cypset.model"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

type SingleSectionEditorProps = {
    currentSection:ISection
}

const SingleSectionEditor = ({currentSection}:SingleSectionEditorProps) => {
  const {user} = useAuth();
    const [questions, setQuestions] = useState<Partial<IQuestion>[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] =useState<ErrorProps>(null);
  const router = useRouter();

  const set = currentSection?.cypsetId as ICYPSet;
  const mine = set?.createdBy.toString() === user?.userId;
  // alert(mine)

  const updater = canPerformAction(user!, 'updater', {questionSectionRoles}) || canPerformAction(user!, 'updater', {questionSetRoles}) || mine;
  const reader = canPerformAction(user!, 'reader', {questionSectionRoles}) || canPerformAction(user!, 'reader', {questionSetRoles}) || mine;


   useEffect(()=>{
      if(user && (!updater && !reader)){
        router.replace('/dashboard/forbidden?p=Section Reader');
      }
    },[user, reader, updater, router])
  

  useEffect(()=>{
    const getQuestions = async () => {
        if (currentSection) {
          try {
            const res = await getSection(currentSection._id) as ISection;
            const quests = res.questions as IQuestion[];  
            setQuestions(quests);
          } catch (error) {
            console.log(error);
            setResponse({ message: "Failed to fetch questions", error: true });
          }
        }
      };

      getQuestions();
  },[currentSection]);

  const handleUpdateSection = async(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setResponse(null);
    try {
        setLoading(true);
        if(currentSection){
            const res = await deleteAndSaveQuestionsForSection(currentSection._id, questions);
            setResponse(res);
        }
    } catch (error) {
        setResponse({message:'Error occured updating the section', error:true});
        console.log(error);
    }finally{
        setLoading(false);
    }
  }

  if(!reader && !updater) return;

  return (
    <form onSubmit={handleUpdateSection}  className="bg-white dark:bg-black/50 dark:border py-6 rounded w-full min-h-[80vh] flex flex-col" >
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
                {
                  updater &&
                  <AddButton disabled={loading} text={loading ? "loading..." : "Save"} noIcon smallText className="rounded" />
                }
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

export default SingleSectionEditor