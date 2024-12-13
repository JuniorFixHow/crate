import Title from "@/components/features/Title"
import { ICYPSet } from "@/lib/database/models/cypset.model"
import { ISection } from "@/lib/database/models/section.model"
import { IoIosArrowForward } from "react-icons/io"
import SingleSectionEditor from "./SingleSectionEditor"
import SectionTitleChanger from "./SectionTitleChanger"

type SingleSectionMainProps = {
    section:ISection
}
const SingleSectionMain = ({section}:SingleSectionMainProps) => {
    const cypset = section.cypsetId as unknown as ICYPSet
  return (
    <div className="page" >
        <div className="flex justify-between items-center">
            <div className="flex flex-row gap-2 items-baseline">
                <Title clickable link={`/dashboard/events/public/${cypset?._id}`} text={`${cypset?.title}`} />
                <IoIosArrowForward/>
                <Title  text={section?.title} />
            </div>
            <SectionTitleChanger section={section} />
        </div>

        <SingleSectionEditor currentSection={section} />
    </div>
  )
}

export default SingleSectionMain