import { Box, Container, StyledEngineProvider } from '@mui/material';
import { useEffect } from 'react';
import MyHorseCard, { MyHorseCardProps } from '../components/cards/MyHorseCard';
import { useGetMyHorseCountsQuery } from 'src/redux/splitEndpoints/getMyHorsesCounts';
import ListHeader from 'src/components/ListHeader';
import { Images } from 'src/assets/images';

// MetaTags
import useMetaTags from 'react-metatags-hook';

function MyHorses() {
  //MetaTags for MyHorses
  const BaseAPI = process.env.REACT_APP_PUBLIC_URL;
  const myHorsesUrl = `${BaseAPI}dashboard/my-horses`;
  const myHorsesImage = process.env.REACT_APP_MYHORSES_IMAGE;
  useMetaTags(
    {
      title: `My Horses Dashboard | Stallion Match`,
      description: `All of your horses and stats in one place. Customise your lists and show all of your mares and stallions stats on your dashboard.`,
      openGraph: {
        title: `My Horses Dashboard | Stallion Match`,
        description: `All of your horses and stats in one place. Customise your lists and show all of your mares and stallions stats on your dashboard.`,
        site_name: 'Stallion Match',
        url: myHorsesUrl,
        type: 'business.business',
        image: myHorsesImage,
      },
    },
    []
  );

  // API call to get horse counts
  const { data: AllCounts, isSuccess: isAllCountsSuccess } = useGetMyHorseCountsQuery();

  // These details must come from the API
  const data = [
    {
      title: 'My Mares',
      src: Images.MareFoal,
      total: `${AllCounts?.memberMares ? AllCounts?.memberMares + ' mares added' : ''}`,
      link: 'mares-list',
    },
    {
      title: 'Favourite Stallions',
      src: Images.hellbent,
      total: ` ${
        AllCounts?.favouriteStallions ? AllCounts?.favouriteStallions + ' stallions added' : ''
      }`,
      link: 'favourite-stallions-list',
    },
    {
      title: 'Favourite Broodmare Sires',
      src: Images.IaiPaddok,
      total: ` ${
        AllCounts?.favouriteDamsires ? AllCounts?.favouriteDamsires + ' damsires added' : ''
      }`,
      link: 'favourite-damsires-list',
    },
    {
      title: 'Favourite Farms',
      src: Images.Farm,
      total: `${AllCounts?.favouriteFarms ? AllCounts?.favouriteFarms + ' farms added' : ''}`,
      link: 'favourite-farms-list',
    },
  ];

  return (
    <StyledEngineProvider injectFirst>
      <Container>
        <ListHeader title="My Horses" buttons={[]} buttonFunctionId={[]} />
        <Box
          className="myhorse-page-wrapper"
          py={2}
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
          }}
        >
          {/* my horses card */}
          {data.map((value: MyHorseCardProps, index: number) => (
            <MyHorseCard {...value} key={value.title + index} />
          ))}
        </Box>
      </Container>
    </StyledEngineProvider>
  );
}

export default MyHorses;
