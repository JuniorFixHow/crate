import AddButton from "@/components/features/AddButton"
// import { ICYPSet } from "@/lib/database/models/cypset.model"
import { IQuestion } from "@/lib/database/models/question.model"
import { ISection } from "@/lib/database/models/section.model"
// import { Modal } from "@mui/material"
import { ComponentProps, Dispatch, SetStateAction, useState } from "react";
import '@/components/features/customscroll.css';

type QuestionSheetProps = {
  setOpen:Dispatch<SetStateAction<boolean>>,
  eventId:string;
  memberId:string
  sections:ISection[]
} & ComponentProps<'div'>
const QuestionSheet = ({ setOpen, eventId, memberId, sections, ...props }: QuestionSheetProps) => {
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    console.log(eventId, memberId)
  
    const handleNext = () => {
      if (currentSectionIndex < sections.length - 1) {
        setCurrentSectionIndex((prev) => prev + 1);
      } else {
        console.log("Submit action here");
      }
    };
  
    const handleBack = () => {
      if (currentSectionIndex > 0) {
        setCurrentSectionIndex((prev) => prev - 1);
      } else {
        setOpen(false); // Cancel action
      }
    };
  
    const currentSection = sections[currentSectionIndex];
    const questions = currentSection.questions as IQuestion[]; // Assuming each section has a `questions` array
  
    return (
      <div {...props}  className="flex overflow-y-scroll scrollbar-custom2 flex-col gap-8 bg-white h-full dark:bg-[#0F1214] dark:border w-full rounded p-6">
        <div className="flex flex-col gap-2 items-center">
          <span className="font-semibold dark:text-white">
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
                  <input name={question?.id}
                    type="text"
                    className="border w-full dark:text-white p-1 outline-none rounded bg-transparent"
                    placeholder="Type here"
                  />
                )}
  
                {question.type === "textarea" && (
                  <textarea name={question?.id}
                    className="border w-full dark:text-white p-1 rounded outline-none bg-transparent"
                    placeholder="Type here"
                  ></textarea>
                )}
  
                {question.type === "number" && (
                  <input name={question.id}
                    type="number"
                    className="border rounded w-full dark:text-white p-1 outline-none bg-transparent"
                    placeholder="Type here"
                  />
                )}
  
                {question.type === "select" && (
                  <select name={question?.id}  className="border rounded dark:text-white p-1 w-full outline-none bg-transparent">
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
                        type={question.type}
                        id={`${question.id}-${index}`}
                        name={question.id}
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
              text={currentSectionIndex === sections.length - 1 ? "Submit" : "Next"}
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