import { useFetchClassministry } from "@/hooks/fetch/useClassministry";
// import { IClassministry } from "@/lib/database/models/classministry.model";
import { IClassMinistryExtended } from "@/types/Types";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import {  Dispatch, Fragment, SetStateAction, useState } from "react"

type SearchSelectClassministriesProps = {
    setSelect?:Dispatch<SetStateAction<string>>,
    require?:boolean;
    value?:string;
    width?:number
} 

const SearchSelectClassministries = ({setSelect, require, width, value,}:SearchSelectClassministriesProps) => {
    const {classMinistries, isPending} = useFetchClassministry();
    const [search, setSearch] = useState<string>('')
  return (
    <Autocomplete
      // className="w-20"
      disablePortal
      options={classMinistries as IClassMinistryExtended[]}
      onChange={(_, v:IClassMinistryExtended|null)=>{
        setSelect!(v?._id as string); 
      }}
      inputValue={search}
      onInputChange={(_, v)=>{
        setSearch(v)
    }}
    loading={isPending}
    isOptionEqualToValue={(option, value)=>option?._id === value?._id}
    getOptionLabel={(item)=>item?.title}
      sx={{ width }}
      renderInput={(params) => 
        <TextField
          {...params}
          required={require}
          size='small'
          label="Ministry"
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

export default SearchSelectClassministries