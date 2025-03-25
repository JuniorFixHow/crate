'use client'
import AddButton from "@/components/features/AddButton";
// import SearchSelectZones from "@/components/features/SearchSelectZones";
import Address from "@/components/shared/Address";
import Uploader from "@/components/shared/Uploader";
import { IChurch } from "@/lib/database/models/church.model";
import { ErrorProps } from "@/types/Types";
import { Alert } from "@mui/material";
import { CloudinaryUploadWidgetInfo, CloudinaryUploadWidgetResults } from "next-cloudinary";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import SocialMediaLinks from "./SocialMediaLinks";
import { ICampuse } from "@/lib/database/models/campuse.model";
import DynamicCampuses from "./DynamicCampuses";
import { useAuth } from "@/hooks/useAuth";
import { createChurch, deleteChurch, updateChurch } from "@/lib/actions/church.action";
import { createCampuses } from "@/lib/actions/campuse.action";
import { useRouter } from "next/navigation";
import DeleteDialog from "@/components/DeleteDialog";
import React from "react";
// import SearchSelectContracts from "@/components/features/SearchSelectContracts";
import SearchSelectZoneV2 from "@/components/features/SearchSelectZonesV2";
import SearchSelectContractsV2 from "@/components/features/SearchSelectContractsV2";
import { enqueueSnackbar } from "notistack";
import { IContract } from "@/lib/database/models/contract.model";
import { IZone } from "@/lib/database/models/zone.model";
import { canPerformAction, churchRoles } from "@/components/auth/permission/permission";

export type SocialProps = {
    id:string,
    name:string,
    link:string
}

export type CampuseProps = {
    id:string,
    name:string,
    type:'Adults'|'Children'|'Online';
}

type ChurchDetailsProps = {
    currentChurch?:IChurch
}

