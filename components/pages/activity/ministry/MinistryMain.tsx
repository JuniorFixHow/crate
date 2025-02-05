import Title from "@/components/features/Title"
import ClassMinistryTable from "./ClassMinistryTable"

const MinistryMain = () => {
  return (
    <div className="page" >
        <div className="flex flex-row gap-2 items-baseline">
            <Title text="Ministries" />
        </div>
        <ClassMinistryTable/>
    </div>
  )
}

export default MinistryMain