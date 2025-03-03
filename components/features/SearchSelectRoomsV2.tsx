'use client'
import { useFetchRooms } from "@/hooks/fetch/useRoom";
import { IRoom } from "@/lib/database/models/room.model";
import { IVenue } from "@/lib/database/models/venue.model";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { Dispatch, Fragment, SetStateAction,  useState } from "react"
import { SearchRoomV2 } from "../pages/room/fxn";

type SearchSelectRoomsV2Props = {
    setSelect?:Dispatch<SetStateAction<string>>,
    require?:boolean;
    value?:string;
    eventId:string;
    width?:number
}

const SearchSelectRoomsV2 = ({setSelect, eventId, width, require, value}:SearchSelectRoomsV2Props) => {
    const {rooms, loading} = useFetchRooms();
    const [search, setSearch] = useState<string>('');
    
  return (
    <Autocomplete
      disablePortal
      options={SearchRoomV2(rooms, eventId) as IRoom[]}
      onChange={(_, v:IRoom|null)=>{
        setSelect!(v?._id as string); 
      }}
      inputValue={search}
      onInputChange={(_, v)=>{
        setSearch(v)
    }}
    loading={loading}
    isOptionEqualToValue={(option, value)=>option._id === value._id}
    getOptionLabel={(item)=>{
        const venue = item?.venueId as IVenue;
        return `${venue?.name} - ${item?.number}`
    }}
      sx={{ width: width ?? 250 }}
      renderInput={(params) => 
        <TextField
          {...params}
          required={require}
          size='small'
          label= {value??"Room"}
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

export default SearchSelectRoomsV2