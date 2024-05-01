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
import { InsertCommas } from 'src/utils/FunctionHeap';

type Props = {
  stallionId: string;
  horseName: string;
  similarTo: string;
  farmName: string;
  farmState: string;
  feeYear: number;
  isPromoted: boolean;
  currencyCode: string;
  currencySymbol: string;
  profilePic: string;
  galleryImage: string;
  fee: number;
  yob: number;
  isSimilarStallions: boolean;
  isPopularStallions: boolean;
  isCompatibleStallions: boolean;
  countryCode: string;
};

export default function MediaCard({ stallionId, horseName, 
    similarTo, fee, feeYear, isPromoted, profilePic, 
    galleryImage, farmName, farmState, currencyCode, 
    currencySymbol, isSimilarStallions, isPopularStallions, isCompatibleStallions, yob, countryCode }: Props) {
  const navigate = useNavigate();

  const sendToProfile = () => {
    navigate(`/stallions/${toPascalCase(horseName)}/${stallionId}/View`);
  };

  return (
    <StyledEngineProvider injectFirst>
      <Card className="SDcard">
        <Stack className='SDcardMedia'>
        {(galleryImage && isPromoted) || profilePic ? (
          <>
          {galleryImage ? (
            <Stack className="SDcardMediaImg">
              <CardMedia component="img" height="176px" 
              image={galleryImage ? galleryImage : profilePic || Images.horse} alt={`${toPascalCase(horseName)}`} />
            </Stack>
          ) : (
            <Avatar alt={horseName} src={profilePic || Images.HorseProfile} className="SDavatar" />
          )}
        </>
        ) : (
          <Avatar
            alt={horseName+ ' Stallion'}
            src={profilePic ?profilePic+'?h=40&w=40&ar=1:1&fit=crop&mask=ellipse&nr=-100&nrs=100' : Images.HorseProfile}
            className="SDavatar"
          />
        )}
        </Stack>
        <CardContent sx={ { flexGrow: '1' } } className='SDcardBody'>
          <Typography gutterBottom variant="h4" component="div" className="SDcardTitle">
            {toPascalCase(horseName)} { isPopularStallions? `(${(countryCode)})`: "" }
          </Typography>
          {isSimilarStallions && 
          <Typography component="span" className="year">
            Similar to {toPascalCase(similarTo)}
          </Typography>}
          {isPopularStallions && <Typography component="span" className="year">
            {yob}
          </Typography>}
          <Typography gutterBottom variant="body2"  mt={2} className="breed">
            {toPascalCase(farmName)} { farmState }
          </Typography>
          <Box pb={1}>
          <Typography variant="body2" className="year">
            {currencyCode?.substring(0, 2)} { currencySymbol}{InsertCommas(fee)} ({feeYear})
          </Typography>
          </Box>
         
        </CardContent>
        <CardActions className="SDcardBottom" sx={ { display: 'flex', marginTop: 'auto' } }>
          <Box flexGrow={1}>
            <CustomButton className="viewButton" onClick={sendToProfile} disabled={!isPromoted}>
              View Profile {isPromoted ? <i className="icon-Arrow-right" /> : ''}
            </CustomButton>
          </Box>
        </CardActions>
      </Card>
    </StyledEngineProvider>
  );
}
