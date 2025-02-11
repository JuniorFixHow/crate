import { useFetchMembersInAChurchV2 } from "@/hooks/fetch/useMember";
import { IMember } from "@/lib/database/models/member.model";
import { Autocomplete, Checkbox, Chip, CircularProgress, TextField } from "@mui/material";
import { Dispatch, Fragment, SetStateAction, useState } from "react"
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

type SearchSelectMultipleMembersProps = {
    setSelection:Dispatch<SetStateAction<IMember[]>>,
    selection?:IMember[],
    fixedSelection?:IMember[],
    require?:boolean;
    defaultValue?:string;
}

const SearchSelectMultipleMembers = ({setSelection, selection, fixedSelection,  defaultValue, require}:SearchSelectMultipleMembersProps) => {
    const {members, isPending} = useFetchMembersInAChurchV2();
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
  options={members as IMember[]}
  onChange={(_, value: IMember[]) => {
    // Ensure selected values are unique while keeping fixedSelection intact
    const uniqueSelection = value.filter(
      (option) => !fixedSelection?.some((item) => item._id === option._id)
    );
    console.log(fixedSelection, uniqueSelection)

    setSelection([...fixedSelection!, ...uniqueSelection]);
  }}
  inputValue={search}
  onInputChange={(_, v) => setSearch(v)}
  defaultValue={selection}
  loading={isPending}
  isOptionEqualToValue={(option, value) => option._id === value._id}
  getOptionLabel={(item) => item?.name}
  
  renderTags={(tagValue, getTagProps) =>
    tagValue.map((option, index) => {
      const { key, ...tagProps } = getTagProps({ index });

      return (
        <Chip
          key={key}
          label={option?.name}
          {...tagProps}
          disabled={!!fixedSelection?.find((item) => item._id === option._id)}
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
        {option?.name}
      </li>
    );
  }}

  sx={{ width: 500 }}
  renderInput={(params) => (
    <TextField
      {...params}
      required={require}
      size="medium"
      label="Members"
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

export default SearchSelectMultipleMembers