import Image from "next/image"
import { QRCodeSVG } from "qrcode.react"
import { ComponentProps } from "react"
import AddButton from "../../AddButton"
import { IRegistration } from "@/lib/database/models/registration.model"

type BadgePreviewProps = {
    currentReg:IRegistration|null,
    hasRegistered:boolean;
    onPrint:()=>void
} & ComponentProps<'div'>

const BadgePreview = ({onPrint, currentReg, hasRegistered,  ...props}:BadgePreviewProps ) => {
    const code = `${typeof currentReg?.memberId === 'object' && '_id' in currentReg?.memberId && currentReg?.memberId._id},${typeof currentReg?.eventId === 'object' && '_id' in currentReg?.eventId && currentReg?.eventId._id}`;
    // console.log(code)
    const name = typeof currentReg?.memberId === 'object' && 'name' in currentReg?.memberId && currentReg?.memberId.name
  return (
    <div    className="flex flex-col gap-4 flex-1" >
        <span className="text-[0.9rem] font-bold" >Badge Preview</span>

        <div {...props}  className="flex flex-col shadow w-60">
            <div className="flex w-full justify-center px-4 py-3 bg-gradient-to-r from-[#A61C5B] to-[#0A138E]">
                <div className="bg-white w-20 py-1 rounded-full"/>
            </div>
            <div className="flex bg-white items-center justify-center w-full py-2">
                <Image src='/Logo.png' alt="logo" width={150} height={100} />
            </div>
            <div className="flex w-full h-48 items-center justify-center relative bg-gradient-to-r from-[#A61C5B] to-[#0A138E]">
                <div style={{
                    backgroundImage:"url(/logo2.png)", 
                    backgroundSize:'60%', 
                    backgroundPosition:'bottom left',
                    backgroundRepeat:'no-repeat'
                    }}  className="absolute inset-0 bg-cover bg filter brightness-0 invert opacity-30"></div>
                
                    {
                        currentReg &&
                    <div className="flex flex-col gap-4">
                    <span className="text-white font-bold text-center" >{name}</span>
                        <div className="flex items-center justify-center w-28 h-32 bg-white px-1 rounded dark:border">
                            <QRCodeSVG value={code} className="w-full h-full m-auto" />
                        </div>
                    </div>
                    }
                {/* <Image src='/logo2.png' className=" absolute -left-10 -bottom-10 filter brightness-0 invert" alt="logo" height={150} width={150} /> */}
            </div>
        </div>
        {
            currentReg && hasRegistered &&
            <AddButton onClick={onPrint} noIcon smallText className="rounded w-fit" text="Print" />
        }
    </div>
  )
}

export default BadgePreview
