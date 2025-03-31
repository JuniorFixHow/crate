// import AddButton from "@/components/features/AddButton"
// import { ICYPSet } from "@/lib/database/models/cypset.model"
import { IQuestion } from "@/lib/database/models/question.model"
import { ISection } from "@/lib/database/models/section.model"
// import { Modal } from "@mui/material"
import {  ComponentProps, Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import '@/components/features/customscroll.css';
import { IResponse } from "@/lib/database/models/response.model";
import { createResponses } from "@/lib/actions/response.action";
import { enqueueSnackbar } from "notistack";
import { createRegistration } from "@/lib/actions/registration.action";
import { IRegistration } from "@/lib/database/models/registration.model";

type QuestionSheetProps = {
  setOpen:Dispatch<SetStateAction<boolean>>,
  eventId:string;
  setStart:Dispatch<SetStateAction<boolean>>;
  memberId:string
  sections:ISection[]
} & ComponentProps<'div'>



const QuestionSheet = ({ setOpen, eventId, setStart, memberId, sections, ...props }: QuestionSheetProps) => {
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [responses, setResponses] = useState<{ [key: string]: Partial<IResponse> }>({});
    const [loading, setLoading] = useState<boolean>(false);
    // console.log(eventId, memberId)
    const currentSection = sections[currentSectionIndex];
    const questions = currentSection.questions as IQuestion[]; // Assuming each section has a `questions` array
  

    useEffect(() => {
      const initialResponses: { [key: string]: Partial<IResponse> } = {};
    
      questions.forEach((question) => {
        if (question.type === "select" && question.options?.length) {
          initialResponses[question._id] = {
            answer: question.options[0], // Set first option as default
            options: question.options,
            type: question.type,
            questionId: question._id,
            sectionId: question.sectionId, // ✅ Assign correct sectionId from question
          };
        }
      });
    
      setResponses((prev) => ({ ...prev, ...initialResponses }));
    }, [questions]);
    

    const handleEvent = async():Promise<boolean>=>{
      try {
        const data:Partial<IRegistration> = {
            memberId:memberId,
            eventId,
            badgeIssued:'No',
        } 
        const res = await createRegistration(memberId, eventId, data);
        enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
        return res?.error ? false:true;
      } catch (error) {
        console.log(error);
        enqueueSnackbar('Error occured registering for the event', {variant:'error'});
        return false;
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
    
      setResponses((prev) => {
        const question = questions.find((q) => q._id === name);
        if (!question) return prev; // Safety check
    
        if (type === "checkbox") {
          const target = e.target as HTMLInputElement;
          const prevValues = (prev[name]?.options as string[]) || [];
    
          return {
            ...prev,
            [name]: {
              ...prev[name],
              answer: "",
              options: target.checked ? [...prevValues, value] : prevValues.filter((v) => v !== value),
              type: question.type,
              questionId: name,
              memberId,
              cypsetId:currentSection?.cypsetId.toString(),
              sectionId: question.sectionId, // ✅ Assign correct sectionId from question
            },
          };
        } else {
          return {
            ...prev,
            [name]: {
              ...prev[name],
              answer: value,
              options: undefined,
              type: question.type,
              memberId,
              cypsetId:currentSection?.cypsetId.toString(),
              questionId: name,
              sectionId: question.sectionId, // ✅ Assign correct sectionId from question
            },
          };
        }
      });
    };
    
    
  
    // Handle form submission
    const handleFormSubmit = async () => {
      const formattedResponses: Partial<IResponse>[] = Object.values(responses);
      // console.log("Formatted Responses:", formattedResponses);
    
      try {
        setLoading(true);
        const event = await handleEvent();
        if (event) {
          const res = await createResponses(formattedResponses);
          enqueueSnackbar(res?.message, { variant: res?.error ? "error" : "success" });
          setOpen(false);
        }
      } catch (error) {
        console.log(error);
        enqueueSnackbar("Error occurred submitting responses", { variant: "error" });
      } finally {
        setLoading(false);
        setStart(false)
      }
    };

    // console.log("OLD: ",responses)
    // console.log(questions.map((item)=>item.sectionId))

    const handleNext = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    
      const unansweredRequired = questions.filter((q) => {
        if (!q.required) return false; // Ignore non-required questions
    
        const response = responses[q._id]?.answer || responses[q._id]?.options;
        return !response || (Array.isArray(response) && response.length === 0);
      });
    
      if (unansweredRequired.length > 0) {
        enqueueSnackbar("Please answer all required questions before proceeding.", { variant: "error" });
        return;
      }
    
      if (currentSectionIndex < sections.length - 1) {
        setCurrentSectionIndex((prev) => prev + 1);
      } else {
        await handleFormSubmit();
      }
    };
    
    
  
    const handleBack = () => {
      if (currentSectionIndex > 0) {
        setCurrentSectionIndex((prev) => prev - 1);
      } else {
        setOpen(false); // Cancel action
      }
    };
  
  
    return (
      <div {...props}  className="flex flex-col gap-8 h-full dark:border w-full rounded p-6">
        <div className="flex flex-col gap-2 items-center">
          <span className="font-bold text-[1.4rem] md:text-[2rem] dark:text-white">
            {currentSection?.title}
          </span>
        </div>
  
        <form onSubmit={handleNext} className="flex grow flex-col justify-between overflow-y-scroll scrollbar-custom2 px-4 gap-5">
          <div className="flex flex-col gap-5">
            {questions.map((question) => (
              <div key={question.id} className=" p-4 space-y-2 rounded-md bg-white shadow">
                <div className="flex items-center gap-2">
                    <label className="block text-lg">{question.label}</label>
                    {
                      question?.required && 
                      <span className="text-red-700 text-[1rem]" >*</span>
                    }
                </div>
  
                {question.type === "text" && (
                  <input required={question?.required} onChange={handleChange} name={question?._id}
                    type="text"
                    className="border-b w-full p-1 outline-none rounded bg-transparent placeholder:text-slate-800 placeholder:text-[0.9rem] placeholder:font-normal"
                    placeholder="Type here"
                  />
                )}
  
                {question.type === "textarea" && (
                  <textarea required={question?.required} onChange={handleChange} name={question?._id}
                    className="border-b w-full p-1 outline-none rounded bg-transparent placeholder:text-slate-800 placeholder:text-[0.9rem] placeholder:font-normal"
                    placeholder="Type here"
                  ></textarea>
                )}
  
                {question.type === "number" && (
                  <input required={question?.required} onChange={handleChange} name={question._id}
                    type="number"
                    className="border-b w-full p-1 outline-none rounded bg-transparent placeholder:text-slate-800 placeholder:text-[0.9rem] placeholder:font-normal"
                    placeholder="Type here"
                  />
                )}
  
                {question.type === "select" && (
                  <select required={question?.required} defaultValue={question?.options?.[0]} onChange={handleChange} name={question?._id}  className="border-b w-full p-1 outline-none rounded bg-transparent placeholder:text-slate-800 placeholder:text-[0.9rem] placeholder:font-normal">
                    {question.options?.map((option, index) => (
                      <option
                        key={index}
                        value={option}
                        className="dark:bg-[#0F1214] dark:text-white"
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                )}
  
                {question.type === "radio" &&
                question.options?.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      onChange={handleChange}
                      type="radio"
                      id={`${question.id}-${index}`}
                      name={question._id} // Same name groups the radio buttons
                      value={option}
                      required={question?.required && index === 0} // ✅ Required only for the first option
                    />
                    <label htmlFor={`${question.id}-${index}`}>{option}</label>
                  </div>
                ))}

                {question.type === "checkbox" &&
                  question.options?.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        onChange={handleChange}
                        type="checkbox"
                        id={`${question.id}-${index}`}
                        name={question._id}
                        value={option}
                      />
                      <label htmlFor={`${question.id}-${index}`}>{option}</label>
                    </div>
                  ))}
              </div>
            ))}
          </div>
  
          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              className="rounded text-[0.9rem] bg-red-600 border-none px-4 py-1 text-white"
              // text={currentSectionIndex === 0 ? "Cancel" : "Back"}
              // isDanger
              onClick={handleBack}
              // smallText
              // noIcon
            >
              {currentSectionIndex === 0 ? "Cancel" : "Back"}
            </button>

            <button
              type="submit"
              className="rounded text-[0.9rem] bg-blue-500 border-none px-4 py-1 text-white"
              disabled={loading}
              // text=
              // isCancel={currentSectionIndex < sections.length - 1}
              // onClick={handleNext}
              // smallText
              // noIcon
            >
              {currentSectionIndex === sections.length - 1 ? loading ? "loading...":"Submit" : "Next"}
            </button>
          </div>
        </form>
      </div>
    );
  };
  
  export default QuestionSheet;