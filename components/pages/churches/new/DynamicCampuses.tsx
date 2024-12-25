import { Dispatch, SetStateAction } from "react";
import { CampuseProps } from "./ChurchDetails";
import AddButton from "@/components/features/AddButton";



export type DynamicCampuseProps = {
  campuses:CampuseProps[],
  setCampuses:Dispatch<SetStateAction<CampuseProps[]>>
};

const DynamicCampuses = ({campuses, setCampuses}:DynamicCampuseProps) => {

  // Add a new campus
  const handleAddCampus = () => {
    const newCampus: CampuseProps = {
      id: crypto.randomUUID(), // Unique ID for the campus
      name: "New Campus", // Default name
      type: "Adults", // Default type
    };
    setCampuses((prev) => [...prev, newCampus]);
  };

  // Update campus details
  const handleUpdateCampus = (
    id: string,
    field: keyof CampuseProps,
    value: string
  ) => {
    setCampuses((prev) =>
      prev.map((campus) =>
        campus.id === id ? { ...campus, [field]: value } : campus
      )
    );
  };

  // Remove a campus
  const handleRemoveCampus = (id: string) => {
    setCampuses((prev) => prev.filter((campus) => campus.id !== id));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <span className='text-slate-400 font-semibold text-[0.8rem]' >Campuses</span>
        <AddButton onClick={handleAddCampus} type="button" text="Add Campus" className="rounded-full w-fit" smallText />
      </div>

      {campuses.map((campus) => (
        <div
          key={campus.id}
          className="flex items-center gap-2 border p-2 rounded-md"
        >
          <input
            type="text"
            placeholder="Campus Name"
            value={campus.name}
            onChange={(e) =>
              handleUpdateCampus(campus.id, "name", e.target.value)
            }
            className="border outline-none bg-transparent rounded px-2 py-1 w-1/3"
          />
          <select
            value={campus.type}
            onChange={(e) =>
              handleUpdateCampus(campus.id, "type", e.target.value)
            }
            className="border outline-none bg-transparent rounded px-2 py-1 w-1/3"
          >
            <option className="dark:bg-[#0F1214] dark:text-white" value="Adults">Adults</option>
            <option className="dark:bg-[#0F1214] dark:text-white" value="Children">Children</option>
            <option className="dark:bg-[#0F1214] dark:text-white" value="Online">Online</option>
          </select>
          <button
            type="button"
            onClick={() => handleRemoveCampus(campus.id)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default DynamicCampuses;
