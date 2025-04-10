'use client'
import { useFetchEventsV2 } from "@/hooks/fetch/useEvent";
import { IEvent } from "@/lib/database/models/event.model";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react"

type SearchSelectEventsV4Props = {
    setSelect?:Dispatch<SetStateAction<string>>,
    require?:boolean;
    value?:string;
    width?:number
}

const SearchSelectEventsV4 = ({setSelect, width, require, value}:SearchSelectEventsV4Props) => {
    const {events, loading} = useFetchEventsV2();
    const [search, setSearch] = useState<string>('');
    useEffect(()=>{
      if(events.length){
        setSelect!(events[0]?._id);
      }
    },[events, setSelect])
  return (
    <Autocomplete
      disablePortal
      options={events as IEvent[]}
      onChange={(_, v:IEvent|null)=>{
        setSelect!(v?._id as string); 
      }}
      inputValue={search}
      onInputChange={(_, v)=>{
        setSearch(v)
    }}
    loading={loading}
    isOptionEqualToValue={(option, value)=>option._id === value._id}
    getOptionLabel={(item)=>item?.name}
      sx={{ width: width ?? 250 }}
      renderInput={(params) => 
        <TextField
          {...params}
          required={require}
          size='small'
          label= {value??"Event"}
          color='primary'
          defaultValue={value}
          className="dark:bg-slate-400 rounded"
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
            },
          }}
        />
      }
    />
  )
}

export default SearchSelectEventsV4