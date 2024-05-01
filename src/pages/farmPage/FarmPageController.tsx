import { Container, Grid, StyledEngineProvider } from '@mui/material';
import React, { useState } from 'react';
import FarmDetails from './FarmDetails';
import FarmSlider from './FarmSlider';
import Header from './Header';
import { scrollToTop } from '../../utils/customFunctions';
import { useParams } from 'react-router-dom';
import { useGetFarmByIdQuery, useGetFarmCountryByIdQuery } from 'src/redux/splitEndpoints/getFarmsByIdSplit';
import {
  useGetFarmGalleryimageQuery,
} from 'src/redux/splitEndpoints/getFarmDetailsSplit';
import Loader from 'src/components/Loader';
import { useFarmPageViewMutation, useFarmPageViewAuthMutation } from 'src/redux/splitEndpoints/farmsSplit';
import { useGetUsersFarmListQuery } from 'src/redux/splitEndpoints/getUsersFarmListSplit';
import useAuth from 'src/hooks/useAuth';

type Params = {
  farmId: string;
};
export default function FarmPageController() {
  const params = useParams();
  const farmId: any = params.farmId;
  
  // Geo country call, if geoCountryName is not available in local storage
  const geoCountry = localStorage.getItem('geoCountryName');
  React.useEffect(() => {
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

  const { data: farmDetailsById, isSuccess, isLoading } = useGetFarmCountryByIdQuery({farmId: farmId, country: geoCountry || 'Australia'});
  const { authentication } = useAuth();
  const { data: farmList } = useGetUsersFarmListQuery(null, { skip: !authentication });
  const { data: farmGalleryImagesData, isSuccess: isFarmGalleryImagesSuccess } =
    useGetFarmGalleryimageQuery(farmId);
  let farmDetails = farmDetailsById ? farmDetailsById : [];
  const [close, setClose] = useState<any>(false);
  const [isChanges, setSetChanges] = useState<any>(false);

  const farmDetailsProps = {
    farmDetails: { ...farmDetails, gallaryImage: farmGalleryImagesData?.length ? farmGalleryImagesData[0].mediaUrl : process.env.REACT_APP_STALLIONS_DEFAULT_IMAGE },
    farmList,
    query: farmDetailsById,
    setClose,
    setSetChanges,
    isChanges,
    close,
  };

  const [farmpageView] = useFarmPageViewMutation();
  const [farmPageViewAuth] = useFarmPageViewAuthMutation();
  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = accessToken ? true : false;

  React.useEffect(() => {
    if (authentication) {
      farmPageViewAuth({ farmId: farmId, "referrer": document.referrer });
    } else {
      farmpageView({ farmId: farmId, "referrer": document.referrer });
    }
  }, []);

  React.useEffect(() => {
    scrollToTop();
  }, []);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <StyledEngineProvider injectFirst>
        {farmDetailsProps.farmDetails ? <Header {...farmDetailsProps} /> : ''}
        <Container maxWidth="lg" className="farmpagesliderWrapper">
          <Grid container>
            <Grid item lg={12} sm={12} xs={12}>
              <FarmSlider farmGalleryImagesData={farmGalleryImagesData} farmDetailsProps={farmDetailsProps} dimension="?w=1152&h=568&fit=crop" />
            </Grid>
          </Grid>
        </Container>
        <FarmDetails {...farmDetailsProps.farmDetails} />
      </StyledEngineProvider>
    </>
  );
}
