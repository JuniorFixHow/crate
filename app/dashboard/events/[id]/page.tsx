import EventMain from '@/components/pages/event/EventMain'

const Page = async({params}:{params:Promise<{id:string}>}) => {
    const {id} = await params;
    
    // const [openDialog, setOpenDialog] = useState<boolean>(false)
  return (
    <div className='main-c' >
      
    <EventMain eventId={id} />
      
  </div>
  )
}

export default Page