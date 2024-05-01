import { Box, Typography, StyledEngineProvider, Stack } from '@mui/material';
import { VoidFunctionType } from '../@types/typeUtils';
import { CustomButton } from 'src/components/CustomButton';
import { Link } from 'react-router-dom';
import './LRpopup.css';
import axios from 'axios';
import { api } from 'src/api/apiPaths';
import { useAddToCartNominationMutation } from 'src/redux/splitEndpoints/addToCartForNominationSplit';
import { useGetProductsDetailsBasedOnLocationQuery } from 'src/redux/splitEndpoints/getProductsSplit';
import { useGetConvertedCurrencyListMutation } from 'src/redux/splitEndpoints/getCartItemsSplit';
import { useGetCurrenciesQuery } from 'src/redux/splitEndpoints/getCurrenciesSplit';
import { usePatchNominationRequestMutation, usePostNominationRequestMutation } from 'src/redux/splitEndpoints/postNominationRequestSplit';
import { useEffect } from 'react';

function MessageAcceptOffer(
  onClose: VoidFunctionType,
  patchParams: any,
  offerPrice: any,
  respondedValueState: any,
  setRespondedValueState: any,
  setLoaderInProgress: any
) {
  const close = onClose;

  const [addToCartNomination, addToCartNominationResponse] = useAddToCartNominationMutation();
  const { data: nominationStallionProductData } = useGetProductsDetailsBasedOnLocationQuery('NOMINATION_STALLION');
  const [getConvertedCurrencyList, getConvertedCurrencyListResponse] = useGetConvertedCurrencyListMutation();
  const { data: currencies, isSuccess: isCurrencySuccess } = useGetCurrenciesQuery();
  const [patchNominationRequest, response] = usePatchNominationRequestMutation();

  // onclose
  const handleClose = () => {
    close();
  };

  const callConversionAPI = () => {
    const user = JSON.parse(window.localStorage.getItem("user") || '{}');
    let userCountryCode = user?.memberaddress[0]?.currencyCode;

    let userCurrencyId: any = null;
    for (let index = 0; index < currencies.length; index++) {
      const element = currencies[index];
      if (element?.label === userCountryCode) {
        userCurrencyId = element?.id;
        break;
      }
    }
    // console.log(userCurrencyId, 'userCurrencyId 123')
    return userCurrencyId;
  }

  // method to submit nomination accept/decline
  const patchNominationOfferApi = async (payloadData: any) => {
    // const accessToken = localStorage.getItem('accessToken');
    // var config: any = {
    //   method: 'patch',
    //   url: api.baseUrl + api.nominationRequestUrl,
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //     'Content-Type': 'application/json',
    //   },
    //   data: payloadData,
    // };
    await patchNominationRequest(payloadData);

    // await axios(config).then((res: any) => {

    //   const cartPayload = {
    //     productId: 10,
    //     price: res?.data?.introFee,
    //     quantity: 1,
    //     items: [res?.data?.nominationRequestId],
    //     currencyId: 1,
    //   };
    //   addToCartNomination(cartPayload);
    // });
  };

  useEffect(() => {
    if (patchParams?.isAccepted) {
      if (response.isSuccess) {
        const callCurrencyApis = async () => {
          const cartData: any = await addToCartNomination({
            productId: 10,
            currencyId: nominationStallionProductData.length ? nominationStallionProductData[0].currencyId ? nominationStallionProductData[0].currencyId : 1 : 1,
            price: response?.data?.introFee,
            items: [(response.data.newRequestId)],
            quantity: 1,
            // newRequestId:response.data.newRequestId
          });
          let userCurrencyId = callConversionAPI();
          if (userCurrencyId) {
            if (nominationStallionProductData[0].currencyId !== userCurrencyId) {
              await getConvertedCurrencyList(
                {
                  "currencyId": userCurrencyId,
                  "cartList": [{ 'cartId': cartData?.data?.cartSessionId }]
                }
              )
              setTimeout(() => {
                window.location.reload();
              }, 500);
            }
          };
        }
        callCurrencyApis();
      }
    }
  }, [response.isSuccess])

  // let nomiCurrency = nominationStallionProductData.length ? nominationStallionProductData[0].currencyId : 1;
  // if(nomiCurrency !== callConversionAPI()) {
  //   await getConvertedCurrencyList(
  //     {
  //       "currencyId": callConversionAPI(),
  //       "cartList": [{ 'cartId': res?.data?.nominationRequestId }]
  //     }
  //   )
  // }

  // on accept or decline offer
  const handleSuccess = () => {
    setLoaderInProgress(true);
    patchNominationOfferApi(patchParams);
    close();
  };

  return (
    <StyledEngineProvider injectFirst>
      <Box className={'show regis-success'}>
        <Box py={4}>
          {respondedValueState === 'Accept' ? (
            <Typography variant="h6">
              Upon accepting this offer, a confirmed intention to breed notification will be sent to
              both breeder and farm. This process is now complete and you will be charged an
              Introductory Fee as per our &nbsp;
              <a href={`/about/terms`} target={'_blank'}>
                Terms of Service.
              </a>
            </Typography>
          ) : (
            <Typography variant="h6">Are you sure you want to decline the offer?</Typography>
          )}
        </Box>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <CustomButton fullWidth className="lr-btn yes-btn" onClick={handleSuccess}>
            Yes
          </CustomButton>
          <CustomButton fullWidth className="no-btn" onClick={handleClose}>
            No
          </CustomButton>
        </Stack>
      </Box>
    </StyledEngineProvider>
  );
}

export default MessageAcceptOffer;
