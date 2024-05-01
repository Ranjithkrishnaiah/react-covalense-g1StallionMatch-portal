import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, StyledEngineProvider, Stack } from '@mui/material';
import { Images } from '../../assets/images';
import './card.css';
import Imgix from 'react-imgix';
import { useNavigate } from 'react-router';
import { toPascalCase } from 'src/utils/customFunctions';

type StallionDetailsCardProps = {
  farmName: String;
  image: any;
  countryCode: String;
  email: String;
  stateName: String;
  website: String;
  farmId: String;
};

export default function StallionDetailsCard(props: any) {
  const { farmName, image, countryCode, email, stateName, website, profilePic, farmId } = props;

  const navigate = useNavigate();

  const clickRedirectHandler = () => {
    navigate(`/stud-farm/${toPascalCase(farmName)}/${farmId}`);
  };

  return (
    <StyledEngineProvider injectFirst>
      <Card className="SPcard" sx={{ background: '#F4F1EF', boxShadow: 'none', padding: '1.5rem' }}>
        <Stack direction={{ lg: 'column', sm: 'row', xs: 'column' }}>
          <CardMedia>
            <Box className="farmlogo-column">
              {image && image ? (
                <div onClick={clickRedirectHandler}>
                  <Imgix
                    src={image}
                    imgixParams={{w:120,h:80,ar:'3:2',fit:'crop'}}
                    htmlAttributes={{ alt: farmName+' Logo' }}
                  />
                </div>
              ) : (
                <img
                  src={Images.farmplaceholder}
                  alt={farmName+' Logo'}
                  onClick={clickRedirectHandler}
                />
              )}
            </Box>
          </CardMedia>
          <CardContent className="SPcardCnt">
            <Typography variant="subtitle1" className="SPcardCntHeader" component="div">
              {toPascalCase(farmName)}
            </Typography>
            <Typography component="span">
              {stateName}
              {stateName && ','} {countryCode}
            </Typography>
            <Box className="sp-mails">
              <Typography variant="h6">{email}</Typography>

              <Typography variant="h6">
                <a href={'//' + website} target="_blank">
                  {website}
                </a>
              </Typography>
            </Box>
          </CardContent>
        </Stack>
      </Card>
    </StyledEngineProvider>
  );
}
