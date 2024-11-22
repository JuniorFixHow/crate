'use client'
import React, { useRef, useState } from 'react'
import PrintDetails from './PrintDetails'
import BadgePreview from './BadgePreview'
import { MemberProps,  } from '@/types/Types'
import html2canvas from 'html2canvas';

const PrintBage = () => {
    const [qrdata, setQrdata] = useState<MemberProps|null>(null)
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
    
            // Create a new window for printing
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`<html><head><title>${qrdata?.name}</title>`);
                printWindow.document.write(`
                    <style>
                        body {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh; /* Full height of the viewport */
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
                imgElement!.onload = () => {
                    printWindow.print();
                };
                imgElement!.onerror = () => {
                    console.error('Image failed to load');
                    printWindow.close(); // Close the window if the image fails to load
                };
            }
        }
    };

  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-stretch bg-white p-6 w-full shadow-lg border-t-0 dark:bg-black border">
        <PrintDetails onTap={printDiv} qrdata={qrdata!} setQrdata={setQrdata} />
        <BadgePreview id='printableDiv' qrdata={qrdata!} />
        <iframe
            ref={iframeRef}
            className=' hidden'
            title="print-iframe"
        />
    </div>
  )
}

export default PrintBage
