import { AttendanceColumns } from "@/Dummy/contants";
import { AttendanceData } from "@/Dummy/Data";
import SearchBar from "@/features/SearchBar";
import { searchAttenance } from "@/functions/search";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
// import { useRouter } from "next/router";
import { useState } from "react";

const AttendanceTable = () => {
    const [search, setSearch] = useState<string>('')
    const paginationModel = { page: 0, pageSize: 10 };
    // const router = useRouter();
  return (
    <div className="flex flex-col gap-4 p-4 bg-white border dark:bg-black rounded">
        <div className="flex items-center flex-row justify-between w-full">
            <SearchBar className='py-1' setSearch={setSearch} reversed={false} />
        </div>

        <div className="flex border md:w-full xl:w-2/3 rounded">
            <Paper className='' sx={{ height: 480, }}>
                <DataGrid
                    rows={searchAttenance(search, AttendanceData)}
                    columns={AttendanceColumns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    // checkboxSelection
                    className='dark:bg-black dark:border dark:text-blue-800'
                    sx={{ border: 0 }}
                />
            </Paper>
        </div>
    </div>
  )
}

export default AttendanceTable