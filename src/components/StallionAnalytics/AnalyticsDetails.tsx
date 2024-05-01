import { Divider, Paper, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import CustomAccordionDetails from "../customAccordion/CustomAccordionDetails";
import { CustomButton } from '../CustomButton';
import CustomizedSwitches from '../Switch';
import './StallionAnalytics.css';

function AnalyticsDetails(props: any) {
  // console.log("AP: ", props)
  return (
    <>
     <CustomAccordionDetails sx={ { padding: '0 1.25rem' } }>
        {
          props.analytics.map((subArray:any[], index:number) => (
          <Box key={index}>
            <Stack
            className='roaster-profile'
              pb={3}
              direction={ { xs: 'column', sm: 'row' } }
              divider={
                <Divider
                  orientation="vertical"
                  sx={ { borderBottom: 'solid 1px #B0B6AF', borderColor: '#B0B6AF' } }
                  flexItem
                />
              }
              spacing={2}
            >
          {subArray.map((obj:any, i:number) =>(
            <Stack
            className='roaster-profile-box'
            key={obj.title + i}
            direction={ { xs: 'row', sm: 'column' } }
            sx={ { width: '100%', alignItems: { xs: 'center', md: 'flex-start' } } }
          >
            <Box sx={ { width: { md: '100%', sm: '100%', xs: '50%' } } }>
              <Typography variant="h6">{obj.title}</Typography>
            </Box>
            <Box sx={ { width: { md: '100%', sm: '100%', xs: '50%' } } }>
              <Typography variant="h4">{obj.value}</Typography>
            </Box>
          </Stack>
          ))}
        </Stack>
        {index === 1?
        <Box pb={2}>
        <Typography variant="h3">Key Statistics</Typography>
      </Box>:""}
        <Divider
          orientation="horizontal"
          sx={ {
            display: { lg: 'none', sm:'none', xs: 'block' },
            borderBottom: 'solid 1px #B0B6AF',
            mb: '1rem',
          } }
          flexItem
        />
        </Box>
          ))
        }
        {/* <Stack
          pb={3}
          direction={ { xs: 'column', sm: 'row' } }
          divider={
            <Divider
              orientation="vertical"
              sx={ { borderBottom: 'solid 1px #B0B6AF', borderColor: '#B0B6AF' } }
              flexItem
            />
          }
          spacing={2}
        >
          <Stack
            direction={ { xs: 'row', sm: 'column' } }
            sx={ { width: '100%', alignItems: { xs: 'center', md: 'flex-start' } } }
          >{

          }
            <Box sx={ { width: { md: '100%', sm: '100%', xs: '50%' } } }>
              <Typography variant="h6">SM Searches</Typography>
            </Box>
            <Box sx={ { width: { md: '100%', sm: '100%', xs: '50%' } } }>
              <Typography variant="h4">358</Typography>
            </Box>
          </Stack>
          <Stack
            direction={ { xs: 'row', sm: 'column' } }
            sx={ { width: '100%', alignItems: { xs: 'center', md: 'flex-start' } } }
          >
            <Box sx={ { width: { md: '100%', sm: '100%', xs: '50%' } } }>
              <Typography variant="h6">20/20 Matches</Typography>
            </Box>
            <Box sx={ { width: { md: '100%', sm: '100%', xs: '50%' } } }>
              <Typography variant="h4">201</Typography>
            </Box>
          </Stack>

          <Stack
            direction={ { xs: 'row', sm: 'column' } }
            sx={ { width: '100%', alignItems: { xs: 'center', md: 'flex-start' } } }
          >
            <Box sx={ { width: { md: '100%', sm: '100%', xs: '50%' } } }>
              <Typography variant="h6">Perfect Matches</Typography>
            </Box>
            <Box sx={ { width: { md: '100%', sm: '100%', xs: '50%' } } }>
              <Typography variant="h4">4</Typography>
            </Box>
          </Stack>
        </Stack>
        <Divider
          orientation="horizontal"
          sx={ {
            display: { md: 'none', xs: 'block' },
            borderBottom: 'solid 1px #B0B6AF',
            mb: '1rem',
          } }
          flexItem
        />
        <Stack
          direction={ { xs: 'column', sm: 'row' } }
          divider={
            <Divider
              orientation="vertical"
              sx={ { borderBottom: 'solid 1px #B0B6AF', borderColor: '#B0B6AF' } }
              flexItem
            />
          }
          spacing={2}
        >
          <Stack
            direction={ { xs: 'row', sm: 'column' } }
            sx={ { width: '100%', alignItems: { xs: 'center', md: 'flex-start' } } }
          >
            <Box sx={ { width: { md: '100%', sm: '100%', xs: '50%' } } }>
              <Typography variant="h6">Page Views</Typography>
            </Box>
            <Box sx={ { width: { md: '100%', sm: '100%', xs: '50%' } } }>
              <Typography variant="h4">300</Typography>
            </Box>
          </Stack>
          <Stack
            direction={ { xs: 'row', sm: 'column' } }
            sx={ { width: '100%', alignItems: { xs: 'center', md: 'flex-start' } } }
          >
            <Box sx={ { width: { md: '100%', sm: '100%', xs: '50%' } } }>
              <Typography variant="h6">Messages</Typography>
            </Box>
            <Box sx={ { width: { md: '100%', sm: '100%', xs: '50%' } } }>
              <Typography variant="h4">12</Typography>
            </Box>
          </Stack>

          <Stack
            direction={ { xs: 'row', sm: 'column' } }
            sx={ { width: '100%', alignItems: { xs: 'center', md: 'flex-start' } } }
          >
            <Box sx={ { width: { md: '100%', sm: '100%', xs: '50%' } } }>
              <Typography variant="h6">Nominations</Typography>
            </Box>
            <Box sx={ { width: { md: '100%', sm: '100%', xs: '50%' } } }>
              <Typography variant="h4">7</Typography>
            </Box>
          </Stack>
        </Stack>
        <Box pt={5}>
          {' '}
          <Typography variant="h3">Key Statistics</Typography>
        </Box>
        <Stack
          py={3}
          direction={ { xs: 'column', sm: 'row' } }
          divider={
            <Divider
              orientation="vertical"
              sx={ { borderBottom: 'solid 1px #B0B6AF', borderColor: '#B0B6AF' } }
              flexItem
            />
          }
          spacing={2}
        >
          <Stack
            direction={ { xs: 'row', sm: 'column' } }
            sx={ { width: '100%', alignItems: { xs: 'center', md: 'flex-start' } } }
          >
            <Box sx={ { width: { md: '100%', sm: '100%', xs: '50%' } } }>
              <Typography variant="h6"># of Runners</Typography>
            </Box>
            <Box sx={ { width: { md: '100%', sm: '100%', xs: '50%' } } }>
              <Typography variant="h4">608</Typography>
            </Box>
          </Stack>
          <Stack
            direction={ { xs: 'row', sm: 'column' } }
            sx={ { width: '100%', alignItems: { xs: 'center', md: 'flex-start' } } }
          >
            <Box sx={ { width: { md: '100%', sm: '100%', xs: '50%' } } }>
              <Typography variant="h6"># of Winners</Typography>
            </Box>
            <Box sx={ { width: { md: '100%', sm: '100%', xs: '50%' } } }>
              <Typography variant="h4">441</Typography>
            </Box>
          </Stack>

          <Stack
            direction={ { xs: 'row', sm: 'column' } }
            sx={ { width: '100%', alignItems: { xs: 'center', md: 'flex-start' } } }
          >
            <Box sx={ { width: { md: '100%', sm: '100%', xs: '50%' } } }>
              <Typography variant="h6">Winners/Runners</Typography>
            </Box>
            <Box sx={ { width: { md: '100%', sm: '100%', xs: '50%' } } }>
              <Typography variant="h4">49%</Typography>
            </Box>
          </Stack>
        </Stack>
        <Divider
          orientation="horizontal"
          sx={ {
            display: { md: 'none', xs: 'block' },
            borderBottom: 'solid 1px #B0B6AF',
            mb: '1rem',
          } }
          flexItem
        />
        <Stack
          direction={ { xs: 'column', sm: 'row' } }
          divider={
            <Divider
              orientation="vertical"
              sx={ { borderBottom: 'solid 1px #B0B6AF', borderColor: '#B0B6AF' } }
              flexItem
            />
          }
          spacing={2}
        >
          <Stack
            direction={ { xs: 'row', sm: 'column' } }
            sx={ { width: '100%', alignItems: { xs: 'center', md: 'flex-start' } } }
          >
            <Box sx={ { width: { md: '100%', sm: '100%', xs: '50%' } } }>
              <Typography variant="h6">M/F Runners</Typography>
            </Box>
            <Box sx={ { width: { md: '100%', sm: '100%', xs: '50%' } } }>
              <Typography variant="h4">305/303</Typography>
            </Box>
          </Stack>
          <Stack
            direction={ { xs: 'row', sm: 'column' } }
            sx={ { width: '100%', alignItems: { xs: 'center', md: 'flex-start' } } }
          >
            <Box sx={ { width: { md: '100%', sm: '100%', xs: '50%' } } }>
              <Typography variant="h6"># of Stakes Winners</Typography>
            </Box>
            <Box sx={ { width: { md: '100%', sm: '100%', xs: '50%' } } }>
              <Typography variant="h4">13</Typography>
            </Box>
          </Stack>

          <Stack
            direction={ { xs: 'row', sm: 'column' } }
            sx={ { width: '100%', alignItems: { xs: 'center', md: 'flex-start' } } }
          >
            <Box sx={ { width: { md: '100%', sm: '100%', xs: '50%' } } }>
              <Typography variant="h6">Stakes Winners/Rnrs</Typography>
            </Box>
            <Box sx={ { width: { md: '100%', sm: '100%', xs: '50%' } } }>
              <Typography variant="h4">3%</Typography>
            </Box>
          </Stack>
        </Stack> */}
      </CustomAccordionDetails>
    </>
  );
}

export default AnalyticsDetails;
