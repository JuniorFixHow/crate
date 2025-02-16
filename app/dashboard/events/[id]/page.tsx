import EventMain from '@/components/pages/event/EventMain'
import { getEvent } from '@/lib/actions/event.action';
import { IEvent } from '@/lib/database/models/event.model';

const Page = async({params}:{params:Promise<{id:string}>}) => {
    const {id} = await params;
    const event:IEvent = await getEvent(id);
    
    // const [openDialog, setOpenDialog] = useState<boolean>(false)
  return (
    <div className='main-c' >
      
    <EventMain event={event} />
      
  </div>
  )
}

export default Page