import SingleContractMain from "@/components/pages/churches/contract/single/SingleContractMain";
import { getContract } from "@/lib/actions/contract.action"

const page = async({params}:{params:Promise<{id:string}>}) => {
    const {id} = await params;
    const contract = await getContract(id);
  return (
    <div className="main-c" >
      <SingleContractMain currentContract={contract} />
    </div>
  )
}

export default page