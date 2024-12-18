import { IChurch } from "@/lib/database/models/church.model";
import { IEvent } from "@/lib/database/models/event.model";
import { IGroup } from "@/lib/database/models/group.model";
import { IKey } from "@/lib/database/models/key.model";
import { IMember } from "@/lib/database/models/member.model";
import { IRoom } from "@/lib/database/models/room.model";
import { IZone } from "@/lib/database/models/zone.model";
import { IMergedRegistrationData } from "@/types/Types";
// import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const SearchMerged = (merged:IMergedRegistrationData[], search:string, churchId:string, zoneId:string, eventId:string):IMergedRegistrationData[]=>{
    const data = merged
    .filter((item)=>{
        const member = item.memberId as IMember
        const church = member.church as IChurch
        const zone = church.zoneId as IZone
        return zoneId === '' ? item : zone._id === zoneId
    })
    .filter((item)=>{
        const member = item.memberId as IMember
        const church = member.church as IChurch
        return churchId === '' ? item : church._id === churchId
    })
    .filter((item)=>{
        const event = item.eventId as IEvent
        return eventId === '' ? item : event._id === eventId
    })
    .filter((item)=>{
        const member = item.memberId as IMember
        return search === '' ? item : Object.values(member)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    })

    return data;
}





export const saveDataToExcel = async (data: IMergedRegistrationData[], title: string) => {
  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Summary');

  // Transform the data to match your table structure
  const rows = data.map((registration) => {
    const member = registration?.memberId as IMember;
    const church = member?.church as IChurch;
    const zone = church?.zoneId as IZone;
    const group = registration?.groupId as IGroup;
    const rooms = registration?.roomIds as IRoom[];
    const keys = registration?.keys as IKey[];

    return {
      Member: member?.name || 'N/A',
      Zone: zone?.name || 'N/A',
      Church: church?.name || 'N/A',
      Group: group?.name || 'None',
      'Group Type': group?.type || 'NA',
      Rooms: rooms
        ? rooms.map((room) => `${room?.venue} ${room?.number}`).join(', ')
        : 'NA',
      Keys: keys ? keys.map((key) => key?.code).join(', ') : 'None',
    };
  });

  const headers = Object.keys(rows[0] || {});

  // Add title row
  const titleRow = worksheet.addRow([]);
  titleRow.getCell(Math.floor(headers.length / 4) + 1).value = title; // Center title over table
  titleRow.font = { bold: true, size: 14 };
  titleRow.alignment = { horizontal: 'center' };

  // Merge cells for the title
  worksheet.mergeCells(1, Math.floor(headers.length / 4) + 1, 1, headers.length);

  // Add headers row
  const headerRow = worksheet.addRow(headers);
  headerRow.font = { bold: true };
  headerRow.eachCell((cell) => {
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  // Add data rows
  rows.forEach((row) => {
    const dataRow = worksheet.addRow(Object.values(row));
    dataRow.eachCell((cell) => {
      cell.alignment = { horizontal: 'left', vertical: 'middle' };
    });
  });

  // Adjust column widths
  headers.forEach((header, index) => {
    worksheet.getColumn(index + 1).width = header.length + 10; // Adjust width dynamically
  });

  // Generate the Excel file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  // Download the file
  saveAs(blob, `${title}-${new Date().toLocaleDateString()}.xlsx`);
};


