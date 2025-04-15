'use client'
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from 'react';
import AddButton from '@/components/features/AddButton';
// import RegisterForEvent from '@/components/shared/RegisterForEvent';
// import SearchSelectChurch from '../shared/SearchSelectChurch';
import { IMember } from '@/lib/database/models/member.model';
// import { ErrorProps } from '@/types/Types';
import { getAgeCategory, getPassword } from '@/functions/misc';
import { createMember, updateMember } from '@/lib/actions/member.action';
// import { Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useFetchEvents } from '@/hooks/fetch/useEvent';
// import { IRegistration } from '@/lib/database/models/registration.model';
// import { createRegistration } from '@/lib/actions/registration.action';
// import { addMemberToGroup, getEventGroups } from '@/lib/actions/group.action';
// import { IGroup } from '@/lib/database/models/group.model';
import { useAuth } from '@/hooks/useAuth';
// import SearchSelectCampuses from '../features/SearchSelectCampuses';
import { checkIfAdmin } from '../Dummy/contants';
import SearchSelectChurchesV3 from '../features/SearchSelectChurchesV3';
import { enqueueSnackbar } from 'notistack';
import SearchSelectCampusesV2 from '../features/SearchSelectCampusesV2';
import QuestionStarter from '../shared/QuestionStarter';
import RegisterForEventV2 from '../shared/RegisterForEventV2';
import { isChurchAdmin, eventRegistrationRoles, canPerformAction, memberRoles } from '../auth/permission/permission';
import { IChurch } from '@/lib/database/models/church.model';

export type MRegisterationProps = {
    setHasOpen?:Dispatch<SetStateAction<boolean>>,
    // setCurrentMember?:Dispatch<SetStateAction<IMember|null>>,
    currentMemeber?:IMember
}