const ChurchDetails = ({currentChurch}:ChurchDetailsProps) => {
    const [location, setLocation] = useState<string>('');
    const [zoneId, setZoneId] = useState<string>('');
    const [contractId, setContractId] = useState<string>('');
    const [logo, setLogo] = useState<string>('');
    const [data, setData] = useState<Partial<IChurch>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [delloading, setdelLoading] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [response, setResponse] = useState<ErrorProps>(null);
    const [nocontractMode, setnocontractMode] = useState<boolean>(false);
    const [socialLinks, setSocialLinks] = useState<SocialProps[]>([]);
    const [campuses, setCampuses] = useState<CampuseProps[]>([]);

    const {user} = useAuth();
    const router = useRouter();

    const buttonRef = useRef<HTMLButtonElement>(null);

    // const creator = isSuperUser(user!) || isSystemAdmin.creator(user!);
    const updater = canPerformAction(user!, 'updater', {churchRoles});
    const creator = canPerformAction(user!, 'creator', {churchRoles});
    const deleter = canPerformAction(user!, 'deleter', {churchRoles});
    // const reader = isSuperUser(user!) || isSystemAdmin.reader(user!);
    const admin = canPerformAction(user!, 'admin', {churchRoles});


    useEffect(()=>{
        if(user && !admin){
            router.replace('/dashboard/forbidden?p=Church Admin (Internal)')
        }
    },[admin, user, router])

    const contract = currentChurch?.contractId as IContract;
    const zone = currentChurch?.zoneId as IZone;

    const formRef = useRef<HTMLFormElement>(null);
    const handleChange = (e:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
        const {name, value} = e.target;
        setData((pre)=>({
            ...pre,
            [name]:value
        }))
    }

    const showNoContract = async()=>{
        if((contractId === '') && !currentChurch){
            setnocontractMode(true);
        }else{
            buttonRef.current?.click()
        }
    }

    useEffect(()=>{
        if(currentChurch && currentChurch?.socials?.length){
            setSocialLinks(currentChurch.socials);
        }
    },[currentChurch])

    const handleSuccess = async(result:CloudinaryUploadWidgetResults)=>{
        try {
            const info = result.info as CloudinaryUploadWidgetInfo;
            setLogo(info.url);
            if(currentChurch){
                await updateChurch(currentChurch._id, {logo:info.url})
            }
        } catch (error) {
            console.log(error)
            setResponse({message:'Error occured uploading image', error:false})
        }
    }

    const handleNewChurch = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setResponse(null);
        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
        if(submitter.name === 'send'){
            try {
                setLoading(true);
                const body:Partial<IChurch> = {
                    ...data,
                    location,
                    logo,
                    zoneId,
                    contractId:contractId || null,
                    socials:socialLinks,
                    createdBy:user?.userId
                }
                const newChurch = await createChurch(body);
                enqueueSnackbar(newChurch?.message, {variant:newChurch?.error ? 'error':'success'});
                const church = newChurch?.payload as IChurch;
                // setResponse(newChurch);
                if((campuses.length > 0) && (newChurch?.code === 201)){
                    const formattedCampuses:Partial<ICampuse>[] = campuses.map((campuse)=>({
                        name:campuse.name,
                        type:campuse.type,
                        createdBy:user?.userId,
                        churchId:church._id,
                    }))
    
                    const res = await createCampuses(formattedCampuses);
                    enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                }
                formRef.current?.reset();
                setnocontractMode(false);
            } catch (error) {
                console.log(error);
                enqueueSnackbar('Error occured adding church', {variant:'error'});
                setnocontractMode(false);
            }finally{
                setLoading(false);
            }
        }
    }

    const handleUpdateChurch = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setResponse(null);
        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
        if(submitter.name === 'send'){
            try {
                setLoading(true);
                let formattedLinks:SocialProps[] = [];
                if(socialLinks.length >0){
                    formattedLinks = socialLinks.map((item)=>({
                        name:item.name,
                        link:item.link,
                        id:item.id
                    }))
                }
                const body:Partial<IChurch> = {
                    name:data.name || currentChurch?.name,
                    pastor:data.pastor || currentChurch?.pastor,
                    location:location || currentChurch?.location,
                    address:data.address || currentChurch?.address,
                    email:data.email || currentChurch?.email,
                    phone:data.phone || currentChurch?.phone,
                    logo:logo || currentChurch?.logo,
                    zoneId:zoneId || currentChurch?.zoneId,
                    contractId:contractId || currentChurch?.contractId || null,
                    socials:formattedLinks,
                }
                const res = await updateChurch(currentChurch!._id, body);
                enqueueSnackbar(res?.message, {variant:res?.error ? 'error':'success'});
                window.location.reload();
            } catch (error) {
                console.log(error);
                setResponse({message:'Error occured updating church', error:true})
            }finally{
                setLoading(false);
            }

        }
    }

    const handleDeleteChurch = async()=>{
        try {
            setdelLoading(true);
            const res = await deleteChurch(currentChurch!._id);
            enqueueSnackbar(res?.message, {variant: res?.error ? 'error':'success'});
            if(res?.code === 201){
                router.back();
            }
        } catch (error) {
           console.log(error);
           enqueueSnackbar('Error occured deleting church', {variant:'error'});
        }finally{
            setdelLoading(false);
        }
    }
    const message = 'Deleting the church will delete all members that have been registered for it. Proceed?'
    const warning = 'You are about to create a church with no contract. This will render the new church unlicensed. Proceed?'

    if(!admin) return;

  return (
   <form ref={formRef} onSubmit={ currentChurch ? handleUpdateChurch : handleNewChurch}  className='px-4 md:px-8 py-4 flex-col dark:bg-[#0F1214] dark:border flex md:flex-row md:items-stretch gap-6 md:gap-12 items-start bg-white' >
    <div className="flex flex-col gap-5 flex-1">
        <div className="flex flex-col gap-1">
            <span className='text-slate-400 font-semibold text-[0.8rem]' >Church Name</span>
            <input readOnly={!!currentChurch && currentChurch?.name === 'CRATE Main'} required={!currentChurch} onChange={handleChange} defaultValue={currentChurch?.name} placeholder='type here...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="name"  />
        </div>
        <div className="flex flex-col gap-1">
            <span className='text-slate-400 font-semibold text-[0.8rem]' >Pastor Name</span>
            <input /*required={!currentChurch}*/ onChange={handleChange} defaultValue={currentChurch?.pastor} placeholder='type here...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="pastor"  />
        </div>
        <div className="flex flex-col gap-1">
            <span className='text-slate-400 font-semibold text-[0.8rem]' >Email</span>
            <input /*required={!currentChurch}*/ onChange={handleChange} defaultValue={currentChurch?.email} placeholder='type here...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="email" name="email"  />
        </div>
        <div className="flex flex-col gap-1">
            <span className='text-slate-400 font-semibold text-[0.8rem]' >Contact Number</span>
            <input /*required={!currentChurch}*/ onChange={handleChange} defaultValue={currentChurch?.phone} placeholder='type here...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="tel" name="phone"  />
        </div>
        <div className="flex flex-col gap-1">
            <span className='text-slate-400 font-semibold text-[0.8rem]' >Location</span>
            <Address className="w-fit" /*required={!currentChurch}*/ setAddress={setLocation} country={currentChurch?.location} />
        </div>
        <div className="flex flex-col gap-1">
            <span className='text-slate-400 font-semibold text-[0.8rem]' >Zone</span>
            <SearchSelectZoneV2 value={zone?.name} setSelect={setZoneId} require={!currentChurch} />
        </div>

        <div className="flex flex-col gap-1">
            <span className='text-slate-400 font-semibold text-[0.8rem]' >Select Contract</span>
            <SearchSelectContractsV2 value={contract?.title??''}  setSelect={setContractId} />
        </div>

    </div>

    <DeleteDialog value={nocontractMode} setValue={setnocontractMode} title={`Unlicensed church`} message={warning} onTap={async()=>buttonRef.current?.click()} />
    <DeleteDialog value={deleteMode} setValue={setDeleteMode} title={`Delete ${currentChurch?.name}`} message={message} onTap={handleDeleteChurch} />
        {/* RIGHT SIDE */}

    <div className="flex flex-col gap-5 flex-1">
       
         

        <div className="flex flex-col gap-1 items-start">
            <span className='text-slate-400 font-semibold text-[0.8rem]' >Logo</span>
            <div className="flex flex-col items-center gap-2">
                <div className="flex relative w-24 h-24">
                    <Image src={logo || currentChurch?.logo || '/church.jpg'} alt="logo" fill />
                </div>
                <Uploader onSuccess={handleSuccess} className="w-fit" />
            </div>
        </div>
        {/* <div className="flex flex-col gap-1">
            <span className='text-slate-400 font-semibold text-[0.8rem]' >Address</span>
            <textarea required={!currentChurch} defaultValue={currentChurch?.address} onChange={handleChange} className='border rounded resize-none p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]'  name="address"  />
        </div> */}

        {
            !currentChurch &&
            <div className="flex flex-col gap-1">
                <DynamicCampuses campuses={campuses} setCampuses={setCampuses} />
            </div>
        }

        <div className="flex flex-col gap-1">
            <SocialMediaLinks setSocialLinks={setSocialLinks} socialLinks={socialLinks} />
        </div>

        {
            response?.message &&
            <Alert onClose={()=>setResponse(null)} severity={response.error ? 'error':'success'} >{response.message}</Alert>
        }
        <div className="flex flex-row items-center gap-2 mt-4 md:mt-12">
            <AddButton disabled={loading} type="button" onClick={showNoContract} text={loading ? 'loading...' : currentChurch?'Save Changes':'Add Church'} noIcon smallText className={`rounded justify-center w-fit ${!currentChurch && !creator && 'hidden'} ${currentChurch && !updater && 'hidden'}`} />
            <AddButton disabled={loading} ref={buttonRef} type='submit' name="send" text={loading ? 'loading...' : currentChurch?'Save Changes':'Add Church'} noIcon smallText className='rounded w-fit hidden flex-center' />
            <AddButton disabled={loading} onClick={()=>router.back()} text='Cancel' isCancel noIcon smallText className='rounded w-fit flex-center' />
                {
                    currentChurch &&
                    <AddButton disabled={delloading} onClick={()=>setDeleteMode(true)} text='Delete' isDanger noIcon smallText className={`rounded w-fit ${deleter ? 'flex-center':'hidden'}`} />
                }
        </div>
        
    </div>
</form>
  )
}

export default ChurchDetails