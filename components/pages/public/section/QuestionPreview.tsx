import AddButton from "@/components/features/AddButton"
import { ICYPSet } from "@/lib/database/models/cypset.model"
import { IQuestion } from "@/lib/database/models/question.model"
import { ISection } from "@/lib/database/models/section.model"
import { Modal } from "@mui/material"
import { Dispatch, SetStateAction } from "react";
import '../../../features/customscroll.css';

type QuestionPreviewProps = {
  open:boolean,
  setOpen:Dispatch<SetStateAction<boolean>>,
  questions:Partial<IQuestion>[],
  section:ISection
}
const QuestionPreview = ({open, setOpen, section, questions}:QuestionPreviewProps) => {
  const cyp = section.cypsetId as unknown as ICYPSet
  const handleClose = ()=>{
    setOpen(false);
  }
  return (
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="flex-center"
        >
           <div className='flex overflow-y-scroll scrollbar-custom flex-col gap-8 bg-white h-[95vh]  dark:bg-[#0F1214] dark:border w-[90%] md:w-[60%] rounded p-6'>
            <div className="flex flex-col gap-2 items-center">
              {
                section.number === 1 &&
                <span className="text-[1.5rem] font-bold dark:text-white" >{cyp?.title}</span>
              }
              <span className="font-semibold dark:text-white" >Section {section.number} - {section?.title}</span>
            </div>
            <div className="flex grow flex-col justify-between">
            <div className="flex flex-col gap-5">
              {questions.map((question) => (
                <div key={question.id} className=" p-4 rounded space-y-2">
                  <label className="block font-bold text-lg dark:text-white">{question.label}</label>

                  {question.type === "text" && (
                    <input
                      type="text"
                      className="border w-full dark:text-white p-1 outline-none rounded bg-transparent"
                      placeholder='type here'
                    />
                  )}

                  {question.type === "textarea" && (
                    <textarea
                      className="border w-full dark:text-white p-1 rounded outline-none bg-transparent"
                      placeholder='type here'
                    ></textarea>
                  )}

                  {question.type === "number" && (
                    <input
                      type="number"
                      className="border rounded w-full dark:text-white p-1 outline-none bg-transparent"
                      placeholder='type here'
                    />
                  )}

                  {question.type === "select" && (
                    <select className="border rounded dark:text-white p-1 w-full outline-none bg-transparent">
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
                        <label className="dark:text-white" htmlFor={`${question.id}-${index}`}>{option}</label>
                      </div>
                    ))}
                </div>
              ))}
            </div>
              <div className="flex justify-end">
                  <AddButton type="button"  className='rounded' text='Close' isCancel onClick={handleClose} smallText noIcon />
              </div>
            </div>
        </div>
    </Modal>
  )
}

export default QuestionPreview