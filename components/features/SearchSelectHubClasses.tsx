'use client'
import { useFetchHubClasses } from "@/hooks/fetch/useHubclass";
import { IHubclass } from "@/lib/database/models/hubclass.model";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react"

type SearchSelectHubClassesProps = {
    setSelect?:Dispatch<SetStateAction<string>>,
    require?:boolean;
    value?:string;
    eventId:string;
    width?:number;
    setCurrentHubClass?:Dispatch<SetStateAction<IHubclass|null>>
}

const SearchSelectHubClasses = ({setSelect, eventId, width, setCurrentHubClass, require, value}:SearchSelectHubClassesProps) => {
    const {hubs, loading} = useFetchHubClasses(eventId);
    const [search, setSearch] = useState<string>('');
    useEffect(()=>{
      if(hubs.length){
        if(setSelect) setSelect!(hubs[0]?._id);
        if(setCurrentHubClass) setCurrentHubClass(hubs[0])
      }
    },[hubs, setCurrentHubClass, setSelect])
  return (
    <Autocomplete
      disablePortal
      options={hubs as IHubclass[]}
      onChange={(_, v:IHubclass|null)=>{
        if(setSelect) setSelect!(v?._id as string);
        if(setCurrentHubClass) setCurrentHubClass(v); 
      }}
      inputValue={search}
      onInputChange={(_, v)=>{
        setSearch(v)
    }}
    loading={loading}
    isOptionEqualToValue={(option, value)=>option._id === value._id}
    getOptionLabel={(item)=>item?.title}
      sx={{ width: width ?? 250 }}
      renderInput={(params) => 
        <TextField
          {...params}
          required={require}
          size='small'
          label= {value??"Class"}
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

export default SearchSelectHubClasses