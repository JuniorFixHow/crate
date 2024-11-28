import { VendorsData } from "../vendor/VendorData"
import Account from "./Account"
import Security from "./Security"
import SoundSettings from "./SoundSettings"

const ProfileContent = ({currentTitle}:{currentTitle:string}) => {
    const user = VendorsData[2]

  return (
    <div className="p-4 flex justify-center md:p-10 w-full md:grow rounded bg-white shadow dark:bg-black dark:border">
        <Account user={user}  className={`${currentTitle === 'Account'?'flex':'hidden'}`} />
        <Security   className={`${currentTitle === 'Security'?'flex':'hidden'}`} />
        <SoundSettings className={`${currentTitle === 'Sounds'?'flex':'hidden'}`} />
    </div>
  )
}

export default ProfileContent