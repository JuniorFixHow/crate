import { ViewProps } from "./fxn"

const NoResponse = ({view}:{view:ViewProps}) => {
  return (
    <div className="flex-center p-4 min-[50vh] bg-white border shadow dark:bg-transparent" >
      <span className="font-semibold text-[1rem] lg:text-[1.3rem]" >{view === 'By Question' ? 'No Responses':'No Respondents' }</span>
    </div>
  )
}

export default NoResponse