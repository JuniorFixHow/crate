'use client'

import { Alert, LinearProgress, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchBar from "@/components/features/SearchBar";
import AddButton from "@/components/features/AddButton";
import SearchSelectEvents from "@/components/features/SearchSelectEvents";
import DeleteDialog from "@/components/DeleteDialog";
import RevenueInfoModal from "./RevenueInfoModal";
import NewRevenue from "./NewRevenue";
import { ErrorProps } from "@/types/Types";
import { IPayment } from "@/lib/database/models/payment.model";
import { useFetchRevenues } from "@/hooks/fetch/useRevenue";
import { deletePayment } from "@/lib/actions/payment.action";
import { RevenueColumns } from "./RevenueCoulmns";
import SearchSelectZones from "@/components/features/SearchSelectZones";
import SearchSelectChurchForRoomAss from "@/components/features/SearchSelectChurchForRoomAss";
import { calcTotalRevenue, SearchRevenue } from "./fxn";
import { useState } from "react";
import SearchSelectGlobal from "@/components/features/SearchSelectGlobal";
import Link from "next/link";

const RevenueTable = () => {
    const [currentRevenue, setCurrentRevenue] = useState<IPayment|null>(null);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [newMode, setNewMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [eventId, setEventId] = useState<string>('');
    const [churchId, setChurchId] = useState<string>('');
    const [zoneId, setZoneId] = useState<string>('');
    const [purpose, setPurpose] = useState<string>('All');
    const [response, setReponse] = useState<ErrorProps>(null);

    // const searchParams = useSearchParams();

    const {revenues, loading} = useFetchRevenues()
   
    // useEffect(() => {
    //     const fetchChurch = async () => {
    //       const data = searchParams?.get('id');
    //       if (data) {
    //         const room: IRevenue = await getRevenue(data); // Await the promise
    //         setCurrentRevenue(room);
    //         setInfoMode(true);
    //       }
    //     };
      
    //     fetchChurch(); // Call the async function
    //   }, [searchParams]);

    const paginationModel = { page: 0, pageSize: 10 };

    const handleNewRevenue = (data:IPayment)=>{
        setCurrentRevenue(data);
        setNewMode(true);
    }

    const hadndleInfo = (data:IPayment)=>{
        setCurrentRevenue(data);
        setInfoMode(true);
    }
    const hadndleDelete = (data:IPayment)=>{
        setCurrentRevenue(data);
        setDeleteMode(true);
    }

    const handleDeleteRevenue = async()=>{
        try {
            if(currentRevenue){
                await deletePayment(currentRevenue._id);
                setReponse({message:'Payment removed sucsessfully', error:false});
            }
        } catch (error) {
            console.log(error);
            setReponse({message:'Error occured removing room', error:true})
        }
    }

    const handleOpenNew = () =>{
        setNewMode(true);
        setCurrentRevenue(null);
    }

    const selectData = ['Room','Badge','Penalty'];
    const message = `You're about to delete payment information. Are you sure?`;

    const link = process.env.NEXT_PUBLIC_PAYMENT_LINK;
    // useEffect(()=>{
    //     calcTotalRevenue
    // },[])

    return (
      <div className='shadow p-4 flex  gap-6 flex-col bg-white dark:bg-[#0F1214] dark:border rounded' >

         <div className="flex items-center justify-between w-full">
            <div className="flex justify-between items-end w-full" >
                <div className="flex items-end gap-4">
                    <SearchSelectZones isGeneric setSelect={setZoneId} />
                    <SearchSelectChurchForRoomAss zoneId={zoneId} isGeneric setSelect={setChurchId} />
                </div>

                <div className="flex gap-4">
                    <span className="font-bold" >Received:</span>
                    <span>${calcTotalRevenue(SearchRevenue(revenues, search, eventId, zoneId, churchId, purpose))}</span>
                </div>
            </div>
         </div>

          <div className="flex flex-col gap-5 lg:flex-row items-end lg:justify-between w-full">
            <div className="flex items-end gap-4">
                <SearchSelectEvents setSelect={setEventId} isGeneric />
                <SearchSelectGlobal data={selectData} isGeneric setSelect={setPurpose} />
            </div>
            <div className="flex flex-row gap-4  items-center px-0 lg:px-4">
                <SearchBar className='py-[0.15rem]' setSearch={setSearch} reversed={false} />
                <AddButton onClick={handleOpenNew} smallText text='Record Payment' noIcon className='rounded' />
                <Link href={link!} target='_blank' >
                    <AddButton smallText text='Pay Online' noIcon className='rounded' />
                </Link>
            </div>
          </div> 
          <RevenueInfoModal currentRevenue={currentRevenue} setCurrentRevenue={setCurrentRevenue} infoMode={infoMode} setInfoMode={setInfoMode} />
          <DeleteDialog value={deleteMode} setValue={setDeleteMode} title={`Delete Payment`} message={message} onTap={handleDeleteRevenue} />
          <NewRevenue currentRevenue={currentRevenue} setCurrentRevenue={setCurrentRevenue} infoMode={newMode} setInfoMode={setNewMode} />
  
            {
                response?.message &&
                <Alert severity={response.error ? 'error':'success'} >{response.message}</Alert>
            }
          <div className="flex w-full">
            {
                loading ?
                <LinearProgress className="w-full" />
                :
                <Paper className='w-full' sx={{ height: 480, }}>
                    <DataGrid
                        rows={SearchRevenue(revenues, search, eventId, zoneId, churchId, purpose)}
                        columns={RevenueColumns(hadndleInfo,  hadndleDelete, handleNewRevenue)}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10]}
                        getRowId={(row:IPayment):string=>row._id}
                        // checkboxSelection
                        className='dark:bg-[#0F1214] dark:border dark:text-blue-800'
                        sx={{ border: 0 }}
                    />
                </Paper>
            }
          </div>
  
      </div>
    )
}

export default RevenueTable