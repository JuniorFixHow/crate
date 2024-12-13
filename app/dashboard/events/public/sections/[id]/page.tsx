import SingleSectionMain from "@/components/pages/public/section/single/SingleSectionMain"
import { getSection } from "@/lib/actions/section.action";
import { ISection } from "@/lib/database/models/section.model";

const page = async({params}:{params:Promise<{id:string}>}) => {
  const {id} = await params;
  const section:ISection = await getSection(id);
  return (
    <div className="main-c" >
      <SingleSectionMain section={section} />
    </div>
  )
}

export default page