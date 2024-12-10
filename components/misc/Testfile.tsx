import React, { useState } from "react";

type Question = {
  id: string;
  label: string;
  type: "text" | "select" | "radio" | "checkbox";
  options?: string[]; // For select, radio, or checkbox types
};

const DynamicForm: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [formResponses, setFormResponses] = useState<Record<string, string | string[]>>({});

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now().toString(), label: "", type: "text", options: [] },
    ]);
  };

  const updateQuestion = (id: string, updatedQuestion: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updatedQuestion } : q))
    );
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    setFormResponses((prev) => {
      const updatedResponses = { ...prev };
      delete updatedResponses[id];
      return updatedResponses;
    });
  };

  const handleResponseChange = (id: string, value: string | string[]) => {
    setFormResponses((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Responses:", formResponses);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Dynamic Form</h1>

      {/* Add Questions */}
      <div className="my-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={addQuestion}
        >
          Add Question
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="border p-4 rounded space-y-2">
            {/* Question Label */}
            <input
              type="text"
              className="w-full border-b py-1 px-2 outline-none"
              placeholder="Enter question label"
              value={question.label}
              onChange={(e) =>
                updateQuestion(question.id, { label: e.target.value })
              }
            />

            {/* Question Type */}
            <select
              className="w-full border py-1 px-2"
              value={question.type}
              onChange={(e) =>
                updateQuestion(question.id, { type: e.target.value as Question["type"], options: [] })
              }
            >
              <option value="text">Text</option>
              <option value="select">Select</option>
              <option value="radio">Radio</option>
              <option value="checkbox">Checkbox</option>
            </select>

            {/* Options for Select, Radio, Checkbox */}
            {["select", "radio", "checkbox"].includes(question.type) && (
              <div>
                <label className="block text-sm font-medium mb-2">Options</label>
                <textarea
                  className="w-full border py-1 px-2"
                  placeholder="Enter options, separated by commas"
                  value={question.options?.join(", ") || ""}
                  onChange={(e) =>
                    updateQuestion(question.id, {
                      options: e.target.value.split(",").map((opt) => opt.trim()),
                    })
                  }
                />
              </div>
            )}

            {/* Render Input Field for User Response */}
            <div>
              <label className="block text-sm font-medium">{question.label}</label>
              {question.type === "text" && (
                <input
                  type="text"
                  className="w-full border py-1 px-2"
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                />
              )}
              {question.type === "select" && question.options && (
                <select
                  className="w-full border py-1 px-2"
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                >
                  <option value="">Select an option</option>
                  {question.options.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
              {question.type === "radio" && question.options && (
                <div className="space-y-1">
                  {question.options.map((option, idx) => (
                    <label key={idx} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        onChange={(e) => handleResponseChange(question.id, e.target.value)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
              {question.type === "checkbox" && question.options && (
                <div className="space-y-1">
                  {question.options.map((option, idx) => (
                    <label key={idx} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={option}
                        onChange={(e) => {
                          const currentValues = (formResponses[question.id] as string[]) || [];
                          handleResponseChange(
                            question.id,
                            e.target.checked
                              ? [...currentValues, option]
                              : currentValues.filter((v) => v !== option)
                          );
                        }}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Remove Question */}
            <button
              className="text-red-500 text-sm underline"
              onClick={() => removeQuestion(question.id)}
              type="button"
            >
              Remove Question
            </button>
          </div>
        ))}

        {/* Submit Button */}
        {questions.length > 0 && (
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Submit
          </button>
        )}
      </form>
    </div>
  );
};

export default DynamicForm;
