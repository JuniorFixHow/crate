import { IFacility } from "@/lib/database/models/facility.model";
import { IRoom } from "@/lib/database/models/room.model";
import * as xlsx from "xlsx";


export const readRoomsFromExcel = (file: File): Promise<Partial<IRoom>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        // Read the file buffer and parse as workbook
        const workbook = xlsx.read(event.target?.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Define a row type that corresponds to the Excel columns
        type ExcelRow = {
          "Floor"?: string;
          "Room No."?: string;
          "No. of Beds"?: number;
          "Room Type"?: string;
          "Bed Type"?: string;
          "Features"?: string;
        };

        // Convert sheet to JSON with the correct type
        const rows: ExcelRow[] = xlsx.utils.sheet_to_json<ExcelRow>(sheet);

        // Map rows to the Room schema format
        const roomsData: Partial<IRoom>[] = rows.map((row) => ({
          floor: row["Floor"],
          number: row["Room No."],
          nob: row["No. of Beds"],
          roomType: row["Room Type"],
          bedType: row["Bed Type"],
          features: row["Features"],
        }));

        resolve(roomsData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);

    // Read the file as binary string
    reader.readAsBinaryString(file);
  });
};



export const SearchFacility = (facilities:IFacility[], search:string):IFacility[]=>{
    const data = facilities.filter((item)=>{
        return search === '' ? item : Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    })

    return data;
}