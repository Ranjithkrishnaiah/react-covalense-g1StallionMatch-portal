import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Avatar, IconButton, StyledEngineProvider, Box, Stack } from '@mui/material';
import { Images } from '../../assets/images';
import { CustomButton } from '../CustomButton';
import './card.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { toPascalCase } from '../../utils/customFunctions';
import { upperCase } from 'lodash';

type Props = {
  stallionId: string;
  stallionName: string;
  mareName: string;
  yob: number;
  isPromoted: boolean;
  countryCode: string;
  profilePic: string;
  galleryImage: string;
  mareId: string;
};

export default function MediaCard({ stallionId, stallionName, 
    mareName, yob, isPromoted, countryCode, profilePic, galleryImage,mareId }: Props) {
  const navigate = useNavigate();

  const sendToProfile = () => {
    // navigate(`/stallions/${toPascalCase(stallionName)}/${stallionId}/View`);
    navigate(`/stallion-search?stallionId=${stallionId}&mareId=${mareId}`);
  };

  const { pathname } = useLocation();
  

  return (
    <StyledEngineProvider injectFirst>
      <Card className="SDcard">
        <Stack className='SDcardMedia'>
          {isPromoted ? (
            <Stack className="SDcardMediaImg">
              <CardMedia component="img" height="176px" 
              image={galleryImage ? galleryImage : profilePic || Images.horse} alt={`${toPascalCase(stallionName)}`} />
            </Stack>
          ) : (
            <Avatar alt={stallionName} src={profilePic || Images.HorseProfile} className="SDavatar" />
          )}
        </Stack>
        <CardContent sx={ { flexGrow: '1' } } className='SDcardBody'>
          <Typography gutterBottom variant="h4" component="div" className="SDcardTitle">
            {toPascalCase(stallionName)}
          </Typography>
          <Typography component="span" className="year">
            as Sire
          </Typography>
          <Typography gutterBottom variant="body2"  mt={2} className="breed">
            {toPascalCase(mareName)}({yob}, F, {countryCode})
          </Typography>
          <Box pb={1}>
          <Typography variant="body2" className="year">
            as Broodmare
          </Typography>
          </Box>
         
        </CardContent>
        <CardActions className="SDcardBottom" sx={ { display: 'flex', marginTop: 'auto' } }>
          <Box flexGrow={1}>
            <CustomButton className="viewButton" onClick={sendToProfile}>
              Search again <i className="icon-Search" /> 
            </CustomButton>
          </Box>
        </CardActions>
      </Card>
    </StyledEngineProvider>
  );
}
