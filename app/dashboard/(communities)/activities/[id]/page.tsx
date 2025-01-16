import SingleActivityMain from "@/components/pages/activity/single/SingleActivityMain";
import { getActivity } from "@/lib/actions/activity.action";

const page = async({params}:{params:Promise<{id:string}>}) => {
    const {id} = await params;
    const activity = await getActivity(id);
  return (
    <div className='main-c' >
        <SingleActivityMain currentActivity={activity} />
    </div>
  )
}

export default page