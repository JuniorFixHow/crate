import { useFetchRegistrationsAllGroups } from "@/hooks/fetch/useRegistration";
import { IChurch } from "@/lib/database/models/church.model";
import { IMember } from "@/lib/database/models/member.model";
import { IRegistration } from "@/lib/database/models/registration.model";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { Dispatch, Fragment, SetStateAction, useState } from "react"

type SearchSelectRegistrationByEventV2Props = {
    setSelect?:Dispatch<SetStateAction<string>>,
    setSelectChurchId?:Dispatch<SetStateAction<string>>,
    require?:boolean;
    value?:string;
    width?:number,
    eventId:string;
}

const SearchSelectRegistrationByEventV2 = ({setSelect, setSelectChurchId, eventId, width, require, value}:SearchSelectRegistrationByEventV2Props) => {
    const {eventRegistrations, loading} = useFetchRegistrationsAllGroups(eventId);
    const [search, setSearch] = useState<string>('')
  return (
    <Autocomplete
      disablePortal
      options={eventRegistrations as IRegistration[]}
      onChange={(_, v:IRegistration|null)=>{
        setSelect!(v?._id as string);
        const member = v?.memberId as IMember; 
        const church = member?.church as IChurch;
        setSelectChurchId!(church?._id);
      }}
      inputValue={search}
      onInputChange={(_, v)=>{
        setSearch(v)
    }}
    loading={loading && !!eventId}
    isOptionEqualToValue={(option, value)=>option._id === value._id}
    getOptionLabel={(item)=>{
        const member = item?.memberId as IMember;
        return member?.name
    }}
      sx={{ width: width ?? 250 }}
      renderInput={(params) => 
        <TextField
          {...params}
          required={require}
          size='small'
          label= {value??"Member"}
          color='primary'
          defaultValue={value}
          className="dark:bg-slate-400 rounded"
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {(!!eventId && loading) ? <CircularProgress color="inherit" size={20} /> : null}
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

export default SearchSelectRegistrationByEventV2