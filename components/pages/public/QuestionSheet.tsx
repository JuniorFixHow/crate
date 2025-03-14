import AddButton from "@/components/features/AddButton"
// import { ICYPSet } from "@/lib/database/models/cypset.model"
import { IQuestion } from "@/lib/database/models/question.model"
import { ISection } from "@/lib/database/models/section.model"
// import { Modal } from "@mui/material"
import {  ComponentProps, Dispatch, SetStateAction, useEffect, useState } from "react";
import '@/components/features/customscroll.css';
import { IResponse } from "@/lib/database/models/response.model";
import { createResponses } from "@/lib/actions/response.action";
import { enqueueSnackbar } from "notistack";
import { createRegistration } from "@/lib/actions/registration.action";
import { IRegistration } from "@/lib/database/models/registration.model";

type QuestionSheetProps = {
  setOpen:Dispatch<SetStateAction<boolean>>,
  eventId:string;
  memberId:string
  sections:ISection[]
} & ComponentProps<'div'>



const QuestionSheet = ({ setOpen, eventId, memberId, sections, ...props }: QuestionSheetProps) => {
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
      }
    };

    // console.log("OLD: ",responses)
    // console.log(questions.map((item)=>item.sectionId))

    const handleNext = async() => {
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
      <div {...props}  className="flex overflow-y-scroll scrollbar-custom2 flex-col gap-8 bg-white h-full dark:bg-[#0F1214] dark:border w-full rounded p-6">
        <div className="flex flex-col gap-2 items-center">
          <span className="font-bold text-[1.4rem] md:text-[2rem] dark:text-white">
            {currentSection?.title}
          </span>
        </div>
  
        <div className="flex grow flex-col justify-between">
          <div className="flex flex-col gap-5">
            {questions.map((question) => (
              <div key={question.id} className="p-4 rounded space-y-2">
                <label className="block font-bold text-lg dark:text-white">
                  {question.label}
                </label>
  
                {question.type === "text" && (
                  <input onChange={handleChange} name={question?._id}
                    type="text"
                    className="border w-full dark:text-white p-1 outline-none rounded bg-transparent"
                    placeholder="Type here"
                  />
                )}
  
                {question.type === "textarea" && (
                  <textarea onChange={handleChange} name={question?._id}
                    className="border w-full dark:text-white p-1 rounded outline-none bg-transparent"
                    placeholder="Type here"
                  ></textarea>
                )}
  
                {question.type === "number" && (
                  <input onChange={handleChange} name={question._id}
                    type="number"
                    className="border rounded w-full dark:text-white p-1 outline-none bg-transparent"
                    placeholder="Type here"
                  />
                )}
  
                {question.type === "select" && (
                  <select defaultValue={question?.options?.[0]} onChange={handleChange} name={question?._id}  className="border rounded dark:text-white p-1 w-full outline-none bg-transparent">
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
  
                {["radio", "checkbox"].includes(question.type!) &&
                  question.options?.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        onChange={handleChange}
                        type={question.type}
                        id={`${question.id}-${index}`}
                        name={question._id}
                        value={option}
                      />
                      <label
                        className="dark:text-white"
                        htmlFor={`${question.id}-${index}`}
                      >
                        {option}
                      </label>
                    </div>
                  ))}
              </div>
            ))}
          </div>
  
          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <AddButton
              type="button"
              className="rounded"
              text={currentSectionIndex === 0 ? "Cancel" : "Back"}
              isDanger
              onClick={handleBack}
              smallText
              noIcon
            />
            <AddButton
              type="button"
              className="rounded"
              disabled={loading}
              text={currentSectionIndex === sections.length - 1 ? loading ? "loading...":"Submit" : "Next"}
              isCancel={currentSectionIndex < sections.length - 1}
              onClick={handleNext}
              smallText
              noIcon
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default QuestionSheet;