import Title from "@/components/features/Title"
import { ICYPSet } from "@/lib/database/models/cypset.model"
import { IoIosArrowForward } from "react-icons/io"
import SinglePublicTable from "./SinglePublicTable"
import PublicTitleChanger from "./PublicTitleChanger"

type SinglePublicProps = {
    cypset:ICYPSet
}

const SinglePublic = ({cypset}:SinglePublicProps) => {
  return (
    <div className='page' >
        <div className="flex justify-between items-center">
            <div className="flex flex-row gap-2 items-baseline">
                <Title clickable link={`/dashboard/events/public`} text={`Public`} />
                <IoIosArrowForward/>
                <Title text={`${cypset?.title}`} />
            </div>

            <PublicTitleChanger cyp={cypset} />
        </div>
      <SinglePublicTable cypset={cypset} />
    </div>
  )
}

export default SinglePublic