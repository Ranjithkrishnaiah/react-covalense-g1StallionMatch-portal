import Accordion from '@mui/material/Accordion';
import { styled } from '@mui/material/styles';

const CustomAccordion = styled(Accordion)(({ theme }) => ({
    borderColor: 'white',
    boxShadow: 'none'
}))

export default CustomAccordion