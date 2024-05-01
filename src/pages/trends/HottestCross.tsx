import { Grid, Typography, Stack, Divider } from '@mui/material'
import { Box } from '@mui/system'
import { CustomButton } from 'src/components/CustomButton';
import { toPascalCase } from 'src/utils/customFunctions';

type HottestCrossPros = {
  "SireName": string;
  "SireUuid": string;
  "BroodMareName": string;
  "BroodMareUuid": string;
  "SWCounts": number;
  "RunnerCounts": number;
  "Perc": number
}
function HottestCross(props: any) {
  return (
    <Box px={3}>
      <Grid container columns={13}>
        <Grid item lg={6} xs={13}>
          <Box className='hottest-cross'>
            <Typography variant='h5'>{toPascalCase(props?.SireName)}</Typography>
            <Typography component='span'>as Sire</Typography>
          </Box>
        </Grid>
        <Grid item lg={1} xs={13} className='cross' sx={ { py: { xs: '1rem' } } }>
             <i className='icon-Cross'/>
        </Grid>
        <Grid item lg={6} xs={13}>
        <Box className='hottest-cross'>
        <Typography variant='h5'>{toPascalCase(props?.BroodMareName)}</Typography>
        <Typography component='span'>as Broodmare Sire</Typography>
          </Box>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item lg={12} xs={12}>
          <Box className='hottest' mt={2}>
        <Stack
        className='hottest-count-box'
        direction={ { xs: 'column', sm: 'row' } }
        divider={<Divider orientation='vertical' sx={ { borderBottom: 'solid 1px #B0B6AF', borderColor: '#B0B6AF' } }
         flexItem />}
        spacing={2}
        >
          <Stack 
          className='hottest-count'
          direction={ { xs: 'row', sm: 'column' } }
          sx={ { width: '100%', alignItems:{ xs:'center', md:'flex-start' } } }
          >
            <Box sx={ { width:{ md: '100%', sm: '100%', xs: '100%' } } }>
          <Typography variant='h6'>Runners</Typography>
          </Box>
          <Box sx={ { width:{ md: '100%', sm: '100%', xs: '100%' } } }>
             <Typography variant='h4'>{props?.RunnerCounts}</Typography>
             </Box>
          </Stack>
          <Stack 
          className='hottest-count'
             direction={ { xs: 'row', sm: 'column' } }
             sx={ { width: '100%', alignItems:{ xs:'center', md:'flex-start' } } }
            >
               <Box sx={ { width:{ md: '100%', sm: '100%', xs: '100%' } } }>
              <Typography variant='h6'>SW</Typography>
              </Box>
              <Box sx={ { width:{ md: '100%', sm: '100%', xs: '100%' } } }>
              <Typography variant='h4'>{props?.SWCounts}</Typography>
              </Box>
          </Stack>
         
          <Stack 
          className='hottest-count'
          direction={ { xs: 'row', sm: 'column' } }
          sx={ { width: '100%', alignItems:{ xs:'center', md:'flex-start' } } }
          >
            <Box sx={ { width:{ md: '100%', sm: '100%', xs: '100%' } } }>
          <Typography variant='h6'>SW / Runners %</Typography>
          </Box>
          <Box sx={ { width:{ md: '100%', sm: '100%', xs: '100%' } } }>
          <Typography variant='h4'>{props?.Perc && Number(props?.Perc).toFixed(2)}</Typography>
          </Box>
          </Stack>
         </Stack>
         </Box>
        </Grid>
      </Grid>
      <Box className='hotcross-btn'>
        <CustomButton className='buttonGlobal' target="_blank" href="https://g1goldmine.com/">View in G1 Goldmine</CustomButton>
      </Box>
    </Box>
  )
}

export default HottestCross