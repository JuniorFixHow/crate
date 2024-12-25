'use client'
import AddButton from "@/components/features/AddButton";
import SearchSelectZones from "@/components/features/SearchSelectZones";
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
    const [logo, setLogo] = useState<string>('');
    const [data, setData] = useState<Partial<IChurch>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [delloading, setdelLoading] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [response, setResponse] = useState<ErrorProps>(null);
    const [socialLinks, setSocialLinks] = useState<SocialProps[]>([]);
    const [campuses, setCampuses] = useState<CampuseProps[]>([]);
    const {user} = useAuth();
    const router = useRouter();


    const formRef = useRef<HTMLFormElement>(null);
    const handleChange = (e:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
        const {name, value} = e.target;
        setData((pre)=>({
            ...pre,
            [name]:value
        }))
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
                    socials:socialLinks,
                    createdBy:user?.userId
                }
                const newChurch = await createChurch(body);
                const church = newChurch?.payload as IChurch;
                setResponse(newChurch);
                if((campuses.length > 0) && (newChurch?.code === 201)){
                    const formattedCampuses:Partial<ICampuse>[] = campuses.map((campuse)=>({
                        name:campuse.name,
                        type:campuse.type,
                        createdBy:user?.userId,
                        churchId:church._id,
                    }))
    
                    const res = await createCampuses(formattedCampuses);
                    setResponse(res);
                    formRef.current?.reset();
                }
            } catch (error) {
                console.log(error);
                setResponse({message:'Error occured adding church', error:true})
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
                    socials:formattedLinks,
                }
                const res = await updateChurch(currentChurch!._id, body);
                setResponse(res);
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
            await deleteChurch(currentChurch!._id);
            router.back();
        } catch (error) {
           console.log(error);
           setResponse({message:'Error occured deleting church', error:true}) 
        }finally{
            setdelLoading(false);
        }
    }
    const message = 'Deleting the church will delete all members that have been registered for it. Proceed?'

  return (
    <form ref={formRef} onSubmit={ currentChurch ? handleUpdateChurch : handleNewChurch}  className='px-8 py-4 flex-col dark:bg-black dark:border flex md:flex-row gap-6 md:gap-12 items-start bg-white' >
    <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
            <span className='text-slate-400 font-semibold text-[0.8rem]' >Church Name</span>
            <input required={!currentChurch} onChange={handleChange} defaultValue={currentChurch?.name} placeholder='type here...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="name"  />
        </div>
        <div className="flex flex-col gap-1">
            <span className='text-slate-400 font-semibold text-[0.8rem]' >Pastor Name</span>
            <input required={!currentChurch} onChange={handleChange} defaultValue={currentChurch?.pastor} placeholder='type here...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="pastor"  />
        </div>
        <div className="flex flex-col gap-1">
            <span className='text-slate-400 font-semibold text-[0.8rem]' >Email</span>
            <input required={!currentChurch} onChange={handleChange} defaultValue={currentChurch?.email} placeholder='type here...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="email" name="email"  />
        </div>
        <div className="flex flex-col gap-1">
            <span className='text-slate-400 font-semibold text-[0.8rem]' >Contact Number</span>
            <input required={!currentChurch} onChange={handleChange} defaultValue={currentChurch?.phone} placeholder='type here...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="tel" name="phone"  />
        </div>
        <div className="flex flex-col gap-1">
            <span className='text-slate-400 font-semibold text-[0.8rem]' >Location</span>
            <Address required={!currentChurch} setAddress={setLocation} country={currentChurch?.location} />
        </div>
        <div className="flex flex-col gap-1">
            <span className='text-slate-400 font-semibold text-[0.8rem]' >Zone</span>
            <SearchSelectZones isGeneric setSelect={setZoneId} require={!currentChurch} />
        </div>

    </div>

    <DeleteDialog value={deleteMode} setValue={setDeleteMode} title={`Delete ${currentChurch?.name}`} message={message} onTap={handleDeleteChurch} />
        {/* RIGHT SIDE */}

    <div className="flex flex-col gap-5">
       
         

        <div className="flex flex-col gap-1 items-start">
            <span className='text-slate-400 font-semibold text-[0.8rem]' >Logo</span>
            <div className="flex flex-col items-center gap-2">
                <div className="flex relative w-24 h-24">
                    <Image src={logo || currentChurch?.logo || '/church.jpg'} alt="logo" fill />
                </div>
                <Uploader onSuccess={handleSuccess} className="w-fit" />
            </div>
        </div>
        <div className="flex flex-col gap-1">
            <span className='text-slate-400 font-semibold text-[0.8rem]' >Address</span>
            <textarea required={!currentChurch} defaultValue={currentChurch?.address} onChange={handleChange} className='border rounded resize-none p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]'  name="address"  />
        </div>

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
            <AddButton disabled={loading} type='submit' name="send" text={loading ? 'loading...' : currentChurch?'Save Changes':'Add Church'} noIcon smallText className='rounded w-full flex-center' />
            <AddButton disabled={loading} onClick={()=>{}} text='Cancel' isCancel noIcon smallText className='rounded w-full flex-center' />
                {
                    currentChurch &&
                    <AddButton disabled={delloading} onClick={()=>setDeleteMode(true)} text='Delete' isDanger noIcon smallText className='rounded w-full flex-center' />
                }
        </div>
        
    </div>
</form>
  )
}

export default ChurchDetails