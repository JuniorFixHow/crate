import { RiQrScan2Line } from "react-icons/ri";
import { CiCirclePlus } from "react-icons/ci";
import CBar from "@/misc/CBar";
import CPie from "@/misc/CPie";
import { PiMoneyWavyBold, PiUsersThree } from "react-icons/pi";
import Tile from "@/features/Tile";
import { getFamilyAndGroupValue, getUniqueValues } from "@/functions/filter";
import { members } from "@/Dummy/Data";
import { LiaUserSolid } from "react-icons/lia";
import { TbBuildingChurch } from "react-icons/tb";
import RegistrationTable from "@/tables/RegistrationTable";


const page = () => {
  return (
    <div className='flex flex-col gap-4 p-4 w-full flex-wrap' >
      <div className="flex flex-wrap flex-row items-center justify-between">
        <span className="text-xl font-bold">Dashboard</span>
        <div className="flex flex-row items-center gap-4">

          <div className="flex bg-white dark:bg-transparent dark:border cursor-pointer text-[0.9rem] gap-2 p-1 rounded flex-row items-center">
            <RiQrScan2Line/>
            <span className='font-semibold' >Check-In</span>
          </div>

          <div className={`flex bg-[#3C60CA] dark:bg-transparent text-white dark:border cursor-pointer text-[0.9rem] gap-2 p-1 rounded flex-row items-center`}>
            <CiCirclePlus size={20} />
            <span className='font-semibold' >Add Member</span>
          </div>

        </div>
      </div>

      <div className='flex flow-row w-full items-start gap-4'>
        <CBar className="" />
        <div className="flex flex-row  gap-4 items-start">
          <CPie />

          <div className="hidden lg:flex flex-col gap-[1.2rem] dark:gap-[1.1rem]">
            <Tile 
              className="w-[12rem]"
              title="Revenue" 
              icon={<PiMoneyWavyBold size={24} color="#3C60CA" />}
              text="67293"
            />
            <Tile 
              className="w-[12rem]"
              title="Family/Group" 
              icon={<PiUsersThree size={24} color="#3C60CA" />}
              text={getFamilyAndGroupValue(members).toString()}
            />
            <Tile 
              className="w-[12rem]"
              title="Individuals" 
              icon={<LiaUserSolid size={24} color="#3C60CA" />}
              text={(members.length - getFamilyAndGroupValue(members)).toString()}
            />
            <Tile 
              className="w-[12rem]"
              title="Churches" 
              icon={<TbBuildingChurch size={24} color="#3C60CA" />}
              text={getUniqueValues('Church', members).length.toString()}
            />
          </div>
        </div>
      </div>

      <RegistrationTable />
    </div>
  )
}

export default page