'use client'
import SearchBar from '@/components/features/SearchBar';
import Subtitle from '@/components/features/Subtitle';
import { Alert, CircularProgress, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Dispatch, SetStateAction,  useState } from 'react';
import { SearchRoomWithoutEvent } from './fxn';
import { SingleAssignmentCoulmns } from './SingleAssignmentCoulmns';
import AddButton from '@/components/features/AddButton';
import { IRoom } from '@/lib/database/models/room.model';
import { useFetchAvailableRooms } from '@/hooks/fetch/useRoom';
import { IGroup } from '@/lib/database/models/group.model';
import { IRegistration } from '@/lib/database/models/registration.model';
import { ErrorProps } from '@/types/Types';
import { addGroupToRoom, addMemberToRoom } from '@/lib/actions/room.action';

type SingleAssignmentTableProps = {
    type:string,
    currentRoom:IRoom,
    currentGroup:IGroup,
    currentRegistration:IRegistration,
    eventId:string|false
    setCurrentRoom:Dispatch<SetStateAction<IRoom|null>>
}

const SingleAssignmentTable = ({type, currentGroup, currentRegistration, setCurrentRoom, eventId, currentRoom}:SingleAssignmentTableProps) => {
    const paginationModel = { page: 0, pageSize: 10 };
    const [search, setSearch] = useState<string>('');
    const [roomIds, setRoomIds] = useState<string[]>([]);
    const [nobs, setNobs] = useState<number|undefined>(undefined);
    const [response, setResponse] = useState<ErrorProps>(null);
    const [addLoading, setAddLoading] = useState<boolean>(false);

    const {rooms, loading} = useFetchAvailableRooms(typeof eventId === 'string' ? eventId:'');

    const handleSelect =(id:string)=>{
        setRoomIds((prev)=>(
            prev.includes(id) ? 
            roomIds.filter((item)=>item !== id)
            :
            [...prev, id]
        ))
    }
   
    const handleRadio = (data:IRoom)=>{
        setCurrentRoom(data?._id === currentRoom?._id ? null:data);
    }

    // console.log(data.regType);
    const handleAssignMember = async()=>{
        try {
            setResponse(null);
            setAddLoading(true);
            if(currentRegistration && currentRoom){
                const memberId = typeof currentRegistration.memberId === 'object' && currentRegistration.memberId._id;
                const res = await addMemberToRoom(memberId.toString(), currentRoom._id);
                if(res){
                    setResponse(res!);
                }
            }
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured adding member to room',error:true});
        }finally{
            setAddLoading(false);
        }
    }

    const handleAssignGroup = async()=>{
        try {
            setResponse(null);
            setAddLoading(true);
            if(currentGroup && eventId){
                const res = await addGroupToRoom(roomIds, currentGroup._id, eventId);
                if(res){
                    setResponse(res!);
                }
            }
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured adding group to room',error:true});
        }finally{
            setAddLoading(false);
        }
    }

  return (
    <div className='flex flex-1 flex-col gap-2' >
        <Subtitle text={type === 'Member' ? 'Pick Room':'Pick Rooms'} />
        <div className="flex flex-col lg:w-fit lg:mt-4">
            <span className='text-slate-500 text-[0.8rem]' >No. of beds</span>
            <input onChange={(e) => {
                    const value = e.target.value; // Get the input value directly
                    setNobs(value === '' ? undefined : parseInt(value)); // Reset to undefined if empty
                }} min={0} type="number" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='type here' />
        </div>
        <SearchBar className='w-fit lg:self-end' setSearch={setSearch} reversed={false} />

        {
            response?.message &&
            <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
        }

        <div className="flex w-full">
            {
                loading ? 
                <div className="flex-center w-full">
                    <CircularProgress className='w-3rem' />
                </div>
                :
              <Paper className='w-full' sx={{ height: 480, }}>
                  <DataGrid
                      rows={SearchRoomWithoutEvent(rooms, search, nobs!)}
                      columns={SingleAssignmentCoulmns(roomIds, handleSelect, currentRoom, handleRadio, type)}
                      initialState={{ pagination: { paginationModel } }}
                      pageSizeOptions={[5, 10]}
                      getRowId={(row:IRoom)=>row._id}
                      // checkboxSelection
                      className='dark:bg-black dark:border dark:text-blue-800'
                      sx={{ border: 0 }}
                  />
              </Paper>
            }
        </div>
        {
            type === 'Member' && currentRoom &&
            <AddButton onClick={handleAssignMember} disabled={addLoading} text={addLoading ? 'loading...':'Assign Room'} noIcon smallText className='py-2 px-4 self-end rounded w-fit' />
        }
        {
            type === 'Group' && roomIds.length > 0 &&
            <AddButton onClick={handleAssignGroup} disabled={addLoading} text={addLoading ? 'loading...':'Assign Room'} noIcon smallText className='py-2 px-4 self-end rounded w-fit' />
        }
    </div>
  )
}

export default SingleAssignmentTable