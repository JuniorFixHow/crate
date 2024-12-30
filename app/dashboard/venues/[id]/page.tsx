import SingleVenueMain from "@/components/pages/venue/single/SingleVenueMain";
import { getVenue } from "@/lib/actions/venue.action";

const page = async({params}:{params:Promise<{id:string}>}) => {
    const {id} = await params;
    const venue = await getVenue(id);
  return (
    <div className="main-c" >
        <SingleVenueMain currentVenue={venue} />
    </div>
  )
}

export default page