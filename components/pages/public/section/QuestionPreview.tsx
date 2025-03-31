// import AddButton from "@/components/features/AddButton"
import { ICYPSet } from "@/lib/database/models/cypset.model"
import { IQuestion } from "@/lib/database/models/question.model"
import { ISection } from "@/lib/database/models/section.model"
import { Modal } from "@mui/material"
import { Dispatch, SetStateAction } from "react";
import '../../../features/customscroll.css';
import { IoMdClose } from "react-icons/io"

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
        className=""
        >
          <div className="flex flex-col items-center size-full bg-[#F0EBF8] relative">
            <IoMdClose onClick={handleClose} className="cursor-pointer text-red-600 absolute right-4 top-4"  size={24}/>
            <div className='flex flex-col gap-8  h-[95vh]   dark:border w-[90%] md:w-[60%] rounded p-6'>
              <div className="flex flex-col gap-2 items-center">
                {
                  section.number === 1 &&
                  <span className="text-[1.5rem] font-bold" >{cyp?.title}</span>
                }
                <span className="font-semibold text-2xl" >Section {section.number} - {section?.title}</span>
              </div>
              <div className="flex grow flex-col justify-between overflow-y-scroll scrollbar-custom2 px-4">
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
                      <input
                        
                        type="text"
                        className="border-b w-full p-1 outline-none rounded bg-transparent placeholder:text-slate-800 placeholder:text-[0.9rem] placeholder:font-normal"
                        placeholder={`Your answer`}
                      />
                    )}

                    {question.type === "textarea" && (
                      <textarea
                        className="border-b w-full p-1 rounded outline-none bg-transparent placeholder:text-slate-800 placeholder:text-[0.9rem] placeholder:font-normal"
                        placeholder={`Your answer`}
                      ></textarea>
                    )}

                    {question.type === "number" && (
                      <input
                        type="number"
                        className="border-b rounded w-full p-1 outline-none bg-transparent placeholder:text-slate-800 placeholder:text-[0.9rem] placeholder:font-normal"
                        placeholder={`Your answer`}
                      />
                    )}

                    {question.type === "select" && (
                      <select className="border-b rounded p-1 w-full outline-none bg-transparent placeholder:text-slate-800 placeholder:text-[0.9rem] placeholder:font-normal">
                        {question.options?.map((option, index) => (
                          <option
                            key={index}
                            value={option}
                            className=""
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
                          <label className="" htmlFor={`${question.id}-${index}`}>{option}</label>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
                {/* <div className="flex justify-end">
                    <AddButton type="button"  className='rounded' text='Close' isCancel onClick={handleClose} smallText noIcon />
                </div> */}
              </div>
            </div>
          </div>
    </Modal>
  )
}

export default QuestionPreview