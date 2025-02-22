import { useFetchActivitiesForMinistry } from "@/hooks/fetch/useActivity";
import { IActivity } from "@/lib/database/models/activity.model";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { Dispatch, Fragment, SetStateAction, useState } from "react"

type SearchSelectActivityProps = {
    setSelect?:Dispatch<SetStateAction<string>>,
    minId:string;
    require?:boolean;
    value?:string;
    width?:number
}

const SearchSelectActivity = ({setSelect, require, width, minId, value}:SearchSelectActivityProps) => {
    const {activities, isPending} = useFetchActivitiesForMinistry(minId);
    const [search, setSearch] = useState<string>('')
    // console.log(`Fetched: ${isFetched}  Success: ${isSuccess}`)
    // if(!isSuccess) return null;
    
  return (
    <Autocomplete
      disablePortal
      options={activities as IActivity[]}
      onChange={(e, v:IActivity|null)=>{
        console.log(e.target);
        setSelect!(v?._id as string); 
      }}
      inputValue={search}
      onInputChange={(e, v)=>{
        console.log(e.target);
        setSearch(v)
    }}
    loading={isPending}
    isOptionEqualToValue={(option, value)=>option._id === value._id}
    getOptionLabel={(item)=>item?.name}
      sx={{ width }}
      renderInput={(params) => 
        <TextField
          {...params}
          required={require}
          size='small'
          label="Activity"
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

export default SearchSelectActivity