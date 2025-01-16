import Title from "@/components/features/Title"
import ActivityTable from "./ActivityTable"

const ActivityMain = () => {
  return (
    <div className="page" >
        <Title text="Activities" />
        <ActivityTable/>
    </div>
  )
}

export default ActivityMain