// 'use client'
// import AddButton from '@/components/features/AddButton'
import Title from '@/components/features/Title'
// import FilterBar from '@/components/FilterBar'
import MembersTable from '@/components/tables/MembersTable'
// import { useFetchChurches } from '@/hooks/fetch/useChurch'
// import { Alert } from '@mui/material'
// import { useRouter } from 'next/navigation'
// import React, { useState } from 'react'

const MembersMain = () => {
    // const {churches} = useFetchChurches();
    // const [noChurch, setNoChurch] = useState<boolean>(false);
    // const [date, setDate] = useState<string>('');
    // const [status, setStatus] = useState<string>('');
    // const [age, setAge] = useState<string>('');
    // const [gender, setGender] = useState<string>('');
    // const [search, setSearch] = useState<string>('');
    // const router = useRouter();
    // const handleOpenNew = ()=>{
    //     if(churches.length <= 0){
    //      setNoChurch(true);
    //     }else{
    //      router.push('/dashboard/members/new')
    //     }
    //  }

    //  const reset = ()=>{
    //     setSearch('');
    //     setAge('');
    //     setGender('');
    //     setDate('');
    //     setStatus('');
    //  }

  return (
    <div className='page' >
        <Title text='Member Registration' />
      <div className="flex flex-row items-center justify-between">
        {/* <FilterBar 
            setAge={setAge}
            setGender={setGender}
            setDate={setDate}
            setStatus={setStatus}
            reset={reset}
        /> */}
        {/* <AddButton onClick={handleOpenNew}  text='Add Member' className="w-fit rounded"  /> */}
      </div>

      {/* {
        noChurch &&
        <Alert onClose={()=>setNoChurch(false)} severity='error' >No zones available. Create a zone to add a new church</Alert>
      } */}

      <MembersTable
        // age={age} status={status} gender={gender} date={date}
        // search={search}
        // setSearch={setSearch}
      />
    </div>
  )
}

export default MembersMain