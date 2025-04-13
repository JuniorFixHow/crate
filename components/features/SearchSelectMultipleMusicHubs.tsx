import { Autocomplete, Checkbox, Chip, CircularProgress, TextField } from "@mui/material";
import { Dispatch, Fragment, SetStateAction, useState } from "react"
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useFetchMusichub } from "@/hooks/fetch/useMusichub";
import { IMusichub } from "@/lib/database/models/musichub.model";

type SearchSelectMultipleMusicHubsProps = {
    setSelection:Dispatch<SetStateAction<string[]>>,
    require?:boolean;
    defaultValue?:string;
    width?:number
}

const SearchSelectMultipleMusicHubs = ({setSelection, width,  defaultValue, require}:SearchSelectMultipleMusicHubsProps) => {
    const {musics, isPending} = useFetchMusichub();
    const [search, setSearch] = useState<string>('');
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    // const handleChange = (option:IMember)=>{
    //   setSelection((pre)=>{
    //     const selected = pre.find((item)=>item._id === option._id);
    //     return selected ?
    //     pre.filter((item)=> item._id !==option._id)
    //     :
    //     [...pre, option]
    //   })
    // }

  return (
    <Autocomplete
      disableCloseOnSelect
      multiple
      filterSelectedOptions
      options={musics as IMusichub[]}
      onChange={(_, value: IMusichub[]) => {
        const musicIds = value.map((item)=>item._id);
      
        setSelection(musicIds);
      }}
      inputValue={search}
      onInputChange={(_, v) => setSearch(v)}
      loading={isPending}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      getOptionLabel={(item) => item?.title}
  
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });

          return (
            <Chip
              key={key}
              label={option?.title}
              {...tagProps}
              
            />
          );
        })
      }

      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props;

        return (
          <li key={key} {...optionProps}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option?.title}
          </li>
        );
      }}

      sx={{ width: width ?? 500 }}
      renderInput={(params) => (
        <TextField
          {...params}
          required={require}
          size="medium"
          label="Muscians"
          color="primary"
          defaultValue={defaultValue}
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
      )}
/>

  )
}

export default SearchSelectMultipleMusicHubs