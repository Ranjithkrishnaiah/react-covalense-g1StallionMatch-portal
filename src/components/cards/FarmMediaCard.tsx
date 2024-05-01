
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { StyledEngineProvider } from '@mui/material';
import { Images } from '../../assets/images';

import './card.css';



export default function FarmMediaCard() { 
    
  return (
    <StyledEngineProvider injectFirst>
      <Card sx={ { boxShadow: 'none' } }>
        <CardMedia
          component="img"
          height="140"
          image={Images.Mediapic}
          alt="green iguana"
        />
        {/* <Avatar alt="Remy Sharp" src={Images.HorseProfile} className='SDavatar'/> */}
        <CardContent sx={ { padding: '1.5rem 0' } }>
        <Typography gutterBottom variant="h5" sx={ { color: '#626E60', fontFamily: 'Synthese-Book' } }>
           1st January 2022
            {/* {name} */}
          </Typography> 
          <Typography py={1} gutterBottom variant="h4" className="MediacardTitle">
          I Am Invincible First to 100
            {/* {name} */}
          </Typography>
          <Typography variant='h6' mt={1}>
          Eu at scelerisque egestas velit. Magna ornare faucibus duis ridiculus quisque ut vitae massa purus. Consequat cursus egestas at.
          </Typography>
          <Typography variant="body2" className="year">
            {/* AUD {amount} ({amountYear}) */}
          </Typography>
        </CardContent>
      </Card>
    </StyledEngineProvider>
  )
}
