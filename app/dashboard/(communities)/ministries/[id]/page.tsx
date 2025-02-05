import SingleMinistryMain from "@/components/pages/activity/ministry/single/SingleMinistryMain";
import { getClassministry } from "@/lib/actions/classministry.action";
import { IClassministry } from "@/lib/database/models/classministry.model";

const page = async({params}:{params:Promise<{id:string}>}) => {
    const {id} = await params;
    const res = await getClassministry(id);
    const ministry = res?.payload as IClassministry;
  return (
    <div className="main-c" >
        <SingleMinistryMain currentClassministry={ministry} />
    </div>
  )
}

export default page