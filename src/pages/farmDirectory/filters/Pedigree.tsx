import * as common from '../../../locales/en.json'
import PedigreeAutocomplete from 'src/components/PedigreeAutocomplete';
import { FormControlLabel, Radio, Box, Checkbox } from '@mui/material';
import { Images } from 'src/assets/images';
import React, { useEffect, useRef } from 'react';

export default function Pedigree(props: any) {
  type filtersType = typeof common;
  const placeholderType: filtersType = common;
  const sireRef = useRef<any>();
  const damSireRef = useRef<any>();
  const keyAncestorRef = useRef<any>();
  const placeholderArr = [placeholderType.common.sire, placeholderType.common.grandSire, placeholderType.common.keyAncestor];
  const getSpecificRef = (placeholder: string) => {
    if (placeholder === placeholderArr[0]) return sireRef;
    else if (placeholder === placeholderArr[1]) return damSireRef;
    else if (placeholder === placeholderArr[2]) return keyAncestorRef;
  }

  const [isChecked, setIsChecked] = React.useState<boolean>(props.isExcludeKeyAncestor);
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    props.setClear(false);
    props.setIsExcludeKeyAncestor(event.target.checked);
    props.query.refetch();
    if (props.isExcludeKeyAncestorSelected === 0) {
      props.setIsExcludeKeyAncestorSelected(1);
      props.filterCounterhook.increment();
    }
  };

  useEffect(() => {
    if (props.clear) {
      setIsChecked(false);
    }
  }, [props.clear])

  return (
    <div>
      {placeholderArr.map((placeholder: string) => (
      <div key = {placeholder}>
        <PedigreeAutocomplete placeholder={placeholder} {...props} ref = { getSpecificRef(placeholder) }/>
      </div>
    ))}
        <Box className='includedPrivateFee'>
        <FormControlLabel
          control={
            <Checkbox
              disableRipple
              className='isPrivateFee'
              name={'isExcludeKeyAncestor'}
              checked={isChecked}
              onChange={handleCheckboxChange}
              key={placeholderType.common.ExcludeAncestor}
              checkedIcon={<img src={Images.Radiochecked} alt="checkbox" />}
              icon={<img src={Images.Radiounchecked} alt="checkbox" />}
            />
          }
          label={placeholderType.common.ExcludeAncestor}
        />
      </Box>
    </div>
  )
}
