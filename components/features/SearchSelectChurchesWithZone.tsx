import {  useFetchChurchesV4 } from "@/hooks/fetch/useChurch";
import { IChurch } from "@/lib/database/models/church.model";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { Dispatch, Fragment, SetStateAction, useState } from "react"
import { SearchChurchWithZoneV2 } from "../pages/vendor/fxn";

type SearchSelectChurchesWithZoneProps = {
    setSelect?:Dispatch<SetStateAction<string>>,
    require?:boolean;
    value?:string;
    width?:number
    zoneId:string;
}

const SearchSelectChurchesWithZone = ({setSelect, zoneId, width, require, value}:SearchSelectChurchesWithZoneProps) => {
    const {churches, isPending} = useFetchChurchesV4();
    const [search, setSearch] = useState<string>('')
  return (
    <Autocomplete
      disablePortal
      options={SearchChurchWithZoneV2(churches, zoneId)}
      onChange={(_, v:IChurch|null)=>{
        setSelect!(v?._id as string); 
      }}
      inputValue={search}
      onInputChange={(_, v)=>{
        setSearch(v)
    }}
    loading={isPending}
    isOptionEqualToValue={(option, value)=>option._id === value._id}
    getOptionLabel={(item)=>item?.name}
      sx={{ width: width ?? 250 }}
      renderInput={(params) => 
        <TextField
          {...params}
          required={require}
          size='small'
          label={value ?? "Church"}
          color='primary'
          defaultValue={value}
          className="dark:bg-slate-400 rounded"
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {isPending ? <CircularProgress color="inherit" size={20} /> : null}
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

export default SearchSelectChurchesWithZone