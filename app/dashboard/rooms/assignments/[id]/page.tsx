import SingleAssignment from "@/pages/room/assignments/single/SingleAssignment"

const page = async({params}:{params:Promise<{id:string}>}) => {
    const {id} = await params;
    if(!id) return null
  return (
    <div className="main-c" >
        <SingleAssignment id={id}/>
    </div>
  )
}

export default page