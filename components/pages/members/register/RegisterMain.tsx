import NewBadgeSearch from "@/components/features/badges/NewBadgeSearch"
import Title from "@/components/features/Title"

const RegisterMain = () => {
  return (
    <div className="page" >
        <div className="flex flex-row gap-2 items-baseline">
            <Title  text="Register Event" />
        </div>
        <NewBadgeSearch isRegisterItem />
    </div>
  )
}

export default RegisterMain