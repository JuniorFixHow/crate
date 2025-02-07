import SingleMemberMain from "@/components/pages/members/SingleMemberMain";
import { getMember } from "@/lib/actions/member.action";

const SingleMember = async({params}:{params:Promise<{id:string}>}) => {
  const {id} = await params;
  const member = await getMember(id);
  // console.log(params.id)
  return (
    <div className="p-4 pl-8 xl:pl-4 flex flex-col gap-4" >
      <SingleMemberMain member={member} />
    </div>
  )
}

export default SingleMember