const MRegisteration = ({currentMemeber,  setHasOpen,}:MRegisterationProps ) => {

    // const [open, setOpen] = useState<boolean>(false);
    // const [openG, setOpenG] = useState<boolean>(false);
    // const [openV, setOpenV] = useState<boolean>(false);
    // const [regLoading, setRegLoading] = useState<boolean>(false);
    // const [regError, setRegError] = useState<ErrorProps>(null);
    // const [groupId, setGroupId] = useState<string>('');
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);
    const [newMember, setNewMember] = useState<IMember|null>(null);
    const [campuseId, setCampuseId] = useState<string>('');
    const [church, setChurch] = useState<string>('');
    
    const [start, setStart] = useState<boolean>(false);
    const [openReg, setOpenReg] = useState<boolean>(false);
    const [eventId, setEventId] = useState<string>('');

    const [data, setData] = useState<Partial<IMember>>({
        role:'Member',
        marital:'Single',
        voice:'None',
        employ:'Employed', status:'Active',
    });
    // const [error, setError] = useState<ErrorProps>({message:'', error:false});
    
    
    const {events} = useFetchEvents();
    const {user} = useAuth();
    const isAdmin = checkIfAdmin(user);
    const creator = canPerformAction(user!, 'creator', {memberRoles})
    const updater = canPerformAction(user!, 'updater', {memberRoles})
    const showRegister = isAdmin || isChurchAdmin.creator(user!) || eventRegistrationRoles.assign(user!);

    useEffect(()=>{
        if(user && (currentMemeber && !updater)){
            router.replace('/dashboard/forbidden?p=Member Updater');
        }
        else if(user && (!currentMemeber && !creator)){
            router.replace('/dashboard/forbidden?p=Member Creator')
        }
    },[creator, currentMemeber, updater, user, router])

    const handleChange = (e:ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>{
        const {name, value} = e.target;
        setData((pre)=>({
            ...pre,
            [name]:value,
            church,
        }))
    }

    const chc = currentMemeber?.church as IChurch;

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(()=>{
        if(currentMemeber){
            setNewMember(currentMemeber)
        }
    },[currentMemeber])
    // console.log(data);

    useEffect(()=>{
        if(!isAdmin && user && !currentMemeber){
            setChurch(user?.churchId);
        }
    },[currentMemeber, isAdmin, user])
    
    // if(!user) return null;

    // const openEventReg = ()=>{
    //     setOpen(true);
    //     setOpenV(true);
    //     setOpenG(false);
    // }

    // const openGroupReg = ()=>{
    //     setOpenV(false);
    //     setOpenG(true);
    // }

    
    // const handleEventReg = async()=>{
    //     setRegError(null);
    //     try {
    //         if(newMember){
    //             setRegLoading(true);
    //             const data:Partial<IRegistration> = {
    //                 memberId:newMember._id,
    //                 eventId,
    //                 badgeIssued:'No',
    //             } 
    //             const res:ErrorProps = await createRegistration( newMember._id, eventId, data);
    //             enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});  
    //             if(res?.code === 201){
    //                 const groups:IGroup[] = await getEventGroups(eventId);
    //                 if(groups.length){
    //                     openGroupReg();
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         enqueueSnackbar('Error occured registering the member for the event')
    //     }finally{
    //         setRegLoading(false);
    //     }
    // }

    // const handleGroupReg = async()=>{
    //     setRegError(null);
    //     try {
    //         if(newMember){
    //             setRegLoading(true);
    //             const res:ErrorProps = await addMemberToGroup(groupId, newMember._id, eventId)
    //             enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});  
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         enqueueSnackbar('Error occured registering the member for the group', {variant:'error'});
    //     }finally{
    //         setRegLoading(false);
    //     }
    // }

    
    const handleNewMember = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setLoading(true);
        // setError({message:'', error:false});
        const year = new Date().getFullYear().toString();
        try {
            const body:Partial<IMember> = {
                ...data, password:getPassword(data.name!.replace(' ',''), year),
                registeredBy:user?.userId, 
                church, 
                campuseId,
            } 
            const res = await createMember(body);
            const response = res?.payload as IMember
            setNewMember(response);
            enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
            formRef.current?.reset();
            if(events.length && res?.code === 201){
                setOpenReg(true);
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured trying to add member.', {variant:'error'})
            
        }finally{
            setLoading(false);
        }
    }

    const handleUpdateMember = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setLoading(true);
        // setError({message:'', error:false});
        try {
            if(currentMemeber){
                const id = currentMemeber?._id;
                const body:Partial<IMember> = {
                    name:data.name || currentMemeber.name,
                    email:data.email || currentMemeber.email,
                    phone:data.phone || currentMemeber.phone,
                    marital:data.marital || currentMemeber.marital,
                    gender:data.gender || currentMemeber.gender,
                    dietary:data.dietary || currentMemeber.dietary,
                    allergy:data.allergy || currentMemeber.allergy,
                    employ:data.employ || currentMemeber.employ,
                    voice:data.voice || currentMemeber.voice,
                    status:data.status || currentMemeber.status,
                    ageRange:data.ageRange || currentMemeber.ageRange,
                    church:church||currentMemeber.church,
                    campuseId:campuseId||currentMemeber.campuseId
                } 
                const res = await updateMember(id, body);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                router.refresh();
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error occured trying to update member', {variant:'error'});
            
        }finally{
            setLoading(false);
        }
    }
    
    
    // console.log('GID: ', groupId);
    
    const cId = isAdmin ? church : user?.churchId;
    
    if(!currentMemeber && !creator) return;

  return (
    <form ref={formRef} onSubmit={currentMemeber ? handleUpdateMember : handleNewMember}   className='px-8 py-4 flex-col dark:bg-black dark:border flex md:flex-row gap-6 md:gap-12 items-start bg-white' >
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
                <span className='text-slate-400 font-semibold text-[0.8rem]' >Full Name</span>
                <input required={!currentMemeber} onChange={handleChange} defaultValue={currentMemeber?.name} placeholder='type here...' className='border-b p-1 outline-none w-full md:w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="name"  />
            </div>
            <div className="flex flex-col gap-1">
                <span className='text-slate-400 font-semibold text-[0.8rem]' >Email</span>
                <input onChange={handleChange} defaultValue={currentMemeber?.email} placeholder='type here...' className='border-b p-1 outline-none w-full md:w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="email" name="email"  />
            </div>
            <div className="flex flex-col gap-1">
                <span className='text-slate-400 font-semibold text-[0.8rem]' >Phone Number</span>
                <input /*required={!currentMemeber}*/ defaultValue={currentMemeber?.phone} onChange={handleChange} placeholder='eg. +1xxxxxxx' className='border-b p-1 outline-none w-full md:w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='tel' name="phone"  />
            </div>
            {/* <RegisterForEvent  
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
             /> */}
             
            {
                (newMember) &&
                <>
                <QuestionStarter memberId={currentMemeber? currentMemeber?._id : newMember?._id} eventId={eventId} start={start} setStart={setStart} />
                <RegisterForEventV2 churchId={chc?._id} eventId={eventId} setEventId={setEventId} open={openReg} setOpen={setOpenReg} memberId={currentMemeber? currentMemeber?._id : newMember?._id} setShowStart={setStart}  />
                </>
            }
            <div className="flex flex-row gap-12 items-start">
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Role</span>
                    <select name='role' onChange={handleChange} className='border text-slate-400 p-1 font-semibold text-[0.8rem] rounded bg-transparent outline-none' defaultValue={currentMemeber?.role} >
                        <option className='dark:bg-black' value="Member">Member</option>
                        <option className='dark:bg-black' value="Local Church Ministry Leader">Local Church Ministry Leader</option>
                        <option className='dark:bg-black' value="NAGSDA Official">NAGSDA Official</option>
                        <option className='dark:bg-black' value="Departmental Leader">Departmental Leader</option>
                        <option className='dark:bg-black' value="Local Church Elder">Local Church Elder</option>
                        <option className='dark:bg-black' value="Pastor">Pastor</option>
                        <option className='dark:bg-black' value="Non-member">Non-member</option>
                        <option className='dark:bg-black' value="Non-Member (Guest)">Non-Member (Guest)</option>
                        <option className='dark:bg-black' value="Non-Adventist (Guest)">Non-Adventist (Guest)</option>
                    </select>
                </div>
                
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
                {/* <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Status</span>
                    
                    <div className="flex flex-row items-center gap-2">
                        <input required={!currentMemeber} onChange={handleChange} defaultChecked={currentMemeber?.status === 'Active'} type="radio" name="status" value='Active'  />
                        <span className='font-semibold text-[0.8rem]' >Active</span>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <input required={!currentMemeber} onChange={handleChange} defaultChecked={currentMemeber?.status === 'Non-active'} type="radio" name="status" value='Non-active'  />
                        <span className='font-semibold text-[0.8rem]' >Non-active</span>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <input required={!currentMemeber} onChange={handleChange} defaultChecked={currentMemeber?.status === 'Moved away'} type="radio" name="status" value='Moved away'  />
                        <span className='font-semibold text-[0.8rem]' >Moved away</span>
                    </div>
                </div> */}
            </div>

        </div>

            {/* RIGHT SIDE */}

        <div className="flex flex-col gap-5">
            {
                (isAdmin) &&
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Church</span>
                    <SearchSelectChurchesV3 require={!currentMemeber} setSelect={setChurch} />
                </div>
            }
            {
                user &&
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Campus</span>
                    <SearchSelectCampusesV2  require={!currentMemeber} churchId={cId as string} setSelect={setCampuseId} />
                </div>
            }

            <div className="flex flex-col gap-5 md:flex-row md:gap-12 items-start">
               {/* <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Employment Status</span>
                    <select required={!currentMemeber} onChange={handleChange} name='employ'  className='border text-slate-400 p-1 font-semibold text-[0.8rem] rounded bg-transparent outline-none' defaultValue={currentMemeber?.employ} >
                        <option className='dark:bg-black' value="">select</option>
                        <option className='dark:bg-black' value="Employed - Professional">Employed - Professional</option>
                        <option className='dark:bg-black' value="Self Employed">Self Employed</option>
                        <option className='dark:bg-black' value="Employed - Retail">Employed - Retail</option>
                        <option className='dark:bg-black' value="Employed - Healthcare">Employed - Healthcare</option>
                        <option className='dark:bg-black' value="Employed- Others">Employed- Others</option>
                        <option className='dark:bg-black' value="Student - EC to KG">Student - EC to KG</option>
                        <option className='dark:bg-black' value="Student - Elementary">Student - Elementary</option>
                        <option className='dark:bg-black' value="Student -Middle School">Student -Middle School</option>
                        <option className='dark:bg-black' value="Student - High School">Student - High School</option>
                        <option className='dark:bg-black' value="Student University">Student University</option>
                        <option className='dark:bg-black' value="Retired">Retired</option>
                        <option className='dark:bg-black' value="Not currently working">Not currently working</option>
                    </select>
                </ div> */}

                {
                    getAgeCategory(data.ageRange!) === 'Adult' &&
                    <div className="flex flex-col gap-1">
                        <span className='text-slate-400 font-semibold text-[0.8rem]' >Marital Status</span>
                        <select required={!currentMemeber} onChange={handleChange} name='marital'  className='border text-slate-400 p-1 font-semibold text-[0.8rem] rounded bg-transparent outline-none' defaultValue={currentMemeber?.marital} >
                            <option className='dark:bg-black' value="Single">Single</option>
                            <option className='dark:bg-black' value="Married">Married</option>
                            <option className='dark:bg-black' value="Separated">Separated</option>
                            <option className='dark:bg-black' value="Widow">Widow</option>
                        </select>
                    </div>
                }
            </div>

            {/* <div className="flex flex-col gap-1 w-fit">
                <span className='text-slate-400 font-semibold text-[0.8rem]' >Voice</span>
                <select required={!currentMemeber} onChange={handleChange} name='voice'  className='border text-slate-400 p-1 font-semibold text-[0.8rem] rounded bg-transparent outline-none' defaultValue={currentMemeber?.voice} >
                    <option className='dark:bg-black' value="">None</option>
                    <option className='dark:bg-black' value="Soprano">Soprano</option>
                    <option className='dark:bg-black' value="Alto">Alto</option>
                    <option className='dark:bg-black' value="Tenor">Tenor</option>
                    <option className='dark:bg-black' value="Bass">Bass</option>
                </select>
            </div> */}

            {/* <div className="flex flex-col gap-1">
                <span className='text-slate-400 font-semibold text-[0.8rem]' >Dietary Preference</span>
                <div className="flex flex-row items-center gap-2">
                    <input required={!currentMemeber} onChange={handleChange} defaultChecked={currentMemeber?.dietary==='No'} type="radio" name="dietary" value='Vegetarian'  />
                    <span className='font-semibold text-[0.8rem]' >Vegetarian</span>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <input required={!currentMemeber} onChange={handleChange} defaultChecked={currentMemeber?.dietary==='Yes'} type="radio" name="dietary" value='Non-vegetarian'  />
                    <span className='font-semibold text-[0.8rem]' >Non-vegetarian</span>
                </div>
            </div> */}

            {/* <div className="flex flex-col gap-1">
                <span className='text-slate-400 font-semibold text-[0.8rem]' >Allergy</span>
                <textarea onChange={handleChange}  placeholder='allergies separated with comma' className='border rounded resize-none p-1 outline-none w-full md:w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]'  name="allergy"  />
            </div> */}

            <div className="flex flex-col gap-1">
                <span className='text-slate-400 font-semibold text-[0.8rem]' >Member Note</span>
                <textarea onChange={handleChange}  placeholder='say something about this member' className='border rounded p-1 outline-none w-full md:w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]'  name="note"  />
            </div>

            {/* {
                error?.message &&
                <Alert onClose={()=>setError({message:'', error:false})} severity={error.error ? 'error':'success'} >{error.message}</Alert>
            } */}
            <div className="flex flex-row items-center gap-2 mt-4 md:mt-12">
                <AddButton disabled={loading} type='submit' text={loading ? 'loading...' : currentMemeber?'Save Changes':'Add Member'} noIcon smallText className={`rounded w-full justify-center ${currentMemeber && !updater && 'hidden'} ${!currentMemeber && !creator && 'hidden'}`} />
                {
                    currentMemeber &&
                    <>
                    {
                        showRegister &&
                        <AddButton disabled={loading} onClick={()=>setOpenReg(true)} text='Register Event' isCancel noIcon smallText className='rounded w-full flex-center' />
                    }
                    <AddButton disabled={loading} onClick={()=>setHasOpen!(false)} text='Cancel' isDanger noIcon smallText className='rounded w-full flex-center' />
                    </>
                }
            </div>
            
        </div>
    </form>
  )
}

export default MRegisteration