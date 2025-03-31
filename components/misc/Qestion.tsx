import { Dispatch, SetStateAction } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"; // Updated package
import AddButton from "../features/AddButton";
import { IQuestion } from "@/lib/database/models/question.model";

type QuestionFormProps = {
  customQuestions: Partial<IQuestion>[];
  setCustomQuestions: Dispatch<SetStateAction<Partial<IQuestion>[]>>;
  sectionId: string;
};

const QuestionForm = ({ customQuestions, sectionId, setCustomQuestions }: QuestionFormProps) => {
  // Add a new question
  const addCustomQuestion = () => {
    setCustomQuestions((prev) => [
      ...prev,
      { id: Date.now().toString(), label: "", type: "text", sectionId, options: [] },
    ]);
  };

  // Update a question
  const updateCustomQuestion = (id: string, updatedData: Partial<IQuestion>) => {
    setCustomQuestions((prev) =>
      prev.map((question) => (question.id === id ? { ...question, ...updatedData } : question))
    );
  };

  // Remove a question
  const removeCustomQuestion = (id: string) => {
    setCustomQuestions((prev) => prev.filter((question) => question.id !== id));
  };

  // Handle drag-and-drop reordering
  const onDragEnd = (result: DropResult) => {
    console.log("Drag result:", result); // Debugging
    if (!result.destination) return;

    const reorderedQuestions = [...customQuestions];
    const [movedItem] = reorderedQuestions.splice(result.source.index, 1);
    reorderedQuestions.splice(result.destination.index, 0, movedItem);

    setCustomQuestions(reorderedQuestions);
  };

  // console.log(customQuestions[0].label);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <AddButton noIcon className="rounded flex-center" text="Add Question" onClick={addCustomQuestion} type="button" />

      {/* Drag-and-Drop Context */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="questionsList">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {customQuestions.map((question, index) => (
                <Draggable key={question.id} draggableId={question.id!} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="border p-4 rounded space-y-2 bg-white shadow-md cursor-move relative z-10"
                    >
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
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="select">Select</option>
                        <option value="radio">Radio</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="textarea">Textarea</option>
                      </select>
                      {["select", "radio", "checkbox"].includes(question.type!) && (
                        <textarea
                          placeholder="Enter options, separated by semicolons (;)"
                          value={question.options?.join("; ") || ""}
                          className="border w-full p-1 outline-none bg-transparent"
                          onChange={(e) => updateCustomQuestion(question.id!, { options: [e.target.value] })} // Temporary text input
                          onBlur={(e) =>
                            updateCustomQuestion(question.id!, {
                              options: e.target.value
                                .split(";")
                                .map((opt) => opt.trim())
                                .filter((opt) => opt !== ""),
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
                  )}
                </Draggable>
              ))}
              {provided.placeholder} {/* This ensures smooth drag spacing */}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default QuestionForm;
