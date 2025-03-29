import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { Paper } from '@mui/material';
import { useFetchResponseForSetV2 } from '@/hooks/fetch/useResponse';
import { IResponse } from '@/lib/database/models/response.model';
import { IQuestion } from '@/lib/database/models/question.model';
import { IMember } from '@/lib/database/models/member.model';
import { ICYPSet } from '@/lib/database/models/cypset.model';
import { SearchResponseWithJustSection } from './fxn';


interface ByTableProps {
    setId: string;
    sectionId:string;
  }
  
  type MiniMemberProps = {
    id: string;
    memberName: string;
    [key: string]: unknown; // Allow dynamic keys for question responses
  };
  
  const ByTable = ({ setId, sectionId }: ByTableProps) => {
    const { responses, loading } = useFetchResponseForSetV2(setId);
    const set = responses[0]?.cypsetId as ICYPSet;
  
    // Extract unique questions for column headers
    const questionMap = new Map<string, string>();
    SearchResponseWithJustSection(responses,sectionId).forEach((res: IResponse) => {
      const question = res.questionId as IQuestion;
      if (question?._id) {
        questionMap.set(question._id, question.label);
      }
    });
  
    // Define columns
    const COLUMNS: GridColDef[] = [
      {
        field: 'memberName',
        headerName: 'Respondent',
        width: 200,
      },
      ...Array.from(questionMap).map(([questionId, label]) => ({
        field: questionId,
        headerName: label,
        width: 250,
        renderCell: (params: GridRenderCellParams) => {
          const value = params.value;
          return Array.isArray(value) ? value.join(', ') : value || 'N/A';
        },
      })),
    ];
  
    // Transform responses into rows
    const rowMap = new Map<string, MiniMemberProps>();
  
    SearchResponseWithJustSection(responses, sectionId).forEach((res: IResponse) => {
      const member = res.memberId as IMember;
      const memberId = member._id;
  
      if (!rowMap.has(memberId)) {
        rowMap.set(memberId, {
          id: memberId,
          memberName: member.name || 'Unknown',
        });
      }
  
      const row = rowMap.get(memberId)!;
      row[(res.questionId as IQuestion)._id] = res.answer || res.options || 'N/A';
    });
  
    const ROWS = Array.from(rowMap.values());
  
    return (
      <div className="table-main2">
        <div className="flex w-full">
          <Paper className="w-full" sx={{ height: 'auto' }}>
            <DataGrid
              loading={loading}
              rows={ROWS}
              columns={COLUMNS}
              initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
              pageSizeOptions={[5, 10, 15, 20, 30, 100]}
              getRowId={(row) => row.id}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  printOptions: {
                    hideFooter: true,
                    hideToolbar: true,
                  },
                  csvOptions:{
                    utf8WithBom:true,
                    fileName: `${set?.title} responses`
                  }
                },
              }}
              className="dark:bg-[#0F1214] dark:border dark:text-blue-800"
              sx={{ border: 0 }}
            />
          </Paper>
        </div>
      </div>
    );
  };
  
  export default ByTable;
  