import { MemberProps } from "@/types/Types"
import Image from "next/image"
import { QRCodeSVG } from "qrcode.react"
import { ComponentProps } from "react"

const BadgePreview = ({qrdata,  ...props}:{qrdata:MemberProps} & ComponentProps<'div'>) => {
    const mydata = {
        memberid:'123',
        roomid:'123',
        eventid:'123',
        groupid:'123',

    }
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
                        qrdata &&
                    <div className="flex flex-col gap-4">
                    <span className="text-white font-bold text-center" >{qrdata.name}</span>
                        <div className="flex items-center justify-center w-28 h-32 bg-white px-1 rounded">
                            <QRCodeSVG value={JSON.stringify(mydata)} className="w-full h-full m-auto" />
                        </div>
                    </div>
                    }
                {/* <Image src='/logo2.png' className=" absolute -left-10 -bottom-10 filter brightness-0 invert" alt="logo" height={150} width={150} /> */}
            </div>
        </div>
    </div>
  )
}

export default BadgePreview
