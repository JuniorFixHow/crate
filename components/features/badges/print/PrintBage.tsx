'use client'
import React, { useEffect, useRef, useState } from 'react'
import PrintDetails from './PrintDetails'
// import BadgePreview from './BadgePreview'
// import html2canvas from 'html2canvas';
// import { IRegistration } from '@/lib/database/models/registration.model';
// import { updateReg } from '@/lib/actions/registration.action';
import BadgePreviewV2 from './BadgePreviewV2';
import { IMember } from '@/lib/database/models/member.model';
import AddButton from '../../AddButton';
import { useFetchUnregisteredMembers } from '@/hooks/fetch/useEvent';
import { CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getEvent } from '@/lib/actions/event.action';
import BadgePreviewV3 from './BadgePreviewV3';
import { useAuth } from '@/hooks/useAuth';
import { canPerformAction, eventRegistrationRoles } from '@/components/auth/permission/permission';
import { useRouter } from 'next/navigation';

const PrintBage = () => {
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    // const [currentReg, setCurrentReg] = useState<IRegistration|null>(null);
    // const [hasRegistered, setHasRegistered] = useState<boolean>(false);
    const [memberData, setMemberData] = useState<IMember[]>([]);
    const [infoMode, setInfoMode] = useState<boolean>(false);
    const [eventId, setEventId] = useState<string>('');
    const [registeredMembers, setRegisteredMembers] = useState<IMember[]>([]);
    const {isPending, members} = useFetchUnregisteredMembers(eventId, memberData.map((item)=>item?._id));
    const {user} = useAuth();
    const router = useRouter();
    
    const updater = canPerformAction(user!, 'updater', {eventRegistrationRoles});

    useEffect(()=>{
        if(user && !updater){
            router.replace('/dashboard/forbidden?p=Event Registration Updater')
        }
    },[user, updater, router])

    useEffect(()=>{
        const localData = sessionStorage.getItem('printData'); 
        if(localData){
            const data = JSON.parse(localData) as IMember[];
            setMemberData(data);
        }
    },[])

    useEffect(()=>{
        if(members){
            const registered = memberData.filter((reg)=> {
                return !members?.some((item)=>item._id === reg._id);
            })

            setRegisteredMembers(registered);
        }
    },[memberData, members])

    // console.log('registered: ',registeredMembers)
    
    // const printDiv = async () => {
    //     const printableDiv = document.getElementById('printableDiv');
    //     if (printableDiv) {
    //         // Use html2canvas to convert the div to a canvas
    //         const canvas = await html2canvas(printableDiv);
            
    //         // Create an image from the canvas
    //         const imgData = canvas.toDataURL('image/png');
    
    //         // Get the original dimensions of the div
    //         const { width, height } = printableDiv.getBoundingClientRect();
    //         const name = typeof currentReg?.memberId === 'object' && 'name' in currentReg?.memberId && currentReg?.memberId.name;
    //         // Create a new window for printing
    //         const printWindow = window.open('', '_blank');
    //         if (printWindow) {
    //             printWindow.document.write(`<html><head><title>${name}</title>`);
    //             printWindow.document.write(`
    //                 <style>
    //                     body {
    //                         display: flex;
    //                         justify-content: center;
    //                         align-items: center;
    //                         height: 100vh; /* Full height of the viewport */
    //                         margin: 0; /* Remove default margin */
    //                     }
    //                     img {
    //                         width: ${width}px; /* Set image width */
    //                         height: ${height}px; /* Set image height */
    //                     }
    //                 </style>
    //             `);
    //             printWindow.document.write('</head><body>');
    //             printWindow.document.write(`<img src="${imgData}" />`);
    //             printWindow.document.write('</body></html>');
    //             printWindow.document.close();
    
    //             // Wait for the image to load before calling print
    //             const imgElement = printWindow.document.querySelector('img');
    //             imgElement!.onload = async() => {
    //                 printWindow.print();
    //                 const data:Partial<IRegistration> = {badgeIssued:'Yes'};
    //                 if(currentReg && currentReg.badgeIssued === 'No'){
    //                     try {
    //                         await updateReg(currentReg?._id, data);
    //                     } catch (error) {
    //                         console.log(error);
    //                     }
    //                 }
    //             };
    //             imgElement!.onerror = () => {
    //                 console.error('Image failed to load');
    //                 printWindow.close(); // Close the window if the image fails to load
    //             };
    //         }
    //     }
    // };

    const {data:event} = useQuery({
        queryKey:['event', eventId],
        queryFn:()=>getEvent(eventId),
        enabled:!!eventId
    })

    if(!updater) return;

  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-stretch bg-white p-6 w-full shadow-lg border-t-0 dark:bg-[#0F1214] border">
        <PrintDetails setEventId={setEventId} eventId={eventId} memberIds={memberData.map((item)=>item?._id)}  />
        {/* <BadgePreview hasRegistered={hasRegistered} onPrint={printDiv} id='printableDiv' currentReg={currentReg} /> */}
        <div className="flex justify-center items-center flex-1">
            {
                isPending && eventId?
                <CircularProgress size={'2rem'} />
                :
                <>
                {
                    registeredMembers.length>0 &&
                    <AddButton onClick={()=>setInfoMode(true)} type='button' smallText noIcon text='Preview Badges' className='py-3 px-6 rounded' />
                }
                </>
            }
        </div>
        {
            event?.organizers === 'NAGACU'?
            <BadgePreviewV2 eventId={eventId} infoMode={infoMode} setInfoMode={setInfoMode} data={registeredMembers} />
            :
            <BadgePreviewV3 eventId={eventId} infoMode={infoMode} setInfoMode={setInfoMode} data={registeredMembers} />
        }
        <iframe
            ref={iframeRef}
            className=' hidden'
            title="print-iframe"
        />
    </div>
  )
}

export default PrintBage
