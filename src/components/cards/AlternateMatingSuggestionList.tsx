import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Images } from 'src//assets/images';
import { Box, StyledEngineProvider, Typography, Avatar, styled, TooltipProps, Tooltip, tooltipClasses } from '@mui/material';
import { CustomButton } from 'src/components/CustomButton';
import './card.css';
import { useNavigate } from 'react-router-dom';
import { AlternateMatingSuggestions } from 'src/@types/AlternateMatingSuggestions';
import Imgix from 'react-imgix';
import { getQueryParameterByName, scrollToTop } from 'src/utils/customFunctions';
import { toPascalCase } from 'src/utils/customFunctions';

type Props = {
  key: string;
  data: AlternateMatingSuggestions;
};

export default function AlternateMatingSuggestionList({
    key,
    data
  }: Props) {

    const navigate = useNavigate();
    const mareId  = getQueryParameterByName('mareId') || "";
    console.log("mareId",mareId);
    
    // If user clicks on a particular alternating, route to that corresponding search page 
    const searchAlternateStallion = () => {
      if(mareId) {

        navigate(`/stallion-search?stallionId=${data.stallionId}&mareId=${mareId}`);
      }else {
        navigate(`/stallion-search?stallionId=${data.stallionId}`);
      }
      scrollToTop(); 
    }
    const iconFire = (data?.isHot === 1) ? 'icon-Fire' : '';
    const iconThunder = (data?.isThunder === 1) ? 'icon-Lightening-bolt' : '';
    const matchType = (data?.isHot === 1) ? 'Perfect Match' : (data?.isThunder === 1) ? '20/20 Match' : '';
    
    const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
      <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#ffffff',
        color: 'rgba(0, 0, 0, 0.87)',
        // boxShadow: theme.shadows[1],
        fontSize: 14,
        fontFamily: 'Synthese-Book',
        padding: '12px',
        border: '1px solid #E2E7E1',
        borderRadius: '8px',
        boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)',
        fontWeight: 'bold',
        cursor: 'pointer',
      },
    })); 
    
    return (
      <StyledEngineProvider injectFirst>
        <Card className='SDcard'>
            <CardMedia sx={ {display: 'flex', justifyContent: 'space-between', alignItems: 'center'} }>
                <Avatar 
                  alt={data.horseName} 
                  src={data?.profilePic ? data?.profilePic+'?h=40&w=40&ar=1:1&fit=crop&mask=ellipse&nr=-100&nrs=100': Images.HorseProfile} 
                  className="SDavatar"
                />
                <LightTooltip 
                enterTouchDelay={0}
                leaveTouchDelay={6000}
                title={matchType}>
                <i className={`${iconFire} ${iconThunder} icon-for-alternate`} style={{ cursor: 'pointer' }}></i>
                </LightTooltip>
            </CardMedia>                
            <CardContent sx={ {flexGrow: '1'} }>
                <Typography gutterBottom variant="h4" component="div" className="SDcardTitle">
                    {toPascalCase(data.horseName)}
                </Typography>
                <Typography component="span" className="year">
                {data.yob}
                </Typography>
                <Typography variant="body2" mt={2} className="breed">
                {toPascalCase(data.farmName)}&nbsp;{toPascalCase(data.farmState)}
                </Typography>
                <Typography variant="body2" className="year">
                {data.currencyCode?.substring(0, 2)} {data.currencySymbol}{data.fee} ({data.feeYear})
                </Typography>
            </CardContent>
            <CardActions className="SDcardBottom" sx={ { display: 'flex', marginTop: 'auto' } }>
              <Box flexGrow={1}>
              <CustomButton className="viewButton" onClick={searchAlternateStallion}>
               Search
              </CustomButton>
              </Box>
            </CardActions>
        </Card>
      </StyledEngineProvider>
    );
  }