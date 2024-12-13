'use client'
import AddButton from '@/components/features/AddButton'
import { useFetchSectionsWithQuestions } from '@/hooks/fetch/useSection'
import { ICYPSet } from '@/lib/database/models/cypset.model'
import { CircularProgress, Modal } from '@mui/material'
import Link from 'next/link'
import React, { Dispatch, SetStateAction, useState } from 'react'

type SectionSelectCenter = {
  openSelect:boolean,
  setOpenSelect:Dispatch<SetStateAction<boolean>>,
  sectionId:string
}

const SectionSelectCenter = ({openSelect, setOpenSelect, sectionId}:SectionSelectCenter) => {
  
  const {loading, sections} = useFetchSectionsWithQuestions();
  const [selectId, setSelectId] = useState<string>('');

  const handleClose = ()=>{
    setOpenSelect(false);
  }

  const handleSelect = (id:string)=>{
    if(selectId === id){
      setSelectId('');
    }else{
      setSelectId(id);
    }
  }

  // console.log('SELECTED: ',selectId)

  return (
    <Modal
        open={openSelect}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="flex-center"
        >
        <div className='flex overflow-y-scroll scrollbar-custom flex-col gap-8 bg-white h-[70vh]  dark:bg-black dark:border w-[90%] md:w-[60%] rounded p-6'>
            <div className="flex flex-col gap-2 items-center">
              <span className="font-semibold dark:text-white" >Choose a section to start with</span>
            </div>

            <div className="flex grow flex-col justify-between">
              {
                loading ? 
                <CircularProgress/>
                :
                <div className="flex flex-col gap-5">
                  {
                    sections.map((section)=>{
                      const set = section.cypsetId as unknown as ICYPSet
                      return(
                        <div key={section._id}  className={`flex flex-col gap-1 p-3 rounded shadow-md dark:bg-black ${(selectId === section._id) ? 'border border-blue-700':'border'}`}>
                          <Link className='table-link w-fit' href={`/dashboard/events/public/sections/${section?._id}`} >{section?.title}</Link>
                          <Link className='table-link text-[0.7rem] w-fit' href={`/dashboard/events/public/${set?._id}`} >{set?.title}</Link>
                          <div className="flex justify-end gap-10 items-center">
                            <small className='text-[0.7rem] dark:text-white' >{new Date(section.createdAt!).toLocaleDateString()}</small>
                            <AddButton onClick={()=>handleSelect(section?._id)} smallText noIcon className='rounded' text={(selectId === section._id) ? 'Deselect' : 'Select'} />
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              }

                <div className="flex justify-end gap-4 py-8">
                  {
                    selectId &&
                    <Link href={{pathname:`/dashboard/events/public/sections/new/${sectionId}`, query:{copy:selectId}}} >
                      <AddButton type="button"  className='rounded' text='Proceed' onClick={handleClose} smallText noIcon />
                    </Link>
                  }
                    <AddButton type="button"  className='rounded' text='Cancel' isCancel onClick={handleClose} smallText noIcon />
                </div>
              </div>
        </div>
    </Modal>
  )
}

export default SectionSelectCenter
