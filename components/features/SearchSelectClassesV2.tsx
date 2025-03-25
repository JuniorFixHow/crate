import { useFetchMinistriesV2 } from "@/hooks/fetch/useMinistry";
import { IMinistry } from "@/lib/database/models/ministry.model";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react"

type SearchSelectClassesV2Props = {
    setSelect?:Dispatch<SetStateAction<string>>,
    require?:boolean;
    value?:string;
    width?:number,
    activityId:string
}

const SearchSelectClassesV2 = ({setSelect, activityId, width, require, value}:SearchSelectClassesV2Props) => {
    const [search, setSearch] = useState<string>('')
    const {ministries, isPending} = useFetchMinistriesV2(activityId);
    useEffect(()=>{
      if(ministries?.length){
        setSelect!(ministries[0]?._id);
      }
    },[ministries, setSelect])
  return (
    <Autocomplete
      disablePortal
      options={ministries as IMinistry[]}
      onChange={(_, v:IMinistry|null)=>{
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
          label={value ?? "Class"}
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

export default SearchSelectClassesV2