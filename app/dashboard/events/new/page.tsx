import AddButton from '@/features/AddButton'
import Title from '@/features/Title'
import React from 'react'
import {IoIosArrowForward} from 'react-icons/io'

const page = () => {
  return (
    <div className='flex flex-col gap-6 p-4 pl-8 xl:pl-4' >
      <div className="flex flex-row items-baseline gap-2">
        <Title clickable link='/dashboard/events' text='Events' />
        <IoIosArrowForward/>
        <Title text='New Event' />
      </div>
    
      <form   className='px-8 py-4 flex-col dark:bg-black dark:border flex gap-8 bg-white' >
        <span className='font-bold text-xl' >Add Event</span>
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-stretch">
          <div className="flex flex-1 flex-col gap-5">
              <div className="flex flex-col gap-1">
                  <span className='text-slate-400 font-semibold text-[0.8rem]' >Event Name</span>
                  <input  placeholder='type here...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="name"  />
              </div>
              <div className="flex flex-col gap-1">
                  <span className='text-slate-400 font-semibold text-[0.8rem]' >Location</span>
                  <input  placeholder='type here...' className='border-b p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type="text" name="location"  />
              </div>

              <div className="flex flex-row gap-12 items-center">
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Date (From)</span>
                    <input min={new Date().toDateString()} placeholder='DD/MM/YYYY' className='border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='date' name="from"  />
                </div>
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Date (To)</span>
                    <input placeholder='DD/MM/YYYY' className='border-b p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='date' name="to"  />
                </div>
              </div>

              <div className="flex flex-row gap-12">
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Children&apos;s price</span>
                    <input min={0} defaultValue={0} placeholder='$' className='border-b w-36 p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='number' name="childPrice"  />
                </div>
                <div className="flex flex-col gap-1">
                    <span className='text-slate-400 font-semibold text-[0.8rem]' >Adults&apos; price</span>
                    <input min={0} defaultValue={0} placeholder='$' className='border-b w-36 p-1 outline-none bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]' type='number' name="adultPrice"  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                  <span className='text-slate-400 font-semibold text-[0.8rem]' >Type</span>
                  <select defaultValue='Convension'  className='border text-slate-400 p-1 w-fit font-semibold text-[0.8rem] rounded bg-transparent outline-none'  >
                      <option className='dark:bg-black' value="Convension">Convension</option>
                      <option className='dark:bg-black' value="Camp Meeting">Camp Meeting</option>
                      <option className='dark:bg-black' value="CYP">CYP</option>
                  </select>
              </div>

          </div>


      {/* RIGHT */}
          <div className="flex flex-1 flex-col justify-between">
              <div className="flex flex-col gap-1">
                  <span className='text-slate-400 font-semibold text-[0.8rem]' >Description</span>
                  <textarea placeholder='say something about this event' className='border rounded p-1 outline-none w-80 bg-transparent placeholder:text-slate-400 placeholder:text-[0.8rem]'  name="note"  />
              </div>

            
              <div className="flex gap-6 flex-row items-center">
                <AddButton text='Create' noIcon smallText className='rounded px-4' />
                <AddButton text='Cancel' isCancel noIcon smallText className='rounded px-4' />
              </div>
          </div>
        </div>

    </form>
  </div>
  )
}

export default page