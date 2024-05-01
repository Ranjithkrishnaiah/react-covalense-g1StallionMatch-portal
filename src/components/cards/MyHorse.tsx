
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {  StyledEngineProvider } from '@mui/material';
import { Images } from '../../assets/images';
import { CustomButton } from '../CustomButton';
import './card.css';
import { useNavigate } from 'react-router-dom'; 


export default function MyHorse() { 
    
    const navigate = useNavigate();
    const sendToProfile = () => {
        const id=1;// TODO need to change once we create the farm list
        const name = "test"; // TODO need to change once we create the farm list
        navigate(`farm-page/${id}&${name}`)
        //navigate(`farm-page/"1"&"test"`)
      }
  return (
    <StyledEngineProvider injectFirst>
      <Card sx={ { background: '#F4F1EF', boxShadow: '2px 5px 15px #d4d4d4' } }>
        <CardMedia
          component="img"
          height="140"
          image={Images.MareFoal}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h4" component="div" className="SDcardTitle">
             My Mares
          </Typography>
          <Typography component="span" className="year">
             6 mares added
          </Typography>
          <Typography variant="body2" sx={ { height: '5rem' } } />
        </CardContent>
        <CardActions className="SDcardBottom" sx={ { display: 'flex' } }>
          
          <CustomButton className="viewButton" onClick={sendToProfile}>
          View List <img src={Images.Arrowright} alt="arrow"/>
          </CustomButton>
        </CardActions>
      </Card>
    </StyledEngineProvider>
  )
}
