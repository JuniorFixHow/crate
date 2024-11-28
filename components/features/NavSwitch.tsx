import { BooleanStateProp } from "@/types/Types";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";


const NavSwitch = ({value, setValue}:BooleanStateProp) => {
  return (
    <div className="flex xl:hidden items-center">
        {
            value ?
            <IoIosArrowForward className="cursor-pointer" size={15} onClick={()=>setValue(e=>!e)} />
            :
            <IoIosArrowBack className="cursor-pointer" size={24} onClick={()=>setValue(e=>!e)} />
        }
    </div>

  )
}

export default NavSwitch