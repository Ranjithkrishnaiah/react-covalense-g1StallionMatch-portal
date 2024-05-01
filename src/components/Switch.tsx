import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch, { SwitchProps } from '@mui/material/Switch';
import React, { SetStateAction } from 'react';
import { useUpdatePreferencesMutation } from 'src/redux/splitEndpoints/updateNotificationPreferences';

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 52,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: ' 0',
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      paddingLeft: '10px',
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#1D472E' : '#1D472E',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.mode === 'light' ? '#F9FAFB' : '#637381',
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#B0B6AF' : '#B0B6AF',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

interface newSwitchProps {
  id?: string;
  name?: string;
  setPromoted?: React.Dispatch<SetStateAction<boolean | undefined>>;
  setNominated?: React.Dispatch<SetStateAction<boolean | undefined>>;
  setNewlyPromoted?: React.Dispatch<SetStateAction<boolean>>;
  setNewlyNominated?: React.Dispatch<SetStateAction<boolean>>;
  setStopPromoted?: React.Dispatch<SetStateAction<boolean>>;
  setStopNomination?: React.Dispatch<SetStateAction<boolean>>;
  setAutoRenewel?: React.Dispatch<SetStateAction<boolean>>;
  disabled?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  notificationType?: string;
  profilePage?: boolean;
  notificationFunctionArray?:any;
  onClick?:(e:any) => void;
  itemKey?:any
}

export default function CustomizedSwitches(props: newSwitchProps) {
  const [updateNotification, response ] = useUpdatePreferencesMutation();

  const handleClick = (e: any) => {
    let selected = e.target.checked;
    if (props.setPromoted) props.setPromoted(selected);
    if (props.setNominated) props.setNominated(selected);
    if (props.setNewlyPromoted) props.setNewlyPromoted(selected);
    if (props.setNewlyNominated) props.setNewlyNominated(selected);
    if (!selected && props.setStopPromoted) props.setStopPromoted(!selected);
    if (!selected && props.setStopNomination) props.setStopNomination(!selected);
    if (props.setAutoRenewel) props.setAutoRenewel(selected);
    // props.checked = selected;

    if (props?.profilePage && props?.id && typeof(props.checked) === "boolean") {
    if (props?.profilePage && props?.id) {
      updateNotification({
        notificationTypeId: parseInt(props?.id.split('-')[1]),
        isActive: !props.checked
      })
    }

    return !e.target.checked;
  };
}

  if (props?.profilePage) {
    return (
      <FormGroup>
        <FormControlLabel
          sx={ { marginRight: '0' } }
          control={
          <IOSSwitch sx={ { m: 1 } } {...props} 
          checked = {props?.checked}
          disabled={props?.notificationType === "System Notifications" ? 
          true : false}  onChange={handleClick}
          defaultChecked = {props?.notificationType === "System Notifications" ? true: 
          typeof(props?.checked) == 'boolean'? props.checked: undefined }
           />}
          // control={<IOSSwitch sx={ { m: 1 } } {...props} disabled={props?.notificationType === "System Notifications" ? true : false} defaultChecked={true} onChange={handleClick} />}
          label=""
        />
      </FormGroup>
    );
  }
  else{
    return (
      <FormGroup>
        <FormControlLabel
          sx={ { marginRight: '0' } }
          control={<IOSSwitch sx={ { m: 1 } } {...props}  onChange={handleClick} />}
          label=""
        />
      </FormGroup>
    );
  }


}
