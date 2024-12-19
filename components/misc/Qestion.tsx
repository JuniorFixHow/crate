import  { Dispatch, SetStateAction } from "react";
import AddButton from "../features/AddButton";
import { IQuestion } from "@/lib/database/models/question.model";

type QuestionFormProps = {
  customQuestions:Partial<IQuestion>[],
  setCustomQuestions:Dispatch<SetStateAction<Partial<IQuestion>[]>>,
  sectionId:string
}

const QuestionForm = ({customQuestions, sectionId, setCustomQuestions}:QuestionFormProps) => {

  // Handle custom questions
  const addCustomQuestion = () => {
    setCustomQuestions((prev) => [
      ...prev,
      { id: Date.now().toString(), label: "", type: "text", sectionId, options: [] },
    ]);
  };

  const updateCustomQuestion = (id: string, updatedData: Partial<IQuestion>) => {
    setCustomQuestions((prev) =>
      prev.map((question) => (question.id === id ? { ...question, ...updatedData } : question))
    );
  };

  const removeCustomQuestion = (id: string) => {
    setCustomQuestions((prev) => prev.filter((question) => question.id !== id));
  };

  

  return (
    <div className="flex flex-1 flex-col gap-5">
             
    <AddButton noIcon className='rounded flex-center' text='Add Question' onClick={addCustomQuestion} type='button' />
    {customQuestions.map((question) => (
      <div key={question.id} className="border p-4 rounded space-y-2">
        <input
          type="text"
          required
          placeholder="Question Label"
          value={question.label}
          className="border-b w-full p-1 outline-none bg-transparent"
          onChange={(e) => updateCustomQuestion(question.id!, { label: e.target.value })}
        />
        <select
          value={question.type}
          onChange={(e) => updateCustomQuestion(question.id!, { type: e.target.value })}
          className="border p-1 w-full outline-none bg-transparent"
        >
          <option className="dark:bg-[#0F1214] dark:text-white" value="text">Text</option>
          <option className="dark:bg-[#0F1214] dark:text-white" value="number">Text</option>
          <option className="dark:bg-[#0F1214] dark:text-white" value="select">Select</option>
          <option className="dark:bg-[#0F1214] dark:text-white" value="radio">Radio</option>
          <option className="dark:bg-[#0F1214] dark:text-white" value="checkbox">Checkbox</option>
          <option className="dark:bg-[#0F1214] dark:text-white" value="textarea">Textarea</option>
        </select>
        {["select", "radio", "checkbox"].includes(question.type!) && (
          <textarea
            placeholder="Enter options, separated by commas"
            value={question.options?.join(", ") || ""}
            className="border w-full p-1 outline-none bg-transparent"
            onChange={(e) =>
              updateCustomQuestion(question.id!, {
                options: e.target.value.split(",").map((opt) => opt.trim()),
              })
            }
          />
        )}
        <button
          type="button"
          onClick={() => removeCustomQuestion(question.id!)}
          className="text-red-500 text-sm underline"
        >
          Remove Question
        </button>
      </div>
    ))}
  </div>
  );
};

export default QuestionForm;
