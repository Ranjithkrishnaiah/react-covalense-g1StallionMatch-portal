import { Avatar, Box, Container, Stack, Typography } from '@mui/material';
import { Images } from 'src/assets/images';
import { timer } from '../../utils/customFunctions';
import { toPascalCase } from 'src/utils/customFunctions';
import { useEffect, useState } from 'react';
import { formatDistance } from 'date-fns';

interface ActivityProps {
    src: string;
    farmName: string;
    information: string;
    timeStamp: number;
    handleRemoveActivity: any;
    id?: number;
    farmActivityId?: number
}
function Activity(props: ActivityProps) {

    const [notificationTimestamp, setNotificationTimestamp] = useState(null);

    useEffect(() => {
        const res = props.timeStamp;
        const timestamp = res ? new Date(res) : 0;
        const distance: any = formatDistance(Date.now(), timestamp, { addSuffix: true });
        const timeStamp = distance.substring(distance.indexOf(distance.match(/\d+/g)));
        setNotificationTimestamp(timeStamp);
    }, [props.timeStamp]);

    return (
        <Container>
            <Box className='activity' my={1} key={props.farmActivityId}>
                <Box sx={{ display: 'flex' }}>
                    <Avatar alt={props.farmName} src={props.src || Images.farmplaceholder} sx={{ marginRight: '10px', width: '64px', height: '64px' }} />
                    <Stack sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box><Typography variant='h5' sx={{ color: '#161716' }}><b>{toPascalCase(props.farmName)}</b> {props.information}</Typography></Box>
                        <Box pt={1}><Typography variant='h6'>{notificationTimestamp} ago</Typography></Box>
                        {/* <Box pt={1}><Typography variant='h6'>{timer(new Date(props.timeStamp).getTime())}</Typography></Box> */}
                    </Stack>
                </Box>
                <Box>
                    <i className="icon-Cross" onClick={() => props.handleRemoveActivity(props.farmActivityId)} />
                </Box>
            </Box>
        </Container>
    )
}

export default Activity