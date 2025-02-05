import { useFetchClassministry } from "@/hooks/fetch/useClassministry";
import { IClassministry } from "@/lib/database/models/classministry.model";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { Dispatch, Fragment, SetStateAction, useState } from "react"

type SearchSelectClassministriesProps = {
    setSelect?:Dispatch<SetStateAction<string>>,
    require?:boolean;
    value?:boolean;
}

const SearchSelectClassministries = ({setSelect, require, value}:SearchSelectClassministriesProps) => {
    const {classMinistries, isPending} = useFetchClassministry();
    const [search, setSearch] = useState<string>('')
  return (
    <Autocomplete
      disablePortal
      options={classMinistries as IClassministry[]}
      onChange={(e, v:IClassministry|null)=>{
        console.log(e.target);
        setSelect!(v?._id as string); 
      }}
      inputValue={search}
      onInputChange={(e, v)=>{
        console.log(e.target);
        setSearch(v)
    }}
    loading={isPending}
    isOptionEqualToValue={(option, value)=>option.title === value.title}
    getOptionLabel={(item)=>item?.title}
      sx={{ width: 300 }}
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