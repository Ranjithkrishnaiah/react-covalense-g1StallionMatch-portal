import { yupResolver } from '@hookform/resolvers/yup';
import { InputLabel, Box, TextField, MenuItem, Grid, TextareaAutosize } from '@mui/material';
import { useForm } from 'react-hook-form';
import { CustomButton } from 'src/components/CustomButton';
import { CustomSelect } from 'src/components/CustomSelect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import * as Yup from 'yup';

function LocalBoostDetails() {
  const validationSchema = Yup.object().shape({});

  const methods = useForm<any>({
    resolver: yupResolver(validationSchema),
    mode: 'onTouched',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  // submit handler for local boost
  const SubmitLocalBoost = (data: any, event?: React.BaseSyntheticEvent) => {};

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        marginRight: '2px',
        marginTop: '5px',
        boxShadow: 'none',
        border: 'solid 1px #161716',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        boxSizing: 'border-box',
      },
    },
  };

  return (
    <>
      <Box>
        <form
          onSubmit={handleSubmit(SubmitLocalBoost)}
          autoComplete="false"
          className="localBoost-stallion-pop-wrapper"
        >
          <Grid container>
            <Grid item lg={6} xs={12}>
              <Box className="local-boost-details">
                <Box mb={3} sx={{ pr: { lg: '3rem', xs: '0' } }}>
                  <InputLabel>Full Name</InputLabel>
                  <TextField
                    fullWidth
                    type="text"
                    placeholder="Enter Full Name"
                    {...register('fullName', { required: true })}
                    defaultValue={''}
                  />
                  <p>{errors.fullName?.message}</p>
                </Box>
                <Box sx={{ pr: { lg: '3rem', xs: '0' } }}>
                  <InputLabel>Select Stallion(s)</InputLabel>
                  <CustomSelect
                    className="selectDropDownBox"
                    fullWidth
                    defaultValue={'none'}
                    IconComponent={KeyboardArrowDownRoundedIcon}
                    MenuProps={MenuProps}
                  >
                    <MenuItem className="selectDropDownList" value={'none'}>
                      I am Invincible
                    </MenuItem>
                    <MenuItem className="selectDropDownList" value={'none'}>
                      I am Stallion
                    </MenuItem>
                  </CustomSelect>
                </Box>
              </Box>
            </Grid>
            <Grid item lg={6} xs={12}>
              <Box className="local-boost-details">
                <InputLabel>Message</InputLabel>
                <TextareaAutosize
                  className="localboost-form"
                  minRows={15}
                  placeholder="Enter message"
                  defaultValue={''}
                  {...register('message', { required: true })}
                />
                <Box className="local-boost-btns">
                  <CustomButton className="next">Next</CustomButton>
                  <CustomButton className="back" ml={3}>
                    Back
                  </CustomButton>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </>
  );
}

export default LocalBoostDetails;
