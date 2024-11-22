import BadgeTop from '@/features/badges/BadgeTop'
import Title from '@/features/Title'
import BadgesTable from '@/tables/BadgesTable'

const page = () => {
  return (
    <div className='main-c relative' >
      <Title text='Badges' />
      <BadgeTop  />
      <BadgesTable/>
    </div>
  )
}

export default page