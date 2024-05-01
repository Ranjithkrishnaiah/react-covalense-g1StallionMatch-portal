import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';

const CustomFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
      
    '&.css-1phjhrw-MuiFormControlLabel-root .MuiFormControlLabel-label':{
        fontSize:'30px',
    }
   
}))

export default CustomFormControlLabel