import {
  Box,
  MenuList,
  Stack,
  Typography,
  StyledEngineProvider,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { CustomSelect } from 'src/components/CustomSelect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import './notification.css';
import { Notification, NotificationsList } from 'src/@types/notification';

// props
type propsType = {
  sortOptionSelected: string;
  setSortOptionSelected: (a: string) => void;
  setNotificationsList: (a: NotificationsList[] | undefined) => void;
  data: NotificationsList[] | undefined;
};

function Header(props: propsType) {
  // props
  const { sortOptionSelected, setSortOptionSelected, setNotificationsList, data } = props;
  const sortByOptions = ['Most Recent', 'Unread', 'Read'];

  // method for handling sort dropdowm
  const handleChange = (event: SelectChangeEvent) => {
    setSortOptionSelected(event.target.value as string);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        marginLeft: '0px',
        marginTop: '-2px',
        boxShadow: 'none',
        border: 'solid 1px #161716',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        boxSizing: 'border-box',
      },
    },
  };

  return (
    <StyledEngineProvider injectFirst>
      <Box pt={5} pb={2}>
        <Stack direction={{ lg: 'row', sm: 'row', xs: 'column' }}>
          <Box flexGrow={1}>
            <Typography variant="h2">Notifications</Typography>
          </Box>
          <Box className="notif-header" sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5" pr={2}>
              Sort by
            </Typography>
            <CustomSelect
              disablePortal
              defaultValue={'Most recent'}
              IconComponent={KeyboardArrowDownRoundedIcon}
              className="selectDropDownBox notification-select-box"
              MenuProps={MenuProps}
              onChange={handleChange}
              renderValue={(selected: any) => selected}
            >
              {sortByOptions.map((res) => (
                <MenuItem className="selectDropDownList" key={res} value={res}>
                  {res}
                </MenuItem>
              ))}
            </CustomSelect>
          </Box>
        </Stack>
      </Box>
    </StyledEngineProvider>
  );
}

export default Header;
