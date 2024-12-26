import Title from "@/components/features/Title"
import { IoIosArrowForward } from "react-icons/io"
import ContractDetails from "./ContractDetails"

const NewContractMain = () => {
  return (
    <div className='page' >
        <div className="flex flex-row gap-2 items-baseline">
            <Title clickable link="/dashboard/churches" text="Churches" />
            <IoIosArrowForward/>
            <Title text="Contracts" clickable link="/dashboard/churches/contracts" />
            <IoIosArrowForward/>
            <Title text="New" />
        </div>
        <ContractDetails/>
    </div>
  )
}

export default NewContractMain