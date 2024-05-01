import { Container, Grid, StyledEngineProvider } from '@mui/material';
import Header from './Header';
import StallionSlider from './StallionSlider';
import StallionFarmDetails from './StallionFarmDetails';
import StallionDetails from './StallionDetails';
import {  useParams } from 'react-router-dom';
import {
  useGetStallionDetailsQuery,
  useGetStallionGalleryimageQuery,
} from 'src/redux/splitEndpoints/getStallionDetailsSplit';
import { useState, useEffect } from 'react';
import { scrollToTop, toPascalCase } from '../../utils/customFunctions';
import "../stallionSearch/stallionsearch.css";
import { useStallionPageViewAuthMutation, useStallionPageViewMutation } from 'src/redux/splitEndpoints/stallionSplit';
import SkeletonPreLoading from 'src/components/skeletonPreLoading/skeletonPreLoading';
import useAuth from 'src/hooks/useAuth';


type Params = {
  id: string;
  name: string;
};

function StallionPageController() {
  
  const { id }: Readonly<Partial<Params>> = useParams();
  const { authentication } = useAuth();
  const stallionId: any = id;

  // Geo country call, if geoCountryName is not available in local storage
  const geoCountry = localStorage.getItem('geoCountryName');
  useEffect(() => {
    if (geoCountry === null) {
      navigator?.geolocation?.getCurrentPosition(
        function (position) {
          var Geonames = require('geonames.js');
          const geonames = new Geonames({
            username: 'cvlsm',
            lan: 'en',
            encoding: 'JSON',
          });
          let gmtOffset: any;
          let lng: any;
          let lat: any;
          geonames
            .timezone({ lng, lat })
            .then((res: any) => {
              gmtOffset = res.gmtOffset;
              lat = position.coords.latitude;
              lng = position.coords.longitude;
              return geonames.findNearby({ lng, lat });
            })
            .then((loc: any) => {
              localStorage.setItem('geoCountryName', loc.geonames[0].countryName);
            })
            .catch(function (err: any) {
              return err.message;
            });
        },
        function (error) {
          console.error('Error Code = ' + error.code + ' - ' + error.message);
        }
      );
    }
  }, [geoCountry]);

  const { data: stallionGalleryImageDetails, isSuccess: isstallionGalleryImageDetailsSuccess } =
    useGetStallionGalleryimageQuery(stallionId);
  const response = useGetStallionDetailsQuery({stallionId:stallionId,country:geoCountry || 'Australia'});
  let stallionDetails = response?.data ? response?.data : [];
  const name = stallionDetails?.horseName;
  const [close, setClose] = useState<any>(false);
  const [isChanges, setSetChanges] = useState<any>(false);
  const [stallionpageView] = useStallionPageViewMutation();
  const [stallionpageViewAuth] = useStallionPageViewAuthMutation();
  const stallionDetailsProps = {
    stallionDetails: { ...stallionDetails, gallaryImage: stallionGalleryImageDetails?.length ? stallionGalleryImageDetails[0].mediaUrl : process.env.REACT_APP_STALLIONS_DEFAULT_IMAGE, customTitle: `${toPascalCase(stallionDetails?.horseName)} ${toPascalCase(stallionDetails?.farmName)} | Stallion Match` },
    query: response,
    setSetChanges,
    isChanges,
    setClose,
    close,
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  useEffect(() => {
    if (authentication) {
      stallionpageViewAuth({ "referrer": document.referrer, stallionId: stallionId });
    } else {
      stallionpageView({ "referrer": document.referrer, stallionId: stallionId });
    }
  }, []);

  return (
    <>
      <StyledEngineProvider injectFirst>
        {response?.isFetching && <SkeletonPreLoading />}
        {/* loads header component if stallion details are present  */}
        {stallionDetailsProps.stallionDetails ? <Header {...stallionDetailsProps} /> : ''}
        {response?.isFetching === false && <Container maxWidth="lg" className="stallionDetailsGridContainer">
          <Grid container spacing={3} className="stallionDetailsGrid">
            <Grid item lg={8} sm={12} xs={12} className="StallionSlider">
              <StallionSlider stallionGalleryImageDetails={stallionGalleryImageDetails} dimension="?w=760&h=507&fit=crop&ar=3:2" />
            </Grid>
            <Grid item lg={4} xs={12} className="StallionFarmDetails">
              <StallionFarmDetails {...stallionDetails} />
            </Grid>
          </Grid>
        </Container>}
        {id && name && <StallionDetails {...stallionDetails} />}
      </StyledEngineProvider>
    </>
  );
}

export default StallionPageController;