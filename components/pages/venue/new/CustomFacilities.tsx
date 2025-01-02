import { Dispatch, SetStateAction } from 'react'
import { CustomFacilitiesProps } from './NewVenue';
import AddButton from '@/components/features/AddButton';

type DynamicFacilitiesFormProps = {
    facilities:CustomFacilitiesProps[],
    setFacilities:Dispatch<SetStateAction<CustomFacilitiesProps[]>>
}

const DynamicFacilitiesForm = ({facilities, setFacilities}:DynamicFacilitiesFormProps) => {

    const handleAddFacility = () => {
        setFacilities([
            ...facilities,
            { id: Date.now().toString(), name: "", rooms: 1, floor: 1 },
        ]);
    };

    const handleRemoveFacility = (id: string) => {
        setFacilities(facilities.filter((facility) => facility.id !== id));
    };

    const handleChangeFacility = (
        id: string,
        field: keyof CustomFacilitiesProps,
        value: string | number
    ) => {
        setFacilities(
            facilities.map((facility) =>
                facility.id === id ? { ...facility, [field]: value } : facility
            )
        );
    };

   

    return (
        <div  className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-slate-600">Facilities</h2>
            {facilities.map((facility, index) => (
                <div
                    key={facility.id}
                    className="border rounded-md p-4 flex flex-col gap-4 bg-slate-50 dark:bg-[#0f1214] dark:border shadow-sm"
                >
                    <h3 className="text-slate-500 text-[0.8rem] font-semibold">
                        Facility {index + 1}
                    </h3>
                    <div className="flex flex-col">
                        <span className="text-slate-500 text-[0.8rem] font-semibold">
                            Name
                        </span>
                        <input
                            type="text"
                            value={facility.name}
                            onChange={(e) =>
                                handleChangeFacility(facility.id, "name", e.target.value)
                            }
                            required
                            className="border-b w-[18rem] bg-transparent px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]"
                            placeholder="Enter facility name"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-500 text-[0.8rem] font-semibold">
                            Rooms
                        </span>
                        <input
                            type="number"
                            min={1}
                            value={facility.rooms}
                            onChange={(e) =>
                                handleChangeFacility(
                                    facility.id,
                                    "rooms",
                                    Number(e.target.value)
                                )
                            }
                            required
                            className="border-b w-[18rem] bg-transparent px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]"
                            placeholder="Number of rooms"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-500 text-[0.8rem] font-semibold">
                            Floors
                        </span>
                        <input
                            type="text"
                            value={facility.floor}
                            onChange={(e) =>
                                handleChangeFacility(facility.id, "floor", Number(e.target.value))
                            }
                            min={1}
                            required
                            className="border-b w-[18rem] bg-transparent px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]"
                            placeholder="Enter floor number"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => handleRemoveFacility(facility.id)}
                        className="text-red-500 text-sm font-semibold mt-2 hover:text-red-700"
                    >
                        Remove Facility
                    </button>
                </div>
            ))}

            <div className="flex gap-4">
                <AddButton type='button' onClick={handleAddFacility} text='Add Facility' smallText noIcon isCancel className='rounded' />
            </div>
        </div>
    );
};

export default DynamicFacilitiesForm;


