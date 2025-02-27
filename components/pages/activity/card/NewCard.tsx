'use client'

import AddButton from "@/components/features/AddButton"
import SearchSelectMembers from "@/components/features/SearchSelectMembers"
import { useFetchCards } from "@/hooks/fetch/useCard"
import { createCard,  updateCard } from "@/lib/actions/card.action"
import { ICard } from "@/lib/database/models/card.model"
import { IMember } from "@/lib/database/models/member.model"
import {  Modal } from "@mui/material"
import { enqueueSnackbar } from "notistack"
import { Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from "react"
import CustomCheck from "../../group/new/CustomCheck"
import { today } from "@/functions/dates"

type NewCardProps = {
    editMode:boolean,
    setEditMode:Dispatch<SetStateAction<boolean>>,
    currentCard:ICard|null,
    setCurrentCard:Dispatch<SetStateAction<ICard|null>>,
}

const NewCard = ({editMode, setEditMode, currentCard, setCurrentCard}:NewCardProps) => {
    // const [response, setResponse] = useState<ErrorProps>(null);
    const [memberId, setMemberId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [expDate, setExpDate] = useState<string>('');
    const [showDate, setShowDate] = useState<boolean>(false);

    const {refetch} = useFetchCards();

    const member = currentCard?.member as IMember;

    const handleClose = ()=>{
        setEditMode(false);
        setCurrentCard(null);
    }

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(()=>{
        if(currentCard){
            setShowDate(currentCard?.expDate !== 'Never')
        }
    },[currentCard])

    const handleNewCard = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try {
            setLoading(true);
            const data:Partial<ICard> = {
                member:memberId,
                churchId:member?.church,
                expDate: expDate || 'Never'
            }
            
            const res = await createCard(data);
            formRef.current?.reset();
            setEditMode(false);
            enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
            refetch();
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured creating card', {variant:'error'});
        }finally{
            setLoading(false);
        }
    }


    const handleUpdateCard = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        try {
            setLoading(true);
            if(currentCard){

                const data:Partial<ICard> = {
                    _id:currentCard?._id,
                    member:memberId || member?._id,
                    expDate: expDate || 'Never'
                }
                const res = await updateCard(data);
                setEditMode(false);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                refetch();
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured updating card', {variant:'error'});
        }finally{
            setLoading(false);
        }
    }

    console.log(currentCard?.expDate)

    // if(!currentCard) return null;

  return (
    <Modal
    open={editMode}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    
    >
    <div className='flex size-full items-center justify-center'>
        <form ref={formRef} onSubmit={currentCard ? handleUpdateCard : handleNewCard}  className="new-modal scrollbar-custom overflow-y-scroll">
            <span className='text-[1.5rem] font-bold dark:text-slate-200' >{currentCard ? "Edit Card":"Create Card"}</span>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col">
                    <span className='text-slate-500 text-[0.8rem]' >Select Member</span>
                    <SearchSelectMembers setSelect={setMemberId} require={!currentCard} value={member?.name} />
                </div>

                <div className="flex gap-4 items-center">
                    <span className='text-slate-500 text-[0.8rem]' >This card is set to expire</span>
                    <CustomCheck onClick={()=>setShowDate(e=> !e)} checked={showDate} />
                </div>
                {
                    showDate && 
                    <div className="flex gap-4">
                        <span className='text-slate-500 text-[0.8rem]' >Set expiry date</span>
                        <input min={!currentCard ? today():''} onChange={(e)=>setExpDate(e.target.value)} name='expDate' required={!currentCard} defaultValue={currentCard?.expDate} type="date" className='border-b px-[0.3rem] dark:bg-transparent dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]' placeholder='DD/MM/YYYY' />
                    </div>
                }
                
            </div>
            

           

            <div className="flex flex-row items-center gap-6">
                <AddButton disabled={loading} type='submit'  className='rounded w-[45%] justify-center' text={loading ? 'loading...' : currentCard? 'Update':'Create'} smallText noIcon />
                
                <AddButton disabled={loading} className='rounded w-[45%] justify-center' text='Cancel' isDanger onClick={handleClose} smallText noIcon />
            </div>
        </form>
    </div>
</Modal>
  )
}

export default NewCard