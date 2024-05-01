import React, { useState, useEffect } from 'react';
// import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Typography, StyledEngineProvider } from '@mui/material';
import { VoidFunctionType } from "../@types/typeUtils";
// import * as Yup from 'yup';
import { CustomButton } from 'src/components/CustomButton';
import { useGetProductsDetailsBasedOnLocationQuery, useGetProductsSplitQuery } from 'src/redux/splitEndpoints/getProductsSplit';

// import { ValidationConstants } from '../constants/ValidationConstants';
// import { toast } from 'react-toastify';


// export interface AddFarmSchemaType {

//     farmName?: string,
//     // farmCountryId?: number,
//     // farmStateId?: number,
//     // farmWebsiteUrl?: string,

// }

function AddStallionPromote(title: string, onClose: VoidFunctionType, openOther: VoidFunctionType, OpenPromote: string, selectedStallionIds: any, Reset: boolean, setReset: React.Dispatch<React.SetStateAction<boolean>>) {

  const close = onClose;
  const openPromoteStallion = openOther;
  // const [productData, setProductData] = useState<any>([]);

  const params = {
    order: 'ASC',
    page: 1,
    limit: 20,
  };

  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = accessToken ? true : false;
  // const { data: Products, isSuccess: productListSuccess } = useGetProductsSplitQuery(params, { skip: !isLoggedIn, refetchOnMountOrArgChange: true });
  const { data: promoteStallionProductData } = useGetProductsDetailsBasedOnLocationQuery('PROMOTION_STALLION', { refetchOnMountOrArgChange: true });
  // console.log(promoteStallionProductData,'promoteStallionProductData')
  // useEffect(() => {
  //   if (Products) {
  //     let data = Products.filter((v: any) => v.id === 9);
  //     // console.log(Products, data, 'PRO');
  //     setProductData(data)
  //   }
  // }, [Products])


  //  const [addToFarm,response] =  useFarmsAddMutation();

  // const AddFarmSchema = Yup.object().shape({
  //     farmName:  Yup.string().required(ValidationConstants.farmNameValidation),
  // })


  // const methods = useForm<AddFarmSchemaType>({
  //     resolver: yupResolver(AddFarmSchema),
  //     mode: "onTouched"
  // })


  //   const notifySuccess = () => toast.success("Farm Added Successfully",{
  //     autoClose: 2000,
  //     });

  // const notifyError = () => toast.error("Farm Already Exists",{
  //   autoClose: 2000,
  //   });

  // const {
  //     register,
  //     reset,
  //     handleSubmit,
  //     watch,
  //     formState: { errors }
  //   } = methods;




  //   const validateFarm = () => {
  //     if(errors.farmName || errors.farmCountryId || errors.farmStateId || errors.farmWebsiteUrl 
  //       || !watch('farmName') || !watchFarmCountry || !watch('farmWebsiteUrl') )
  //       return false;
  //   return true
  // }

  // useEffect(() => {
  //     if(response?.isSuccess){
  //     notifySuccess()
  //     }
  // }, [response?.isSuccess])



  const SubmitRegisteration = (event?: React.BaseSyntheticEvent) => {
    event?.preventDefault();
    //     const  {farmName,farmCountryId ,farmStateId ,farmWebsiteUrl } = data;

    //    const farmsdata ={ 
    //     "farmName": farmName,
    //     "countryId": Number(farmCountryId),
    //     "stateId": Number(farmStateId),
    //     "website": farmWebsiteUrl,
    //     // "email": "farm@matthew-farm.com",
    //     // "overview": "This is matthews farm"
    // }
    //      addToFarm(farmsdata);
    close();
    openPromoteStallion();

  }
  return (
    <StyledEngineProvider injectFirst>
      <form onSubmit={SubmitRegisteration} autoComplete="false" className='add-stallion-pop-wrapper'>
        <Box className={'show'}>
          <Box py={2} pb={0}>
            <Typography variant='h5'>Would you like to Promote your stallion now for a one-off annual fee of {promoteStallionProductData ? `${promoteStallionProductData[0]?.currencyCode?.substring(0, 2)}${promoteStallionProductData[0]?.currencySymbol} ${promoteStallionProductData[0]?.price}` : ''}?</Typography>
          </Box>

          <CustomButton
            type="submit"
            fullWidth
            className="lr-btn"
          > Yes </CustomButton>
        </Box>
      </form>
    </StyledEngineProvider>
  )
}

export default AddStallionPromote;