'use client'
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { Dispatch, Fragment, SetStateAction,  useState } from "react"
import { useFetchCYPSet } from "@/hooks/fetch/useCYPSet";
import { ICYPSet } from "@/lib/database/models/cypset.model";

type SearchSelectCYPSetV2Props = {
    setSelect?:Dispatch<SetStateAction<string>>,
    require?:boolean;
    value?:string;
    width?:number
}

const SearchSelectCYPSetV2 = ({setSelect,  width, require, value}:SearchSelectCYPSetV2Props) => {
    const {cypsets, loading} = useFetchCYPSet();
    const [search, setSearch] = useState<string>('');
    
  return (
    <Autocomplete
      disablePortal
      options={cypsets}
      onChange={(_, v:ICYPSet|null)=>{
        setSelect!(v?._id as string); 
      }}
      inputValue={search}
      onInputChange={(_, v)=>{
        setSearch(v)
    }}
    loading={loading}
    isOptionEqualToValue={(option, value)=>option._id === value._id}
    getOptionLabel={(item)=>{
        return item?.title;
    }}
      sx={{ width: width ?? 250 }}
      renderInput={(params) => 
        <TextField
          {...params}
          required={require}
          size='small'
          label= {value??"Set"}
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

export default SearchSelectCYPSetV2