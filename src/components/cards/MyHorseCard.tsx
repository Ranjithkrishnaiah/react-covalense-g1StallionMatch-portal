import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {  StyledEngineProvider } from '@mui/material';
import { CustomButton } from '../CustomButton';
import './card.css';
import { Link } from 'react-router-dom'; 

// MyHorse Card Props
export type MyHorseCardProps = {
    src: string;
    title: string;
    total: string;
    link: string;
}

export default function MyHorseCard(props: MyHorseCardProps) { 
  window.sessionStorage.removeItem('MyFavouriteListFrom');
  const handlefavouriteList = () => {
    window.sessionStorage.setItem('MyFavouriteListFrom', 'My Horses');
  };
  return (
    <StyledEngineProvider injectFirst>
      <Card className='myhorse-card' sx={ { background: '#F4F1EF', boxShadow: '2px 5px 15px #d4d4d4' } }>
        <CardMedia
          component="img"
          height="140"
          image={ props.src }
          alt={props.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h4" component="div" className="SDcardTitle">
             {props.title }
          </Typography>
          <Typography component="span" className="year">
             { props.total }
          </Typography>
          <Typography variant="body2" sx={ { height: '5rem' } } />
        </CardContent>
        <CardActions className="SDcardBottom horses-bottom" sx={ { display: 'flex' } }>
          <Link to={`/dashboard/${props.link}`} onClick={() => handlefavouriteList()}>
          <CustomButton className="viewButton">
            View List <i className='icon-Arrow-right'/>
          </CustomButton>
          </Link>
        </CardActions>
      </Card>
    </StyledEngineProvider>
  )
}
