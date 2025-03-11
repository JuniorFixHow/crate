import { searchCampusV2 } from "@/functions/search";
import { useFetchCampuses } from "@/hooks/fetch/useCampus";
import { ICampuse } from "@/lib/database/models/campuse.model";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { Dispatch, Fragment, SetStateAction, useState } from "react"

type SearchSelectCampusesV2Props = {
    setSelect?:Dispatch<SetStateAction<string>>,
    require?:boolean;
    value?:string;
    churchId:string;
    width?:number
}

const SearchSelectCampusesV2 = ({setSelect, width, churchId, require, value}:SearchSelectCampusesV2Props) => {
    const {campuses, loading} = useFetchCampuses();
    const [search, setSearch] = useState<string>('')
    const searched = searchCampusV2(churchId, campuses);
  return (
    <Autocomplete
      disablePortal
      options={searched}
      onChange={(_, v:ICampuse|null)=>{
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
          label={value ?? "Campus"}
          color='primary'
          defaultValue={value}
          className="dark:bg-slate-400 rounded"
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {(!!churchId && loading) ? <CircularProgress color="inherit" size={20} /> : null}
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

export default SearchSelectCampusesV2