'use client'
// import { useFetchVendors } from "@/hooks/fetch/useVendor";
// import { IVendor } from "@/lib/database/models/vendor.model";
import { useFetchVenues } from "@/hooks/fetch/useVenue";
import { IVenue } from "@/lib/database/models/venue.model";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { Dispatch, Fragment, SetStateAction,  useState } from "react"

type SearchSelectVenuesV2Props = {
    setSelect?:Dispatch<SetStateAction<string>>,
    require?:boolean;
    value?:string;
    width?:number
}

const SearchSelectVenuesV2 = ({setSelect, width, require, value}:SearchSelectVenuesV2Props) => {
    const {venues, loading} = useFetchVenues();
    const [search, setSearch] = useState<string>('');
    
    
  return (
    <Autocomplete
      disablePortal
      options={venues as IVenue[]}
      onChange={(_, v:IVenue|null)=>{
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
          label= {value??"Venue"}
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

export default SearchSelectVenuesV2