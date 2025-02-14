import { IMember } from "@/lib/database/models/member.model";

import * as xlsx from "xlsx";

export const SearchMemberWithEverything = (
    members:IMember[], gender:string,
    status:string, age:string, date:string,
    search:string
):IMember[]=>{
    const data = members.filter((member)=>{
        return gender === '' ? member : member.gender === gender
    })
    .filter((member)=>{
        return age === '' ? member : member.ageRange === age
    })
    .filter((member)=>{
        return status === '' ? member : member.status === status
    })
    .filter((member)=>{
        if(member.createdAt){
            return date === '' ? member : new Date(member.createdAt).toLocaleDateString() === new Date(date).toLocaleDateString()
        }
    })
    .filter((member)=>{
        return search === '' ? member : Object.values(member)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    });
    return data;
}








export const readMembersFromExcel = (file: File): Promise<Partial<IMember>[]> => {
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
          "Full Name"?: string;
          "Gender"?: string;
          "Age Group"?: string;
          "Marital Status"?: string;
          "Employment Status"?: string;
          "Status"?: string;
          "Role"?: string;
          "Voice"?: string;
          "Dietary"?: string;
          "Allergy Note"?: string;
          "Email"?: string;
          "Phone"?: string;
        };

        // Convert sheet to JSON with the correct type
        const rows: ExcelRow[] = xlsx.utils.sheet_to_json<ExcelRow>(sheet);

        // Map rows to the Room schema format
        const roomsData: Partial<IMember>[] = rows.map((row) => ({
          name: row["Full Name"],
          gender: row["Gender"],
          ageRange: row["Age Group"],
          marital: row["Marital Status"],
          employ: row["Employment Status"],
          status: row["Status"],
          role: row["Role"],
          dietary: row["Dietary"],
          allergy: row["Allergy Note"],
          voice: row["Voice"],
          email: row["Email"],
          phone: row["Phone"],
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
