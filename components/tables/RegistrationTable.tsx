'use client'
import { checkIfAdmin, RegColumns } from '@/components/Dummy/contants';
// import SearchBar from '@/components/features/SearchBar';
// import { searchMember } from '@/functions/search';
import { useFetchMembers } from '@/hooks/fetch/useMember';
import { useAuth } from '@/hooks/useAuth';
import { IMember } from '@/lib/database/models/member.model';
import {  Paper } from '@mui/material';
import { DataGrid, GridToolbar, } from '@mui/x-data-grid';
import { campusRoles, isChurchAdmin, memberRoles } from '../auth/permission/permission';




const RegistrationTable = () => {
    // const [search, setSearch] = useState<string>('');
    const paginationModel = { page: 0, pageSize: 20 };
    // console.log(searchMember(search, members))
    const {members, loading} = useFetchMembers();


    const {user} = useAuth();
    if(!user) return

    const isAdmin = checkIfAdmin(user);

    const showInfo = checkIfAdmin(user) || memberRoles.reader(user) || isChurchAdmin.admin(user);
    const showCampus = isAdmin || campusRoles.admin(user) || isChurchAdmin.admin(user);

  return (
    <div className='table-main2' >
        <div className="flex flex-row items-center justify-between">
            <span className='font-bold text-xl' >Registration</span>
            {/* <SearchBar setSearch={setSearch} reversed /> */}
        </div>

        <div className="flex w-full">
            {
                // loading ? 
                // <LinearProgrewss className='w-full' />
                // :
                <Paper className='w-full' sx={{ height: 'auto', }}>
                    <DataGrid
                        loading={loading}
                        getRowId={(row:IMember)=>row._id}
                        rows={members}
                        columns={RegColumns(showInfo, isAdmin, showCampus)}
                        initialState={{ 
                            pagination: { paginationModel },
                            columns:{
                                columnVisibilityModel:{
                                  registeredBy:false,
                                  phone:false,
                                  status:false,
                                  marital:false,
                                  voice:false,
                                  employ:false,
                                }
                              }
                         }}
                        pageSizeOptions={[5, 10, 15, 20, 30, 50, 100]}
                        // checkboxSelection
                        className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                        sx={{ border: 0 }}
                        slots={{toolbar:GridToolbar}}
                        slotProps={{
                            toolbar:{
                                showQuickFilter:true,
                                printOptions:{
                                    hideFooter:true, hideToolbar:true
                                }
                            }
                        }}
                    />
                </Paper>
            }
        </div>
    </div>
  )
}

export default RegistrationTable