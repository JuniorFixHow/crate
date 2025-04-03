'use client'
import { useFetchHubClasses } from "@/hooks/fetch/useHubclass";
import { IHubclass } from "@/lib/database/models/hubclass.model";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { Dispatch, Fragment, SetStateAction,  useEffect,  useState } from "react"

type SearchSelectHubClassesByEventProps = {
    setSelect?:Dispatch<SetStateAction<string>>,
    require?:boolean;
    eventId:string;
    value?:string;
    width?:number;
    setCurrentHubClass?:Dispatch<SetStateAction<IHubclass|null>>
}

const SearchSelectHubClassesByEvent = ({setSelect, eventId, width, setCurrentHubClass, require, value}:SearchSelectHubClassesByEventProps) => {
    const {hubs, loading} = useFetchHubClasses(eventId);
    const [search, setSearch] = useState<string>('');
    // const searched = SearchHubClass(hubs, eventId);
    useEffect(()=>{
      if(hubs.length){
        if(setSelect) setSelect!(hubs[0]?._id);
        if(setCurrentHubClass) setCurrentHubClass(hubs[0])
      }
    },[setCurrentHubClass, hubs, setSelect])
  return (
    <Autocomplete
      disablePortal
      options={hubs}
      onChange={(_, v:IHubclass|null)=>{
        if(setSelect) setSelect!(v?._id as string);
        if(setCurrentHubClass) setCurrentHubClass(v); 
      }}
      inputValue={search}
      onInputChange={(_, v)=>{
        setSearch(v)
    }}
    loading={loading && !!eventId}
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
                  {(loading && !!eventId) ? <CircularProgress color="inherit" size={20} /> : null}
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

export default SearchSelectHubClassesByEvent