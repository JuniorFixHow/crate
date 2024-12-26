import { IContract } from "@/lib/database/models/contract.model"
import ContractDetails from "../new/ContractDetails"
import Title from "@/components/features/Title"
import { IoIosArrowForward } from "react-icons/io"

type SingleContractMainProps = {
    currentContract:IContract
}

const SingleContractMain = ({currentContract}:SingleContractMainProps) => {
  return (
    <div className='page' >
        <div className="flex flex-row gap-2 items-baseline">
            <Title clickable link="/dashboard/churches" text="Churches" />
            <IoIosArrowForward/>
            <Title text="Contracts" clickable link="/dashboard/churches/contracts" />
            <IoIosArrowForward/>
            <Title text="Details" />
        </div>
        <ContractDetails currentContract={currentContract} />
    </div>
  )
}

export default SingleContractMain