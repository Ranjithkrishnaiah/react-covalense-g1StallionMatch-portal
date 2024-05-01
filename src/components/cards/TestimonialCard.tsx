import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { StyledEngineProvider, CardActions, Avatar, CardMedia, Stack } from '@mui/material';
import { Images } from '../../assets/images';
import './card.css';
import { CustomerTestimonials } from 'src/@types/Testimonials';
import Imgix from 'react-imgix';
import { Interweave } from 'interweave';

type Props = {
  key: number;
  testimonial: any;
  cardType:string;
};
export default function TestimonialCard({ testimonial,cardType }: Props) {
  // console.log('Props', testimonial);
  return (
    <StyledEngineProvider injectFirst>
      <Card className="testimonial" elevation={3} key={testimonial?.id}>
        <CardContent sx={{ height: '300px', p: '1.5rem' }}>
          <Typography>
            <img src={Images.Testimark} alt="codesIcon" />
          </Typography>
          <Typography className="testimCnt">
            {/* {testimonial?.testimonial} */}
            <Interweave className="interweave" content={testimonial?.testimonial || testimonial.description || testimonial.note} />
            {/* {testimonial.description || testimonial.note} */}
          </Typography>
        </CardContent>
        <CardMedia className="testimonial-author-wrapper" sx={{ px: '1.5rem', display: 'flex' }}>
          {cardType === 'Home' && (testimonial?.imageUrl ? (
            <Avatar
              className="testimonial-avatar"
              src={`${testimonial.imageUrl}?h=60&w=60&fit=crop&ar=1:1&mask=ellipse&nr=-100&nrs=100` || Images.Userprofile} // after getting images we will update the code to "testimonial.imagepath || Images.Userprofile"
              alt={`${testimonial?.name} from ${testimonial?.company} testimonial`}
            // sx={ { width: '60px', height: '60px' } }
            />
          ) : (
            <Avatar
              className="testimonial-avatar"
              src="https://dev-s3-lambda-bucket.s3.ap-southeast-2.amazonaws.com/media/additional/AdamWhite_Vinery.jpg"
              alt={`${testimonial?.name} from ${testimonial?.company} testimonial`}
            // sx={ { width: '60px', height: '60px' } }
            />
          ))}
          {cardType === 'stallionPage' &&( testimonial?.imageUrl ? (
            <Avatar
              className="testimonial-avatar"
              src={`${testimonial.imageUrl}?h=60&w=60&fit=crop&ar=1:1&mask=ellipse&nr=-100&nrs=100` || Images.Userprofile} // after getting images we will update the code to "testimonial.imagepath || Images.Userprofile"
              alt={`${testimonial?.name} from ${testimonial?.company} testimonial`}
            // sx={ { width: '60px', height: '60px' } }
            />
          ) : (
            <Avatar
              className="testimonial-avatar"
              src={`${testimonial?.media[0]?.mediaUrl}?h=60&w=60&fit=crop&ar=1:1&mask=ellipse&nr=-100&nrs=100` || Images.UserSignedOut}
              alt={`${testimonial?.name} from ${testimonial?.company} testimonial`}
            // sx={ { width: '60px', height: '60px' } }
            />
          ))}
          {/* {cardType === 'stallionPage' &&
            (testimonial && testimonial?.imagepath ?
            <Imgix
            src={testimonial.imagepath || Images.Userprofile}
            width={60} // This sets what resolution the component should load from the CDN and the size of the resulting image
            height={60}
            htmlAttributes={{ alt: "AdamWhite_Vinery" }}
          /> : 
          <Imgix
            src={testimonial?.media[0]?.mediaUrl || Images.UserSignedOut}
            width={60} // This sets what resolution the component should load from the CDN and the size of the resulting image
            height={60}
            htmlAttributes={{ alt: "AdamWhite_Vinery" }}
          />)
          } */}
          {cardType === 'Home' && <Stack className="testimonial-author">
            <Typography variant="h6" className="TestimName">
              {testimonial.name || testimonial.fullname}
            </Typography>
            <Typography className="TestimSurName">
              {testimonial.company}
              {testimonial?.countryCode ? ', ' + testimonial.countryCode : ''}
            </Typography>
          </Stack>}
          {cardType === 'stallionPage' && <Stack className="testimonial-author">
            <Typography variant="h6" className="TestimName">
              {testimonial.title || testimonial.fullname}
            </Typography>
            <Typography className="TestimSurName">
              {testimonial.company}
              {testimonial?.countryCode ? ', ' + testimonial.countryCode : ''}
            </Typography>
          </Stack>}
        </CardMedia>
      </Card>
    </StyledEngineProvider>
  );
}
