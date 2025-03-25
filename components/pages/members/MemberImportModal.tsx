import AddButton from "@/components/features/AddButton";

import { ErrorProps } from "@/types/Types";
import { Alert, Modal } from "@mui/material";
import Image from "next/image";
import { Dispatch, FormEvent, SetStateAction, useRef, useState } from "react";

import { LuUpload } from "react-icons/lu";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
// import SearchSelectChurch from "@/components/shared/SearchSelectChurch";
// import SearchSelectCampuses from "@/components/features/SearchSelectCampuses";
import { IMember } from "@/lib/database/models/member.model";
import { createMembers } from "@/lib/actions/member.action";
import { getPassword } from "@/functions/misc";
import { readMembersFromExcel } from "./fxns";
import { enqueueSnackbar } from "notistack";
import { useFetchMembers } from "@/hooks/fetch/useMember";
import SearchSelectChurchesV3 from "@/components/features/SearchSelectChurchesV3";
import SearchSelectCampusesV2 from "@/components/features/SearchSelectCampusesV2";
import { checkIfAdmin } from "@/components/Dummy/contants";

type MemberImportModalProps = {
    infoMode:boolean;
    setInfoMode:Dispatch<SetStateAction<boolean>>;
}

const MemberImportModal = ({infoMode, setInfoMode}:MemberImportModalProps) => {
    const [campusId, setCampusId] = useState<string>('');
    const [churchId, setChurchId] = useState<string>('');

    const [response, setResponse] = useState<ErrorProps>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [memberData, setMembersData] = useState<Partial<IMember>[]>([]);
    const {user} = useAuth();
    const {refetch} = useFetchMembers()

    const passPiece = new Date().getMonth().toString() + new Date().getFullYear().toString();

    const fileRef = useRef<HTMLInputElement>(null);
    const handleClose =()=>{
        setInfoMode(false);
        setCampusId('');
        setChurchId('');
    }
    // alert(new Date().getMonth())

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          try {
            const data = await readMembersFromExcel(file);
            setMembersData(data);
            // console.log(data);
          } catch (error) {
            console.error("Error reading Excel file:", error);
          }
        }
    };

    const handleLoadMembers = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
    
            if (memberData.length === 0) {
                setResponse({ message: 'No members fetched', error: true });
                return;
            }
    
            
    
            if (memberData.length > 0) {
                // const resMessage = `${memberData.length} of ${memberData.length} members inserted successfully`;
                // const church = check
                const body: Partial<IMember>[] = memberData.map((member) => ({
                    ...member,
                    church: churchId || user?.churchId,
                    campuseId:campusId,
                    password: getPassword(member.name!, passPiece),
                    registeredBy:user?.userId
                }));
    
                const res = await createMembers(body);
                refetch();
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                setResponse(res);
                setChurchId('');
                setCampusId('');
                setInfoMode(false);
            } else {
                setResponse({ message: 'No valid members found in the dataset', error: true });
            }
        } catch (error) {
            console.error('Error inserting members:', error);
            setResponse({ message: 'Error occurred inserting members', error: true });
        } finally {
            setLoading(false);
        }
    };
    

    const loadFile = async()=>{
        fileRef.current?.click()
    }

    if(!user) return;
    const isAdmin = checkIfAdmin(user);
    const cId = isAdmin ? churchId : user?.churchId;

  return (
    <Modal
        open={infoMode}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <div className='flex size-full items-center justify-center'>
            <form onSubmit={handleLoadMembers}  className="new-modal scrollbar-custom overflow-y-scroll">
                <span className='text-[1.5rem] font-bold dark:text-slate-200 text-center md:text-left' >Import Members</span>
                <div className="flex flex-col w-full items-center">
                    <div className="w-32 h-20 relative">
                        <Image alt="excel" fill src='/excel.png' />
                    </div>
                    <div onClick={loadFile} className="flex-center p-1 border rounded-full bg-transparent cursor-pointer">
                        <LuUpload className="dark:text-white" size={26} />
                    </div>
                    <input ref={fileRef}  className="hidden" type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
                    <span className="text-[0.8rem] italic font-bold mt-2 dark:text-slate-400" >{memberData?.length+' members loaded'}</span>
                    <Link href='/docs/Members Template.xlsx' download='Members Template.xlsx'   className="table-link w-fit text-center" >Download upload template</Link>
                </div>
                <div className="flex flex-col gap-6">
                    {
                        isAdmin &&
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Choose Church</span>
                            <SearchSelectChurchesV3 setSelect={setChurchId} require />
                        </div>
                    }
                    {
                        cId &&
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Select Campus</span>
                            <SearchSelectCampusesV2 churchId={churchId} setSelect={setCampusId} require />
                        </div>
                    }
                    
                                      
                </div>

                {
                    response?.message &&
                    <Alert onClose={()=>setResponse(null)} severity={response.error ? `error`:'success'} >{response.message}</Alert>
                }

                <div className="flex flex-row items-center justify-between">
                    {
                        campusId &&
                        <AddButton disabled={loading} type="submit"  className='rounded w-[45%] justify-center' text={loading? 'loading...' :'Proceed'} smallText noIcon />
                    }
                    <AddButton disabled={loading} type="button"  className='rounded w-[45%] justify-center' text='Cancel' isCancel onClick={handleClose} smallText noIcon />
                </div>
            </form>
        </div>
    </Modal>
  )
}

export default MemberImportModal