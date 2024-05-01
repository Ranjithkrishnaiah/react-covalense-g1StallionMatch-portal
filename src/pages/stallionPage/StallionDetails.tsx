import { Container, AppBar } from '@mui/material';
import React, { useRef } from 'react';
import '../stallionDirectory/StallionDirectory.css';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Overview from './tabs/Overview';
import HypoMating from './tabs/HypoMating';
import RaceRecord from './tabs/RaceRecord';
import Pedigree from './tabs/Pedigree';
import Progeny from './tabs/Progeny';
import Testimonials from './Testimonials';
import Scrollspy from 'react-scrollspy';

type StallionDetailsProps = {
  id: string;
  name: string;
}


function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function StallionDetails(props: any) {

  const { formId, horseName, stallionId, farmId } = props;
  const overviewRef = useRef<HTMLElement | null>(null);
  const hypoMatingRef = useRef<HTMLElement | null>(null);
  const raceRecordRef = useRef<HTMLElement | null>(null);
  const pedigreeRef = useRef<HTMLElement | null>(null);
  const progenyRef = useRef<HTMLElement | null>(null);

  const handleScroll = (ref: React.MutableRefObject<HTMLElement | null>) => {
    if (ref?.current?.offsetTop) {
      if (ref?.current?.id === 'Overview') {
        window.scrollTo({ top: ref?.current?.offsetTop - 150, behavior: "smooth" })
      } else {
        window.scrollTo({ top: ref?.current?.offsetTop - 80, behavior: "smooth" })
      }
    } 
  };
  return (
    <Box mt={2} className='SPtabs'>
      <AppBar position='sticky' sx={ { top: '92px', background: '#FFFFFF', boxShadow: 'none' } }>
        <Box sx={ { borderBottom: 1, borderColor: 'divider' } }>
          <Container>
            <Scrollspy  items={['Overview', 'Hypo-Mating', 'Race-Record', 'Pedigree', 'Progeny']} offset={-100} className="nav__inner" currentClassName="is-current">
              <li className='nav__item' onClick={() => handleScroll(overviewRef)}><a>Overview</a></li>
              <li className='nav__item' onClick={() => handleScroll(hypoMatingRef)}><a>Hypo Mating</a></li>
              <li className='nav__item' onClick={() => handleScroll(raceRecordRef)}><a>Race Record</a></li>
              <li className='nav__item' onClick={() => handleScroll(pedigreeRef)}><a>Pedigree</a></li>
              <li className='nav__item' onClick={() => handleScroll(progenyRef)}><a>Progeny</a></li>
            </Scrollspy>
          </Container>
        </Box>
      </AppBar>
      <section id="Overview" ref={overviewRef} ><Overview {...props} /></section>
      <section id="Hypo-Mating" ref={hypoMatingRef}><HypoMating  {...props}/></section>
      <section id="Race-Record" ref={raceRecordRef}><RaceRecord stallionId = { stallionId } /></section>
      <section id="Pedigree" ref={pedigreeRef}><Pedigree id={formId} name={horseName} farmId={farmId} /></section>
      <section id="Progeny" ref={progenyRef}><Progeny stallionId={ stallionId }/></section>
      <section className='stallionPage-Testimonials'><Testimonials {...props} /></section>
    </Box>
  );
}

