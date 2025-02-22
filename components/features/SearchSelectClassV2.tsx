import { useFetchMinistriesV2 } from "@/hooks/fetch/useMinistry";
import { IMinistry } from "@/lib/database/models/ministry.model";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { Dispatch, Fragment, SetStateAction, useState } from "react"

type SearchSelectClassV2Props = {
    setSelect?:Dispatch<SetStateAction<string>>,
    require?:boolean;
    value?:string;
    activityId:string;
    width?:number
}


const SearchSelectClassV2 = ({setSelect, width, activityId, require, value}:SearchSelectClassV2Props) => {
    const {ministries, isPending} = useFetchMinistriesV2(activityId);
    const [search, setSearch] = useState<string>('');
  return (
    <Autocomplete
      disablePortal
      options={ministries as IMinistry[]}
      onChange={(_, v:IMinistry|null)=>{
        setSelect!(v?._id as string); 
      }}
      inputValue={search}
      onInputChange={(_, v)=>{
        // console.log(e.target);
        setSearch(v)
    }}
    loading={isPending}
    isOptionEqualToValue={(option, value)=>option?._id === value?._id}
    getOptionLabel={(item)=>item?.name}
      sx={{ width }}
      renderInput={(params) => 
        <TextField
          {...params}
          required={require}
          size='small'
          label="Classes"
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

export default SearchSelectClassV2