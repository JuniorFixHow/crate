import AddButton from '@/components/features/AddButton'
import  { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from 'react'
import { Alert, Modal, Tooltip } from '@mui/material';
import { ErrorProps } from '@/types/Types';

import { IMember } from '@/lib/database/models/member.model';
import { GoInfo } from 'react-icons/go';
import { IRelationship } from '@/lib/database/models/relationship.model';
import { IChurch } from '@/lib/database/models/church.model';
import { createRelationship, updateRelationship } from '@/lib/actions/relationship.action';
import SearchSelectMultipleMembers from '../features/SearchSelectMultipleMembers';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

export type NewRelationshipProps = {
    infoMode:boolean,
    refetch?:(options?: RefetchOptions) => Promise<QueryObserverResult<IRelationship[], Error>>
    setInfoMode:Dispatch<SetStateAction<boolean>>,
    currentRelationship?:IRelationship|null;
    fixedSelection?:IMember[];
}

const NewRelationship = ({infoMode, refetch, setInfoMode, fixedSelection,  currentRelationship}:NewRelationshipProps) => {
    const [data, setData] = useState<Partial<IRelationship>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<ErrorProps>(null);
    const [selection, setSelection] = useState<IMember[]>(fixedSelection ??[]);

    // const rels = ['Parent', 'Spouse', 'Siblings', 'Children', 'Entire family'];

    const filteredRels = selection.length === 2 
  ? ['Parent', 'Child', 'Spouse', 'Sibling', 'Extend family'] 
  : selection.length > 2 
    ? ['Children', 'Siblings', 'Entire family', 'Extended family'] 
    : [];

    const church = selection[0]?.church as unknown as IChurch;

    // console.log('Fixed Selections: ', selection)

    const formRef = useRef<HTMLFormElement>(null)
    const handleChange = (e:ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>{
        const {name, value} = e.target;
        setData((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    const handleClose = ()=>{
        setSelection([]);
        setInfoMode(false);
    }

    useEffect(()=>{
        if(currentRelationship){
            setSelection(currentRelationship?.members as IMember[]);
        }else{
            setSelection(fixedSelection??[])
        }
    },[currentRelationship, fixedSelection])

    // useEffect(() => {
    //     setSelection(fixedSelection??[]); // Directly update instead of appending
    // }, [fixedSelection]);

    const handleNewRelationship = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setResponse(null);
        try {
            setLoading(true);
            const memberIds = selection.map((item)=>item._id);
            const body:Partial<IRelationship> = {
                ...data, 
                members:memberIds,
                churchId:church?._id
            }
            const res = await createRelationship(body);
            refetch!();
            setResponse(res);
            formRef.current?.reset();
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured creating relationship', error:true})
        }finally{
            setLoading(false);
        }
    }


    const handleUpdateRelationship = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setResponse(null);
        try {
            setLoading(true);
            const memberIds = selection.map((item)=>item._id);
            if(selection.length){
                const body:Partial<IRelationship> = {
                   title:data.title || currentRelationship?.title,
                   description:data.description || currentRelationship?.description,
                   type:data.type || currentRelationship?.type,
                   members:memberIds,
                }
                const res=  await updateRelationship(body);
                refetch!();
                setResponse(res);
            }
        } catch (error) {
            console.log(error);
            setResponse({message:'Error occured updating relationship', error:true})
        }finally{
            setLoading(false);
        }
    }
    // console.log(fixedSelection)

  return (
    <Modal
        open={infoMode}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
        >
        <div className='flex size-full items-center justify-center'>
            <form onSubmit={ currentRelationship ? handleUpdateRelationship : handleNewRelationship} ref={formRef}  className="new-modal scrollbar-custom overflow-y-scroll">
                <span className='text-[1.5rem] font-bold dark:text-slate-200' >{currentRelationship ? "Edit Relationship":"Create Relationship"}</span>
                <div className="flex flex-col gap-6">

                        <div className="flex flex-col">
                            <div className="flex gap-4 items-center">
                                <span className='text-slate-500 text-[0.8rem]' >Relationship title</span>
                                <Tooltip title='A title will help recognize the relationship in your system.' >
                                    <GoInfo className='text-blue-500 cursor-pointer' />
                                </Tooltip>
                            </div>
                            <input onChange={handleChange} name='title' required={!currentRelationship} defaultValue={currentRelationship?.title} type="text" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='Eg. Mr. and Mrs. Smith' />
                        </div>
                        <div className="flex flex-col">
                            <span className='text-slate-500 text-[0.8rem]' >Select Members</span>
                            <SearchSelectMultipleMembers selection={selection} fixedSelection={fixedSelection} setSelection={setSelection} />
                            {/* <SearchSelectEvents  setSelect={setEventId} require={!currentRoom} isGeneric /> */}
                        </div>
                    
                        {
                            selection.length >= 2 &&
                            <div className="flex flex-col">
                                <div className="flex gap-4 items-center">
                                    <span className='text-slate-500 text-[0.8rem]' >Relationship type</span>
                                    <Tooltip title='Note: The relationship will be created on the perspective of the first member selected.' >
                                        <GoInfo className='text-blue-500 cursor-pointer' />
                                    </Tooltip>
                                </div>
                                    <select onChange={handleChange} required={!currentRelationship}  className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' defaultValue={currentRelationship?.type} name="type">
                                        <option className='dark:bg-black dark:text-white' value="">select</option>
                                        {
                                            filteredRels.map((item)=>{
                                                return(
                                                    <option key={item} className='dark:bg-black dark:text-white' value={item}>{item}</option>
                                                )
                                            })
                                        }
                                    </select>
                            </div>
                        }

                    


                    <div className="flex flex-col">
                        <span className='text-slate-500 text-[0.8rem]' >Description</span>
                        <textarea onChange={handleChange} name='description' defaultValue={currentRelationship?.description}  className='border rounded px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='say something about ' />
                    </div>
                    
                </div>

                {
                    response?.message &&
                    <Alert severity={response.error ? 'error':'success'} onClose={()=>setResponse(null)} >{response.message}</Alert>
                }

                <div className="flex flex-row items-center gap-6">
                    {
                        selection.length > 1 &&
                        <AddButton disabled={loading} type='submit'  className='rounded w-[45%] justify-center' text={loading ? 'loading...' : currentRelationship? 'Update':'Create'} smallText noIcon />
                    }
                    <AddButton disabled={loading} className='rounded w-[45%] justify-center' text='Cancel' isCancel onClick={handleClose} smallText noIcon />
                </div>
            </form>
        </div>
    </Modal>
  )
}

export default NewRelationship