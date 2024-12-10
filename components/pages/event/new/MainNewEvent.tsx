'use client'
import AddButton from '@/components/features/AddButton'
import { today } from '@/functions/dates'
import { useAuth } from '@/hooks/useAuth'
import { createEvent } from '@/lib/actions/event.action'
import { IEvent } from '@/lib/database/models/event.model'
import { ErrorProps } from '@/types/Types'
import { Alert } from '@mui/material'
import { useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useRef, useState } from 'react'


type QuestionProps = { 
    id: string; 
    label: string; 
    type: string; 
    options?: string[] 
}

const MainNewEvent = () => {
  const [data, setData] = useState<Partial<IEvent>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorProps>(null);
  const [customQuestions, setCustomQuestions] = useState<QuestionProps[]>([]);

  const formRef = useRef<HTMLFormElement>(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewEvent = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const body:Partial<IEvent> = {
        ...data,
        createdBy:user?.userId
      }
      await createEvent(body);
      setError({ message: "Event created successfully", error: false });
      formRef.current?.reset();
    } catch (error) {
      console.log(error);
      setError({ message: "Error occurred creating the event. Please, retry.", error: true });
    } finally {
      setLoading(false);
    }
  };

  // Handle custom questions
  const addCustomQuestion = () => {
    setCustomQuestions((prev) => [
      ...prev,
      { id: Date.now().toString(), label: "", type: "text", options: [] },
    ]);
  };

  const updateCustomQuestion = (id: string, updatedData: Partial<{ label: string; type: string; options: string[] }>) => {
    setCustomQuestions((prev) =>
      prev.map((question) => (question.id === id ? { ...question, ...updatedData } : question))
    );
  };

  const removeCustomQuestion = (id: string) => {
    setCustomQuestions((prev) => prev.filter((question) => question.id !== id));
  };

  return (
    <div className="page">
      <form ref={formRef} onSubmit={handleNewEvent} className="px-8 py-4 flex-col dark:bg-black dark:border flex gap-8 bg-white">
        <span className="font-bold text-xl">Add Event</span>
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-stretch">
          {/* LEFT */}
          <div className="flex flex-1 flex-col gap-5">
            {/* Existing Fields */}
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 font-semibold text-[0.8rem]">Event Name</span>
              <input
                required
                onChange={handleChange}
                placeholder="type here..."
                className="border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]"
                type="text"
                name="name"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 font-semibold text-[0.8rem]">Location</span>
              <input
                required
                onChange={handleChange}
                placeholder="type here..."
                className="border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]"
                type="text"
                name="location"
              />
            </div>
            <div className="flex flex-row gap-12 items-center">
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 font-semibold text-[0.8rem]">Date (From)</span>
                <input
                  required
                  onChange={handleChange}
                  min={today()}
                  placeholder="DD/MM/YYYY"
                  className="border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]"
                  type="date"
                  name="from"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 font-semibold text-[0.8rem]">Date (To)</span>
                <input
                  required
                  onChange={handleChange}
                  min={today()}
                  placeholder="DD/MM/YYYY"
                  className="border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]"
                  type="date"
                  name="to"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 font-semibold text-[0.8rem]">Type</span>
              <select
                required
                onChange={handleChange}
                name="type"
                defaultValue=""
                className="border text-slate-400 p-1 w-fit font-semibold text-[0.8rem] rounded bg-transparent outline-none"
              >
                <option className="dark:bg-black" value="">
                  select
                </option>
                <option className="dark:bg-black" value="Convention">
                  Convention
                </option>
                <option className="dark:bg-black" value="Camp Meeting">
                  Camp Meeting
                </option>
                <option className="dark:bg-black" value="CYP">
                  CYP
                </option>
              </select>
            </div>
          </div>

          {/* Custom Questions */}
          {data.type === "CYP" && (
            <div className="flex flex-1 flex-col gap-5">
             
              <AddButton noIcon className='rounded flex-center' text='Add Question' onClick={addCustomQuestion} type='button' />
              {customQuestions.map((question) => (
                <div key={question.id} className="border p-4 rounded space-y-2">
                  <input
                    type="text"
                    placeholder="Question Label"
                    value={question.label}
                    className="border-b w-full p-1 outline-none"
                    onChange={(e) => updateCustomQuestion(question.id, { label: e.target.value })}
                  />
                  <select
                    value={question.type}
                    onChange={(e) => updateCustomQuestion(question.id, { type: e.target.value })}
                    className="border p-1 w-full outline-none"
                  >
                    <option value="text">Text</option>
                    <option value="number">Text</option>
                    <option value="select">Select</option>
                    <option value="radio">Radio</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="textarea">Textarea</option>
                  </select>
                  {["select", "radio", "checkbox"].includes(question.type) && (
                    <textarea
                      placeholder="Enter options, separated by commas"
                      value={question.options?.join(", ") || ""}
                      className="border w-full p-1 outline-none"
                      onChange={(e) =>
                        updateCustomQuestion(question.id, {
                          options: e.target.value.split(",").map((opt) => opt.trim()),
                        })
                      }
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeCustomQuestion(question.id)}
                    className="text-red-500 text-sm underline"
                  >
                    Remove Question
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-6 flex-row items-center">
          <AddButton type="submit" text={loading ? "loading..." : "Create"} noIcon smallText className="rounded px-4" />
          <AddButton
            type="button"
            onClick={() => router.push("/dashboard/events")}
            text="Cancel"
            isCancel
            noIcon
            smallText
            className="rounded px-4"
          />
        </div>
        {error?.message && (
          <Alert onClose={() => setError(null)} severity={error.error ? "error" : "success"}>
            {error.message}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default MainNewEvent;


