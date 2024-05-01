import { AppBar, Container } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import '../stallionDirectory/StallionDirectory.css';
import Box from '@mui/material/Box';
import Overview from './tabs/Overview';
import HypoMating from './tabs/HypoMating';
import OurStallionList from './tabs/OurStallionList';
import Media from './tabs/Media';
import {
  useFarmStallionsQuery,
} from 'src/redux/splitEndpoints/stallionRoasterSplit';
import { api } from 'src/api/apiPaths';
import Loader from 'src/components/Loader';
import { useGetFarmMediasQuery } from 'src/redux/splitEndpoints/getFarmDetailsSplit';
import Scrollspy from 'react-scrollspy';
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function FarmDetails(props: any) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const overviewRef = useRef<HTMLElement | null>(null);
  const ourStallionRef = useRef<HTMLElement | null>(null);
  const hypoMatingRef = useRef<HTMLElement | null>(null);
  const mediaRef = useRef<HTMLElement | null>(null);

  //scroll the window
  const handleScroll = (ref: React.MutableRefObject<HTMLElement | null>) => {
    if (ref?.current?.offsetTop) {
      if (ref?.current?.id === 'Overview') {
        window.scrollTo({ top: ref?.current?.offsetTop - 150, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: ref?.current?.offsetTop - 100, behavior: 'smooth' });
      }
    }
  };
  
  const [sortBy, setSortBy] = useState<any>();
  const [page, setPage] = useState<number>(1);
  const url: any = api.farmsUrl + '/' + props.farmId + api.farmStallions;
  let newState = {
    Url: url,
    body: {
      order: 'ASC',
      sortBy: sortBy === 'none' ? 'Alphabetical' : 'Alphabetical', //Need to validate the issue with sortBy
      page: page,
      limit: 12,
    },
  };
  const { data: stallionListData, isSuccess, isLoading } = useFarmStallionsQuery(newState);
  const {
    data: farmMediaDetailsData,
    isSuccess: isFarmMediaDetailsSuccess,
    isLoading: isFarmMediaLoading,
  } = useGetFarmMediasQuery(props.farmId);

  const stallionListProps: any = {
    stallionListData: stallionListData?.data,
    pagination: stallionListData?.meta,
    setSortBy,
    setPage,
  };

  const overviewProps: any = {
    ...props,
    stallionListProps,
  };

  //scrolls the window to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (newState?.body?.page !== 1) {
      var myElement: any = document.getElementById('Our-Stallions');
      if (myElement) {
        window.scrollTo({ top: myElement?.offsetTop - 100, behavior: 'smooth' });
      }
    }
  }, [newState]);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <Box mt={2} className="SPtabs">
      <AppBar position="sticky" sx={{ top: '92px', background: '#FFFFFF', boxShadow: 'none' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Container>
            <Scrollspy
              items={['Overview', 'Our-Stallions', 'Hypo-Mating', 'Media']}
              offset={-100}
              className="nav__inner"
              currentClassName="is-current"
            >
              <li className="nav__item" onClick={() => handleScroll(overviewRef)}>
                <a>Overview</a>
              </li>
              <li className="nav__item" onClick={() => handleScroll(ourStallionRef)}>
                <a>Our Stallions</a>
              </li>
              <li className="nav__item" onClick={() => handleScroll(hypoMatingRef)}>
                <a>Hypo Mating</a>
              </li>
              <li className="nav__item" onClick={() => handleScroll(mediaRef)}>
                <a>Media</a>
              </li>
            </Scrollspy>
          </Container>
        </Box>
      </AppBar>

      <section id="Overview" ref={overviewRef}>
        <Overview {...overviewProps} />
      </section>
      <section id="Our-Stallions" ref={ourStallionRef}>
        <OurStallionList {...stallionListProps} />
      </section>
      <section id="Hypo-Mating" ref={hypoMatingRef}>
        <HypoMating {...props} />
      </section>
      <section id="Media" className="media-slider-wrapper" ref={mediaRef}>
        <Media farmMediaDetailsData={farmMediaDetailsData} {...props} />
      </section>
    </Box>
  );
}
