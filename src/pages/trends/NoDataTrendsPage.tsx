import { Box, Avatar, Typography, Container } from "@mui/material";
import { Images } from "src/assets/images";


function NoDataTrendsPage(props: any) {
    if (props.small) {
        return (
            <>
                <Container>
                    <Box className='Horse-wrapper small-no-data'>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar src={props.farm ? Images.farmplaceholder : Images.HorseProfile} sx={{ marginRight: '10px', width: '24px', height: '24px' }} />

                            <Typography variant='h6'>No Data Available </Typography>

                        </Box>

                    </Box>
                </Container>
            </>
        )
    }
    return (
        <>
            <Container>
                <Box className='Horse-wrapper'>
                    <Box sx={{ display: 'flex' }}>
                        <Avatar src={props.farm ? Images.farmplaceholder : Images.HorseProfile} sx={{ marginRight: '10px', width: '64px', height: '64px' }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box><Typography variant='h4'>No Data Available </Typography></Box>
                            {!props?.hottestCross && <Box><Typography variant='h6'>Update date range and/or change country</Typography></Box>}
                            {props?.hottestCross &&  <Box><Typography variant='h6'>Update country or refresh page</Typography></Box>}
                        </Box>
                    </Box>

                </Box>
            </Container>
        </>
    )
}

export default NoDataTrendsPage;