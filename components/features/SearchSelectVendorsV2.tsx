'use client'
import { useFetchVendors } from "@/hooks/fetch/useVendor";
import { IVendor } from "@/lib/database/models/vendor.model";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { Dispatch, Fragment, SetStateAction,  useState } from "react"

type SearchSelectVendorsV2Props = {
    setSelect?:Dispatch<SetStateAction<string>>,
    require?:boolean;
    value?:string;
    width?:number
}

const SearchSelectVendorsV2 = ({setSelect, width, require, value}:SearchSelectVendorsV2Props) => {
    const {vendors, loading} = useFetchVendors();
    const [search, setSearch] = useState<string>('');
    
    
  return (
    <Autocomplete
      disablePortal
      options={vendors as IVendor[]}
      onChange={(_, v:IVendor|null)=>{
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
          label= {value??"User"}
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

export default SearchSelectVendorsV2