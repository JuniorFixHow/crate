'use client'
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useRef, useState } from 'react';
import AddButton from '@/components/features/AddButton';
import RegisterForEvent from '@/components/shared/RegisterForEvent';
import SearchSelectChurch from '../shared/SearchSelectChurch';
import { IMember } from '@/lib/database/models/member.model';
import { ErrorProps } from '@/types/Types';
import { getPassword } from '@/functions/misc';
import { createMember, updateMember } from '@/lib/actions/member.action';
import { Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useFetchEvents } from '@/hooks/fetch/useEvent';
import { IRegistration } from '@/lib/database/models/registration.model';
import { createRegistration } from '@/lib/actions/registration.action';
import { addMemberToGroup, getEventGroups } from '@/lib/actions/group.action';
import { IGroup } from '@/lib/database/models/group.model';
import { useAuth } from '@/hooks/useAuth';

export type MRegisterationProps = {
    setHasOpen?:Dispatch<SetStateAction<boolean>>,
    setCurrentMember?:Dispatch<SetStateAction<IMember|null>>,
    currentMemeber?:IMember
}

const MRegisteration = ({currentMemeber, setCurrentMember, setHasOpen,}:MRegisterationProps ) => {

    const [open, setOpen] = useState<boolean>(false);
    const [openG, setOpenG] = useState<boolean>(false);
    const [openV, setOpenV] = useState<boolean>(false);
    const [regLoading, setRegLoading] = useState<boolean>(false);
    const [regError, setRegError] = useState<ErrorProps>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [eventId, setEventId] = useState<string>('');
    const [groupId, setGroupId] = useState<string>('');
    const [newMember, setNewMember] = useState<IMember|null>(null);
    const [church, setChurch] = useState<string>('');
    const [data, setData] = useState<Partial<IMember>>({
        email:'', name:'', ageRange:'', 
         note:'', marital:'Single',
        allergy:'', employ:'Employed', status:'Member', password:'',
    });
    const [error, setError] = useState<ErrorProps>({message:'', error:false});


    const {user} = useAuth();

    const {events} = useFetchEvents();
    const handleChange = (e:ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>{
        const {name, value} = e.target;
        setData((pre)=>({
            ...pre,
            [name]:value,
            church,
        }))
    }

    const router = useRouter();

    const formRef = useRef<HTMLFormElement>(null);
    // console.log(data);
    

    const openEventReg = ()=>{
        setOpen(true);
        setOpenV(true);
        setOpenG(false);
    }

    const openGroupReg = ()=>{
        setOpenV(false);
        setOpenG(true);
    }

    
    const handleEventReg = async()=>{
        setRegError(null);
        try {
            if(newMember){
                setRegLoading(true);
                const data:Partial<IRegistration> = {
                    memberId:newMember._id,
                    eventId,
                    badgeIssued:'No',
                } 
                const res:ErrorProps = await createRegistration( newMember._id, eventId, data);
                setRegError(res);
                if(res?.code === 201){
                    const groups:IGroup[] = await getEventGroups(eventId);
                    if(groups.length){
                        openGroupReg();
                    }
                }
            }
        } catch (error) {
            console.log(error);
            setRegError({message:'Error occured registering the member for the event', error:true});
        }finally{
            setRegLoading(false);
        }
    }

    const handleGroupReg = async()=>{
        setRegError(null);
        try {
            if(newMember){
                setRegLoading(true);
                const res:ErrorProps = await addMemberToGroup(groupId, newMember._id, eventId)
                setRegError(res);  
            }
        } catch (error) {
            console.log(error);
            setRegError({message:'Error occured registering the member for the event', error:true});
        }finally{
            setRegLoading(false);
        }
    }

    
    const handleNewMember = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setLoading(true);
        setError({message:'', error:false});
        try {
            const body:Partial<IMember> = {
                ...data, password:getPassword(data.name!, data.phone!),
                registeredBy:user?.userId, church:user?.churchId
            } 
            const res = await createMember(body);
            const response = res?.payload as IMember
            setNewMember(response);
            setError({message:'Member created successfully', error:false});
            formRef.current?.reset();
            if(events.length){
                openEventReg();
            }
        } catch (error) {
            console.log(error);
            setError({message:'Error occured trying to add member.', error:true})
            
        }finally{
            setLoading(false);
        }
    }

    const handleUpdateMember = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setLoading(true);
        setError({message:'', error:false});
        try {
            if(currentMemeber){
                const body:Partial<IMember> = {
                    name:data.name || currentMemeber.name,
                    email:data.email || currentMemeber.email,
                    phone:data.phone || currentMemeber.phone,
                    marital:data.marital || currentMemeber.marital,
                    dietary:data.dietary || currentMemeber.dietary,
                    allergy:data.allergy || currentMemeber.allergy,
                    employ:data.employ || currentMemeber.employ,
                    status:data.status || currentMemeber.status,
                    ageRange:data.ageRange || currentMemeber.ageRange,
                    church:church||currentMemeber.church
                } 
                const res = await updateMember(currentMemeber._id, body);
                const response = res?.payload as IMember;
                setError({message:'Member updated successfully', error:false})
                setCurrentMember!(response);
                router.refresh();
            }
        } catch (error) {
            console.log(error);
            setError({message:'Error occured trying to update member.', error:true})
            
        }finally{
            setLoading(false);
        }
    }


    // console.log('GID: ', groupId);

  return (
    <form ref={formRef} onSubmit={currentMemeber ? handleUpdateMember : handleNewMember}   className='px-8 py-4 flex-col dark:bg-black dark:border flex md:flex-row gap-6 md:gap-12 items-start bg-white' >
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
                <span className='text-slate-400 font-semibold text-[0.8rem]' >Full Name</span>
                <input required={!currentMemeber} onChange={handleChange} defaultValue={currentMemeber?.name} placeholder='type here...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="name"  />
            </div>
            <div className="flex flex-col gap-1">
                <span className='text-slate-400 font-semibold text-[0.8rem]' >Email</span>
                <input  onChange={handleChange} defaultValue={currentMemeber?.email} placeholder='type here...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="email" name="email"  />
            </div>
            <div className="flex flex-col gap-1">
                <span className='text-slate-400 font-semibold text-[0.8rem]' >Phone Number</span>
                <input required={!currentMemeber} onChange={handleChange} placeholder='eg. +1xxxxxxx' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='tel' name="phone"  />
            </div>
            <RegisterForEvent  
                eventId={eventId} 
                setSelect={setEventId} 
                open={open} 
                setOpen={setOpen} 
                showEvent={openV}
                handleGroup={handleGroupReg}
                setShowEvent={setOpenV}
                showGroup={openG}
                handleEvent={handleEventReg}
                setSelectGroupId={setGroupId}
                groupId={groupId}
                setShowGroup={setOpenG}
                loading={regLoading}
                error={regError}
             />
            <div className="flex flex-row gap-12 items-start">
                {/* <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Type</span>
                    <select onChange={handleChange} className='border text-slate-400 p-1 font-semibold text-[0.8rem] rounded bg-transparent outline-none' defaultValue={currentMemeber?.registerType} >
                        <option className='dark:bg-black' value="Individual">Individual</option>
                        <option className='dark:bg-black' value="Family">Family</option>
                        <option className='dark:bg-black' value="Group">Group</option>
                    </select>
                </div> */}
                
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Age Group</span>
                    <select required={!currentMemeber} onChange={handleChange} name='ageRange'  className='border text-slate-400 p-1 font-semibold text-[0.8rem] rounded bg-transparent outline-none' defaultValue={currentMemeber?.ageRange} >
                        <option className='dark:bg-black' value="">select</option>
                        <option className='dark:bg-black' value="0-5">0-5</option>
                        <option className='dark:bg-black' value="6-10">6-10</option>
                        <option className='dark:bg-black' value="11-20">11-20</option>
                        <option className='dark:bg-black' value="21-30">21-30</option>
                        <option className='dark:bg-black' value="31-40">31-40</option>
                        <option className='dark:bg-black' value="41-50">41-50</option>
                        <option className='dark:bg-black' value="51-60">51-60</option>
                        <option className='dark:bg-black' value="61+">61+</option>
                    </select>
                </div>
            </div>

            

            <div className="flex flex-row gap-12 items-start">
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Gender</span>
                    <div className="flex flex-row items-center gap-2">
                        <input required={!currentMemeber} onChange={handleChange} defaultChecked={currentMemeber?.gender==='Male'} type="radio" name="gender" value='Male'  />
                        <span className='font-semibold text-[0.8rem]' >Male</span>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <input required={!currentMemeber} onChange={handleChange} defaultChecked={currentMemeber?.gender==='Female'} type="radio" name="gender" value='Female'  />
                        <span className='font-semibold text-[0.8rem]' >Female</span>
                    </div>
                  
         
                </div>
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Status</span>
                    
                    <div className="flex flex-row items-center gap-2">
                        <input required={!currentMemeber} onChange={handleChange} defaultChecked={currentMemeber?.status === 'Member'} type="radio" name="status" value='Member'  />
                        <span className='font-semibold text-[0.8rem]' >Member</span>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <input required={!currentMemeber} onChange={handleChange} defaultChecked={currentMemeber?.status === 'Non-member'} type="radio" name="status" value='Non-member'  />
                        <span className='font-semibold text-[0.8rem]' >Non-member</span>
                    </div>
                </div>
            </div>

        </div>

            {/* RIGHT SIDE */}

        <div className="flex flex-col gap-5">
            {
                currentMemeber &&
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Church</span>
                    <SearchSelectChurch require={!currentMemeber} setSelect={setChurch} isGeneric />
                </div>
            }

            <div className="flex flex-row gap-12 items-start">
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Employment Status</span>
                    <select required={!currentMemeber} onChange={handleChange} name='employ'  className='border text-slate-400 p-1 font-semibold text-[0.8rem] rounded bg-transparent outline-none' defaultValue={currentMemeber?.employ} >
                        <option className='dark:bg-black' value="">select</option>
                        <option className='dark:bg-black' value="Employed">Employed</option>
                        <option className='dark:bg-black' value="Unemployed">Unemployed</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Marital Status</span>
                    <select required={!currentMemeber} onChange={handleChange} name='marital'  className='border text-slate-400 p-1 font-semibold text-[0.8rem] rounded bg-transparent outline-none' defaultValue={currentMemeber?.marital} >
                        <option className='dark:bg-black' value="Single">Single</option>
                        <option className='dark:bg-black' value="Married">Married</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <span className='text-slate-400 font-semibold text-[0.8rem]' >Dietary Preference</span>
                <div className="flex flex-row items-center gap-2">
                    <input required={!currentMemeber} onChange={handleChange} defaultChecked={currentMemeber?.dietary==='No'} type="radio" name="dietary" value='No'  />
                    <span className='font-semibold text-[0.8rem]' >No</span>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <input required={!currentMemeber} onChange={handleChange} defaultChecked={currentMemeber?.dietary==='Yes'} type="radio" name="dietary" value='Yes'  />
                    <span className='font-semibold text-[0.8rem]' >Yes</span>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <span className='text-slate-400 font-semibold text-[0.8rem]' >Allergy</span>
                <textarea onChange={handleChange}  placeholder='allergies separated with comma' className='border rounded resize-none p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]'  name="allergy"  />
            </div>

            <div className="flex flex-col gap-1">
                <span className='text-slate-400 font-semibold text-[0.8rem]' >Registration Note</span>
                <textarea onChange={handleChange}  placeholder='say something about this member' className='border rounded p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]'  name="note"  />
            </div>

            {
                error?.message &&
                <Alert onClose={()=>setError({message:'', error:false})} severity={error.error ? 'error':'success'} >{error.message}</Alert>
            }
            <div className="flex flex-row items-center gap-2 mt-4 md:mt-12">
                <AddButton disabled={loading} type='submit' text={loading ? 'loading...' : currentMemeber?'Save Changes':'Add Member'} noIcon smallText className='rounded w-full flex-center' />
                {
                    currentMemeber &&
                    <>
                    <AddButton disabled={loading} onClick={()=>setOpen(true)} text='Register Event' isCancel noIcon smallText className='rounded w-full flex-center' />
                    <AddButton disabled={loading} onClick={()=>setHasOpen!(false)} text='Cancel' isDanger noIcon smallText className='rounded w-full flex-center' />
                    </>
                }
            </div>
            
        </div>
    </form>
  )
}

export default MRegisteration