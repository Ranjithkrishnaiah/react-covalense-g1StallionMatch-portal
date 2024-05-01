import {Box, Skeleton} from '@mui/material';
export default function MessageImageLoading() {
    return (
        <Box className='messageImgLoad'>
            <Skeleton
                    variant="rectangular"
                    animation="wave"
                    className="greyBG"
                    sx={{ width: '264px', height: '176px', borderRadius:"4px" }}
                  />
        </Box>
    );
}