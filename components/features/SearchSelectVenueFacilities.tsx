'use client'
import { useFetchVenueFacilities } from "@/hooks/fetch/useFacility";
import { IFacility } from "@/lib/database/models/facility.model";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { Dispatch, Fragment, SetStateAction,  useState } from "react"

type SearchSelectVenueFacilitiesProps = {
    setSelect?:Dispatch<SetStateAction<string>>,
    require?:boolean;
    value?:string;
    width?:number;
    venueId:string;
    setCurrentFacility?:Dispatch<SetStateAction<IFacility|null>>
}

const SearchSelectVenueFacilities = ({setSelect, setCurrentFacility, venueId, width, require, value}:SearchSelectVenueFacilitiesProps) => {
    const {facilities, loading} = useFetchVenueFacilities(venueId);
    const [search, setSearch] = useState<string>('');
    
  return (
    <Autocomplete
      disablePortal
      options={facilities}
      onChange={(_, v:IFacility|null)=>{
        setSelect!(v?._id as string); 
        setCurrentFacility!(v)
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
          label= {value??"Facility"}
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

export default SearchSelectVenueFacilities