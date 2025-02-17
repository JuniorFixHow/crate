import { IChurch } from "@/lib/database/models/church.model"
import { IMember } from "@/lib/database/models/member.model"
import { QRCodeSVG } from "qrcode.react"
import { ComponentProps } from "react"

type NagacuProps = {
    member:IMember,
    eventId:string
} & ComponentProps<'div'>
const Nagacu = ({member, eventId, className, ...props}:NagacuProps) => {
    const church = member?.church as IChurch;
    const code  = `${member?._id},${eventId}`
  return (
    <div {...props} className={`w-[22rem] h-[34rem] rounded-md justify-between flex flex-col ${className}`} style={{
        backgroundImage:'url(/nagacu.jpg)',
        backgroundRepeat:'no-repeat',
        backgroundSize:'100%'
    }} >
        <div className="flex flex-1"/>
        <div className="flex flex-col w-fit gap-3 px-4 py-2 items-center flex-1">
            <div className="flex flex-col items-center">
                <span className="text-[1.3rem] font-bold text-[#B79430]" >{member?.name}</span>
                <span className="text-[1rem] text-[#B79430] font-semibold" >{church?.name}</span>
                {
                    member?.voice !== 'None' &&
                    <span className="text-[1rem] text-[#3B5684]" >{member?.voice?.toUpperCase()}</span>
                }
            </div>
            <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-24 bg-white px-1 rounded dark:border">
                    <QRCodeSVG value={code} className="w-full h-full" />
                </div>
                <span className="text-[1.2rem] text-[#B79430]" >{member?.role?.toUpperCase()}</span>
            </div>
        </div>
    </div>
  )
}

export default Nagacu