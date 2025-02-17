import { IMember } from "@/lib/database/models/member.model";
import { Modal, Tooltip } from "@mui/material";
import { Dispatch, SetStateAction, useRef } from "react";
import '@/components/features/customscroll.css';
import { FaPrint } from "react-icons/fa";
import { IoCloseCircleOutline } from "react-icons/io5";
import Nagacu from "./Nagacu";
// import { handlePrint } from "@/components/pages/churches/contract/single/fxn";
import html2canvas  from 'html2canvas'
// import './printStyles.css';

type BadgePreviewV2Props = {
    infoMode:boolean;
    setInfoMode: Dispatch<SetStateAction<boolean>>;
    data: IMember[];
    eventId:string
}

const BadgePreviewV2 = ({infoMode, eventId, setInfoMode, data}:BadgePreviewV2Props) => {
    const handleClose = ()=>setInfoMode(false);
    const printRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const printDiv = async () => {
        const printableDiv = document.getElementById('printableDiv');
        if (printableDiv) {
            // Use html2canvas to convert the div to a canvas
            const canvas = await html2canvas(printableDiv);
            
            // Create an image from the canvas
            const imgData = canvas.toDataURL('image/png');
    
            // Get the original dimensions of the div
            const { width, height } = printableDiv.getBoundingClientRect();
            // const name = typeof currentReg?.memberId === 'object' && 'name' in currentReg?.memberId && currentReg?.memberId.name;
            // Create a new window for printing
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`<html><head><title>${name}</title>`);
                printWindow.document.write(`
                    <style>
                        body {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            /*height: 100vh;  Full height of the viewport */
                            margin: 0; /* Remove default margin */
                        }
                        img {
                            width: ${width}px; /* Set image width */
                            height: ${height}px; /* Set image height */
                        }
                    </style>
                `);
                printWindow.document.write('</head><body>');
                printWindow.document.write(`<img src="${imgData}" />`);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
    
                // Wait for the image to load before calling print
                const imgElement = printWindow.document.querySelector('img');
                imgElement!.onload = async() => {
                    printWindow.print();
                    window.location.reload();
                    // const data:Partial<IRegistration> = {badgeIssued:'Yes'};
                    // if(currentReg && currentReg.badgeIssued === 'No'){
                    //     try {
                    //         await updateReg(currentReg?._id, data);
                    //     } catch (error) {
                    //         console.log(error);
                    //     }
                    // }
                };
                imgElement!.onerror = () => {
                    console.error('Image failed to load');
                    printWindow.close(); // Close the window if the image fails to load
                };
            }
        }
    };

  return (
    <Modal
        open={infoMode}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        
        >
        <div className='flex size-full items-center justify-center'>
            <div   className="new-modal min-h-[90%] scrollbar-custom overflow-y-scroll relative w-[90%] lg:w-[85%] xl:w-[70%]">
                <div className="flex items-center justify-center">
                    <span className='text-[1.5rem] font-bold dark:text-slate-200' >Badge Preview</span>
                    <div className="flex absolute items-center gap-2 right-0">
                        <Tooltip onClick={printDiv} title='Print' >
                            <FaPrint size={20} className="text-blue-500 cursor-pointer" />
                        </Tooltip>
                        <Tooltip onClick={()=>setInfoMode(false)} title='Close' >
                            <IoCloseCircleOutline className="text-red-600 cursor-pointer" size={24} />
                        </Tooltip>
                    </div>
                </div>
                <iframe
                    ref={iframeRef}
                    className=' hidden'
                    title="print-iframe"
                />
               
                <div ref={printRef} id="printableDiv"  className="flex flex-wrap gap-10 justify-center">
                    {
                        data?.map((member)=>(
                            <Nagacu eventId={eventId} member={member} key={member?._id} />
                        ))
                    }
                </div>

              
            </div>
        </div>
    </Modal>
  )
}

export default BadgePreviewV2