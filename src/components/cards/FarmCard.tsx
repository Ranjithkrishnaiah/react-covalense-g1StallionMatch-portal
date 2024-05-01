import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Stack, StyledEngineProvider } from '@mui/material';
import { Images } from '../../assets/images';
import { CustomButton } from '../CustomButton';
import './card.css';
import { useNavigate } from 'react-router-dom';
import { toPascalCase } from '../../utils/customFunctions';
import Imgix from 'react-imgix';

export default function FarmCard({ farms }: any) {
  const { farmId, farmName, YearToStud, isPromoted, fee, countryName, stateName, currencyCode, currencySymbol, overview, profilePic } = farms;
  const navigate = useNavigate();
  const sendToProfile = () => {
    window.localStorage.setItem('comeFromFarmDirectory', 'true');
    navigate(`/stud-farm/${toPascalCase(farmName)}/${farmId}`);
  }
  return (
    <StyledEngineProvider injectFirst>
      <Card className='farmcard'>
        <Stack className='farmcardMedia'>         
          {profilePic && isPromoted ? 
          <Imgix
            src={profilePic}
            imgixParams={{w:270,h:180, ar:'3:2',fit:'crop'}}
            disableQualityByDPR
            htmlAttributes={{ alt: `${toPascalCase(farmName)} Stud Farm` }} 
          /> :
            <CardMedia
              component="img"
              height="180px"
              image={Images.farmplaceholder}
              alt={`${toPascalCase(farmName)} Stud Farm`}
            />} 
          
        </Stack>

        <CardContent sx={{ flexGrow: '1' }}>
          <Typography gutterBottom variant="h4" component="div" className="SDcardTitle">
            {toPascalCase(farmName)}
          </Typography>
          <Typography component="span" className="year">
            {stateName}{stateName && ','} {countryName} {YearToStud}
          </Typography>
        </CardContent>
        <CardActions className="farmcardBottom" sx={{ display: 'flex' }}>
          <CustomButton className="viewButton" onClick={sendToProfile} disabled={!isPromoted}>
            View Profile <i className='icon-Arrow-right' />
          </CustomButton>
        </CardActions>
      </Card>
    </StyledEngineProvider>
  )
}
