import Title from "@/components/features/Title"
import VenueTable from "./VenueTable"

const VenueMain = () => {
  return (
    <div className="page" >
        <div className="flex flex-row gap-2 items-baseline">
            <Title  text="Venues" />
        </div>
        <VenueTable/>
    </div>
  )
}

export default VenueMain