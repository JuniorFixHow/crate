
import { SessionsData } from '@/Dummy/Data'
import AddButton from '@/features/AddButton'
import SearchSelectEvents from '@/features/SearchSelectEvents'
import { today } from '@/functions/dates'
import Link from 'next/link'

const EditSession = ({id}:{id:string}) => {
  const currentSession = SessionsData.filter((item)=>item.id === id)[0];
  return (
    <form   className='px-8 py-4 flex-col dark:bg-black dark:border flex gap-8 bg-white' >
        <span className='font-bold text-xl' >Add Session</span>
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-stretch">
          <div className="flex flex-1 flex-col gap-5">
              <div className="flex flex-col gap-1">
                  <span className='text-slate-400 font-semibold text-[0.8rem]' >Session Name</span>
                  <input defaultValue={currentSession?.name} placeholder='eg. morning prayers...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="name"  />
              </div>
              <div className="flex flex-col gap-1">
                  <span className='text-slate-400 font-semibold text-[0.8rem]' >Venue</span>
                  <input defaultValue={currentSession?.venue}  placeholder='type here...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="venue"  />
              </div>

              <div className="flex flex-row gap-12 items-center">
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Date (From)</span>
                    <input defaultValue={currentSession?.from} min={today()} placeholder='DD/MM/YYYY' className='border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='date' name="from"  />
                </div>
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Date (To)</span>
                    <input defaultValue={currentSession?.to} min={today()} placeholder='DD/MM/YYYY' className='border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='date' name="to"  />
                </div>
              </div>

              <div className="flex flex-row gap-12 items-center">
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Time (Start)</span>
                    <input defaultValue={currentSession?.startTime} min={today()} placeholder='00:00' className='border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='time' name="start"  />
                </div>
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Time (End)</span>
                    <input defaultValue={currentSession?.endTime} min={today()} placeholder='00:00' className='border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='time' name="end"  />
                </div>
              </div>

              
                {/* DONT FORGET TO HANDLE THE ONCHANGE EVENT OF THE DROPDOWN SELECT */}
              <div className="flex flex-col gap-1">
                  <span className='text-slate-400 font-semibold text-[0.8rem]' >Select Event</span>
                  <SearchSelectEvents className='w-fit' isGeneric />
              </div>

              <div className="flex gap-6 flex-row items-center">
                <AddButton text='Save Changes' noIcon smallText className='rounded px-4' />
                <Link href='/dashboard/events/sessions' >
                  <AddButton text='Cancel' isCancel noIcon smallText className='rounded px-4' />
                </Link>
              </div>
          </div>


      {/* RIGHT */}
          
        </div>

    </form>
  )
}

export default EditSession