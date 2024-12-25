import SingleChurch from "@/components/pages/churches/single/SingleChurch"
import { getChurch } from "@/lib/actions/church.action";

const page = async({params}:{params:Promise<{id:string}>}) => {
    const {id} = await params;
    const currentChurch = await getChurch(id);
  return (
    <div className="main-c" >
        <SingleChurch currentChurch={currentChurch} />
    </div>
  )
}

export default page