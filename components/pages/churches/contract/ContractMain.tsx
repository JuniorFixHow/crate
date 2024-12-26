import Title from "@/components/features/Title"
import { IoIosArrowForward } from "react-icons/io"
import ContractTable from "./ContractTable"

const ContractMain = () => {
  return (
    <div className="page" >
        <div className="flex flex-row gap-2 items-baseline">
            <Title clickable link="/dashboard/churches" text="Churches" />
            <IoIosArrowForward/>
            <Title text="Contracts" />
        </div>
      <ContractTable/>
    </div>
  )
}

export default ContractMain