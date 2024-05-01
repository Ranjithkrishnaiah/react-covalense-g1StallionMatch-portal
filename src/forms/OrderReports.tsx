import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { OrderReportSchema } from 'src/@types/orderReport';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { api } from 'src/api/apiPaths';
import { useDispatch } from 'react-redux';
import { CustomSelect } from 'src/components/CustomSelect';
import { CustomButton } from 'src/components/CustomButton';
import { Images } from '../assets/images';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import CloseIcon from '@mui/icons-material/Close';
import TypedMultiSelect from 'src/components/typedMultiSelect/TypedMultiselect';
import {
  InputLabel,
  MenuItem,
  MenuList,
  StyledEngineProvider,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  Autocomplete,
  Checkbox,
  Stack,
  ListItemText,
} from '@mui/material';
import { ROUTES } from '../routes/paths';
import { Box } from '@mui/system';
import { VoidFunctionType } from '../@types/typeUtils';
import { useReportMutation } from 'src/redux/splitEndpoints/orderReportSplit';
import useAuth from '../hooks/useAuth';
import './LRpopup.css';
import { ValidationConstants } from 'src/constants/ValidationConstants';
import { useCountriesQuery } from 'src/redux/splitEndpoints/countrySplit';
import { useStatesQuery } from 'src/redux/splitEndpoints/statesSplit';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { useStallionShortlistsQuery } from '../redux/splitEndpoints/stallionShortListSplit';
import FeeRangeTemp from 'src/components/FeeRangeTemp';
import { useGetStallionByFeeAndLocationQuery } from 'src/redux/splitEndpoints/getStallionByFeeAndLocationSplit';
import { debounce } from "lodash"
import { useGuestStallionShortlistsQuery } from 'src/redux/splitEndpoints/guestStallionShortListSplit';
import { useSearchMareNamesQuery } from 'src/redux/splitEndpoints/searchMareNamesSplit';
import { useReportAffinityMutation } from 'src/redux/splitEndpoints/orderReportStallionAffinity';
import { useReportBroodMareAffinityMutation } from 'src/redux/splitEndpoints/orderReportBroodMareAffinity';
import { useReportBroodMareMutation } from 'src/redux/splitEndpoints/orderReportBroodMareSire';
import { useReportMatchProMutation } from 'src/redux/splitEndpoints/orderReportMatchPro';
import { useSelectSalesQuery } from 'src/redux/splitEndpoints/selectSale';
import { useReportMatchSalesMutation } from 'src/redux/splitEndpoints/orderReportMatchSales';
import { useGuestAddToCartBroodMareAffinityMutation } from 'src/redux/splitEndpoints/guestAddToCartBroodMareAffinity';
import { useGuestAddToShortListStallionMutation } from 'src/redux/splitEndpoints/guestAddToCartShortListStallion';
import { useGuestAddToCartBroodMareSireMutation } from 'src/redux/splitEndpoints/guestAddToCartBroodMareSire';
import { useGuestAddToCartMatchProMutation } from 'src/redux/splitEndpoints/guestAddToCartMatchPro';
import { useGuestAddToCartStaliionAffinityMutation } from 'src/redux/splitEndpoints/guestAddToCartStaliionAffinity';
import { useGuestAddToCartMatchSalesMutation } from 'src/redux/splitEndpoints/guestAddToCartMatchSales';
import { useFetchStallionListQuery } from 'src/redux/splitEndpoints/getStallionList';
import { useReportShortlistStallionMutation } from 'src/redux/splitEndpoints/orderReportShortlistStallion';
import { toPascalCase } from 'src/utils/customFunctions';
import { addToReportCart, setIsPaymentSucess } from 'src/redux/actionReducers/reportSlice';
import { toast } from 'react-toastify';
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog';
import CreateAStallion from './CreateAStallion';
import '../pages/stallionSearch/stallionsearch.css';
import 'src/components/customMultiSelectTags/MultiSelectTags.css';
import { LoadingButton } from '@mui/lab';
import useCounter from 'src/hooks/useCounter';
import { useGetAllStallionLocationsQuery } from 'src/redux/splitEndpoints/getAllStallionLocationsSplit';
import { useGetCurrenciesQuery } from 'src/redux/splitEndpoints/getCurrenciesSplit';
import { useGetConvertedCurrencyListMutation } from 'src/redux/splitEndpoints/getCartItemsSplit';
import DropdownTreeSelect from 'react-dropdown-tree-select';
import { useAddToCartStallionStockSalesMutation } from 'src/redux/splitEndpoints/addToCartStallionStockSales';
import { useGuestAddToCartStallionStockSalesMutation } from 'src/redux/splitEndpoints/guestAddToCartStallionStockSales';

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

function OrderReports(
  close: VoidFunctionType,
  updateEmail: VoidFunctionType,
  id: string,
  Reset: boolean,
  setReset: React.Dispatch<React.SetStateAction<boolean>>,
  formId: string,
  open: boolean,
  title?: string,
  currencyCode?: string,
  reportPrice?: any,
  reportCurrencyId?: any,
  reportCurrencySymbol?: any,
  cartInfo?: any,
  cartPrice?: string,
  viewStallionsAnalysed?: boolean,
  setViewStallionsAnalysed?: any,

) {
  // console.log(reportCurrencyId, 'reportCurrencyId')
  const dispatch = useDispatch()
  const { data: countriesList } = useCountriesQuery();
  const [postReport, response] = useReportMutation();
  const [postBroodmareReport, broodmareResponse] = useReportBroodMareAffinityMutation();
  const [postMatchProReport, matchProResponse] = useReportMatchProMutation()
  const [postStallionReport, stallionResponse] = useReportAffinityMutation();
  const [postBroodMareSire, broodMareSireResponse] = useReportBroodMareMutation();
  const [postMatchSaleSire, matchSaleResponse] = useReportMatchSalesMutation();
  const [postShortlistStallion, ShortlistStallionResponse] = useReportShortlistStallionMutation();

  const [postGuestBroodMareAffinity, guestbroodMareAffinityResponse] = useGuestAddToCartBroodMareAffinityMutation();
  const [postGuestShortListStallion, guestShortListStallionResponse] = useGuestAddToShortListStallionMutation();
  const [postGuestBroodMareSire, guestBroodMareSireResponse] = useGuestAddToCartBroodMareSireMutation();
  const [postGuestMatchPro, guestMatchProResponse] = useGuestAddToCartMatchProMutation();
  const [postGuestStaliionAffinity, uestStaliionAffinityResponse] = useGuestAddToCartStaliionAffinityMutation();
  const [postGuestMatchSales, uestMatchSalesResponse] = useGuestAddToCartMatchSalesMutation();
  const [postStallionStockSales, uesStallionStockSalesResponse] = useAddToCartStallionStockSalesMutation();
  const [postGuestStallionStockSales, uesGuestStallionStockSalesResponse] = useGuestAddToCartStallionStockSalesMutation();

  const [getConvertedCurrencyList, getConvertedCurrencyListResponse] = useGetConvertedCurrencyListMutation();

  const [states, setStates] = useState<any>();
  const [saleStates, setSaleStates] = useState<any>();
  const [stallionLocationId, setStallionLocationId] = useState<any>();
  const [saleLocationId, setSaleLocationId] = useState<any>();
  const [farmsName, setFarmsName] = useState<string[]>([]);
  const [mareName, setMareName] = useState<any>("");
  const [shortListedStallionName, setShortListedStallionName] = useState<string[]>([]);

  const [selectedShortListedStallion, setselectedShortListedStallion] = useState<string[]>([]);
  const [selecteFarms, setSelectedFarms] = useState<any>([]);
  const [selectedSales, setSelectedSales] = useState<any>([]);
  const [price, setPrice] = useState<any>();
  const [saleListSelected, setSaleListSelected] = useState<any>([]);
  const [saleLotsSelected, setSaleLotsSelected] = useState<any>([]);
  const [mareSelected, setMareSelected] = useState<any>()
  const [selectSaleList, setSelectSaleList] = useState<any>([]);
  const [selectLotsList, setSelectLotsList] = useState<any>([]);
  const [selectStallionList, setSelectStallionList] = useState<any>([]);
  const [preSelectedList, setPreSelectedList] = useState<any>([]);
  const [selectStallion, setSelectStallion] = useState<any>();
  const [cartItemList, setCartItemList] = useState<any>();
  const [cartState, setCartState] = useState({
    quantity: 1,
    mareName: "",
    price: "",
    countryCode: "",
    productName: "Report",
  })
  const stallionSelectRef = useRef<any>()

  const [lotsApiResponse, setLotsApiResponse] = useState<boolean>(false);
  const [salesApiResponse, setSalesApiResponse] = useState<boolean>(false);
  const filterCounterhook = useCounter(0);
  const filterEditCounterhook = useCounter(0);
  const [countryList, setCountryList] = useState<any>();
  const [locationList, setLocationList] = useState<boolean>(false);
  const [sortByLocation, setSortByLocation] = useState<any>(null);
  const [sortByState, setSortByState] = useState<any>(null);
  const [sortByLocal, setSortByLocal] = useState<any>(null);
  const treeDropdownRef = useRef<any>();

  const { data: stallionStateList, isFetching: stallionStateFetching } = useGetAllStallionLocationsQuery(undefined);

  // Get the list of cart from local storage. 
  useEffect(() => {
    if (localStorage.orderReports) {
      if (localStorage?.orderReports) {
        setCartItemList(JSON.parse(localStorage.orderReports))
      }
    }
  }, [])

  // show the selected sales id during edit
  const selectedSaleListIds: any = saleListSelected?.map((item: any) => {
    if (item?.saleId) {
      return item?.saleId;
    } else {
      return Number(item?.id)
    }
  }) || [];

  // show the selected lot id during edit
  const selectedLotIds: any = saleLotsSelected?.map((item: any) => Number(item.lotNumber)) || [];

  // console.log(selectedLotIds, 'selectedLotIds')
  // fetch lots data based on sales selection 
  const fetchSelectLots = (ids: any) => {
    const lotsData = {
      "sales": ids
    }

    axios.post(`${api.baseUrl}/sales-lot/by-sales`, lotsData).then(res => {
      setLotsApiResponse(true)
      if (res?.data?.length) {
        setSelectLotsList(res?.data);
      } else {
        setSelectLotsList([]);
      }
    })
  }

  // based on order report pushed the data to redux and local storage
  useEffect(() => {
    let reportList = localStorage.getItem('orderReports');
    let reportListData = reportList && JSON.parse(reportList) || [];
    dispatch(addToReportCart(reportListData))
  }, [])

  // reset the counter for stallion match pro report
  useEffect(() => {
    if (!viewStallionsAnalysed) {
      filterEditCounterhook.reset();
    }
  }, [viewStallionsAnalysed])

  // call the fetch api based on sale selection to get lots 
  useEffect(() => {
    if (saleListSelected?.length) {
      fetchSelectLots(selectedSaleListIds)
    }
  }, [saleListSelected])

  const { authentication } = useAuth();

  const params = {
    order: 'ASC',
    page: 1,
    limit: 20,
  };
  const { data: statesListbyId, isSuccess: isStatesByIdSuccess } = useStatesQuery(
    stallionLocationId,
    { skip: !Boolean(stallionLocationId) }
  );

  // const { data: Products } = useGetProductsSplitQuery(params);

  const paramData = {
    countryId: 11
  }

  const { data: selectSales, isSuccess: isSelectSalesSuccess } = useSelectSalesQuery(
    saleLocationId,
    { skip: !Boolean(saleLocationId), refetchOnMountOrArgChange: true }
  );

  const { data: statesSaleListbyId, isSuccess: isStatesSaleByIdSuccess } = useStatesQuery(
    saleLocationId,
    { skip: !Boolean(saleLocationId), refetchOnMountOrArgChange: true }
  );

  const shortListParams = {
    order: 'ASC',
  };

  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = accessToken ? true : false;
  const { data: currencies, isSuccess: isCurrencySuccess } = useGetCurrenciesQuery();
  const { data: shortListedStallionsList } = useStallionShortlistsQuery(shortListParams, {
    skip: !isLoggedIn,
  });
  // const localShortListIds: any = sessionStorage?.getItem('stallionIds');
  const localShortListParams: any = {
    stallionIds: window.sessionStorage.getItem('stallionIds'),
  }

  const { data: localShortListData } = useGuestStallionShortlistsQuery(localShortListParams,
    { skip: localShortListParams.stallionIds === null || authentication });

  const guestStallionlist: any = localShortListData?.data || []

  const [currency, setCurrency] = React.useState('');
  const [priceParam, setPriceParam] = useState<any>([]);
  const [currencyParam, setCurrencyParam] = useState<any>();
  const [locationParam, setLocationParam] = useState<any>();
  const navigate = useNavigate();
  const [isClearMare, setIsClearMare] = useState(0);
  const [isClearStallion, setIsClearStallion] = useState(0);
  const [stallionNameEnter, setStallionName] = useState('');
  const [stallionTitle, setStallionTitle] = useState('Submit a new Stallion');
  const [mareTitle, setMareTitle] = useState('Submit a new Mare');
  const [openCreateStallionModal, setOpenCreateStallionModal] = useState(false);
  const [isStalionFirst, setIsStalionFirst] = useState(true);
  const [isViewEditStallionClicked, setIsViewEditStallionClicked] = useState(false);
  const [isProReportPriceSliderChanged, setIsProReportPriceSliderChanged] = useState(false);

  // on success close the popup
  React.useEffect(() => {
    if (response.isSuccess) {
      reset();
      close();
    }
  }, [response]);

  // show the api response for sales Catalogue Report
  React.useEffect(() => {
    setSelectSaleList(selectSales);
    if (isSelectSalesSuccess) {
      setSalesApiResponse(true)
    }
  }, [selectSales, isSelectSalesSuccess]);

  // based on country selection show the sales list
  React.useEffect(() => {
    setStates(statesListbyId);
  }, [statesListbyId, isStatesByIdSuccess]);

  // based on country selection show the sales list
  React.useEffect(() => {
    setSaleStates(statesSaleListbyId);
  }, [statesSaleListbyId, isStatesSaleByIdSuccess]);

  // Based on price, currency and stallion location get the list of stallion in stallion pro report
  React.useEffect(() => {
    debouncedPrice(price);
    setCurrencyParam(currency);
    // console.log(currency, 'currency123 stallionLocationId')
    setLocationParam(stallionLocationId);
  }, [price, currency, stallionLocationId])

  React.useEffect(() => {
    debouncedPrice([]);
  }, [currency, stallionLocationId])

  const [radioSelectedValue, setRadioSelectedValue] = useState(false);
  const [isIncludeRadioSelectedValue, setIsIncludeRadioSelectedValue] = useState(false);
  const [farms, setFarms] = useState<any>([]);

  // check radio button for Stallion Affinity Report
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioSelectedValue(event.target.checked);
  };

  // checked for include private fee stallion list api
  const handleisIncludeRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsIncludeRadioSelectedValue(event?.target?.checked);
    setIsViewEditStallionClicked(false);
  };

  const [user, setUser] = useState<any>();

  // Get the user data
  useEffect(() => {
    if (localStorage.getItem('user') !== null) {
      setUser(JSON.parse(localStorage.getItem('user') || '{}'));
    }
  }, []);

  const stallionNameData: any = {
    stallionName: stallionNameEnter
  }

  const { data: selectStallionListData, isLoading: stallionLoading, isFetching: stallionFetching } = useFetchStallionListQuery(stallionNameData, { skip: !stallionNameData.stallionName });

  let stallionOptionList = stallionNameEnter !== '' ? selectStallionListData ? selectStallionListData?.data : [] : [];

  // Handle stallion selection
  const handleStallionInput = (e: any) => {
    setIsClearStallion(0);
    if (e?.target?.value && e?.target?.value?.length >= 3 && isClearStallion === 0) {
      setStallionName(e?.target?.value);
    }
  };

  const callConversionCurrencyId = () => {
    const user = authentication ? JSON.parse(window.localStorage.getItem("user") || '{}') : window.localStorage.getItem("geoCountryName");
    let userCountryCode = authentication ? user?.memberaddress[0]?.currencyCode : user;

    let userCurrencyId: any = null;
    if (authentication) {
      for (let index = 0; index < currencies?.length; index++) {
        const element = currencies[index];
        if (element?.label === userCountryCode) {
          userCurrencyId = element?.id;
          break;
        }
      }
    } else {
      if (countriesList) {
        for (let index = 0; index < countriesList?.length; index++) {
          const element: any = countriesList[index];
          if (element?.countryName === user) {
            userCurrencyId = element?.preferredCurrencyId;
            break;
          }

        }
      }
    }
    return userCurrencyId ? userCurrencyId : 1;
  }

  // Get the farm list
  useEffect(() => {
    if (user?.myFarms?.length > 0) {
      setFarms(user?.myFarms);
    }
  }, [user?.myFarms?.length])

  // Set currency based on user location
  useEffect(() => {
    if (callConversionCurrencyId()) {
      // console.log('callled')
      setCurrency(callConversionCurrencyId());
    }
  }, [open])


  const isSingleFarm: boolean = user?.myFarms?.length > 0 && user?.myFarms?.length === 1;

  // Dynamic form schema for all report 
  const dynamicSchema = Yup.object().shape({
    auth: Yup.lazy((user: string | null) => {
      if (!user) {
        return Yup.object().shape({
          fullName: Yup.string().required(ValidationConstants.farmNameValidation),
          email: Yup.string().email().required(ValidationConstants.emailValidation),
        });
      }
      return Yup.mixed().notRequired();
    }),
    reportId: Yup.lazy((reportId: string) => {
      switch (reportId) {
        case '0':
          return Yup.object().shape({
            mare: Yup.string().required(ValidationConstants.mareRequired),
            stallionLocation: Yup.number().required(ValidationConstants.saleLocationRequired),
          });
        case '1':
          return Yup.object().shape({
            stallion: Yup.string().required(ValidationConstants.stallionRequired),
          });
        case '2':
          return Yup.object().shape({
            mare: Yup.string().required(ValidationConstants.mareRequired),
            confirmStallions: Yup.string().required(ValidationConstants.stallionRequired),
          });
        case '3':
          return Yup.object().shape({
            mare: Yup.string().required(ValidationConstants.mareRequired),
            stallionLocation: Yup.number().required(ValidationConstants.saleLocationRequired),
            currency: Yup.string().required(ValidationConstants.currencyRequired),
          });
        case '4':
          return Yup.object().shape({
            saleLocation: Yup.string().required(ValidationConstants.saleLocationRequired),
            sale: Yup.string().required(ValidationConstants.saleRequired),
          });
        case '5':
          return Yup.object().shape({
            mare: Yup.string().required(ValidationConstants.mareRequired),
            stallionLocation: Yup.number().required(ValidationConstants.saleLocationRequired),
          });
      }
      return Yup.mixed().notRequired();
    }),
  });

  const methods = useForm<OrderReportSchema>({
    resolver: yupResolver(dynamicSchema),
    mode: 'onTouched',
    criteriaMode: 'all',
  });

  const {
    register,
    reset,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isDirty, isSubmitting },
  } = methods;

  // Reset form
  if ((Object.keys(errors).length > 0 && Reset) || (Reset && isDirty)) {
    reset();
    setReset(false);
  };

  const watchStallionLocation: any = watch('stallionLocation');
  const watchSaleLocation: any = watch('salesLocation');
  // console.log(typeof (watchStallionLocation), 'watchStallionLocation')
  // console.log(getValues('stallionLocation'), 'locationParam')
  // api param for Stallion Match PRO Report
  // console.log(currencyParam,'currencyParam',currency,'currency123')
  const stallionRangeParams: any = {
    location: watchStallionLocation ? watchStallionLocation?.length > 1 ? watchStallionLocation?.map((v: any) => v)?.join('|') : watchStallionLocation : '',
    currency: currencyParam ? currencyParam : '',
    priceRange: priceParam?.length > 0 ? `${priceParam[0]}-${priceParam[1]}` : cartInfo && '0-1000000',
    includePrivateFee: isIncludeRadioSelectedValue
  }
  const { data: stallionListInRange, isSuccess: stallionListInRangeSuccess, isFetching: stallionListInRangeFetching } = useGetStallionByFeeAndLocationQuery(stallionRangeParams, { skip: isViewEditStallionClicked });

  const getPrefilledCountryStateValue = () => {
    // const isStallionDirectoryPage = pathname.includes('/stallion-directory');
    // const isFarmDirectoryPage = pathname.includes('/farm-directory');
    // let filteredData = (isStallionDirectoryPage) ? (window.localStorage.getItem('storedFiltered')) : (isFarmDirectoryPage) ? (window.localStorage.getItem('storedFarmFiltered')) : null
    // console.log('locations>>>', locations, 'hasLocations>>>', hasLocation, 'filteredData>>>', filteredData);
    let value: any = cartInfo[0].commonList;
    if (value) {
      const reLast = /_\d+$/;
      const reFirst = /(\d+)_/;
      // console.log(value, 'VVVV');
      let localValue = value;
      let LocationArray = localValue?.split(',');
      // Check if only country is checked before
      const segments: string[] = localValue?.split(',');
      const extractedValues: number[] = segments
        .map(segment => segment.split('_'))
        .filter(parts => parts[1] === '0')
        .map(parts => parseInt(parts[0], 10));

      // Check if specific state only is checked before  
      const extractedStateValues: number[] = segments
        .map(segment => segment.split('_'))
        .filter(parts => parts[1] !== '0')
        .map(parts => parseInt(parts[1], 10));

      // console.log('extractedValues>>>', extractedValues, 'extractedStateValues>>>', extractedStateValues);

      // let filteredArray = LocationArray.map((v: any) => Number(v.replace(reLast, '')));
      // let filteredStateArray = LocationArray.map((v: any) => Number(v.replace(reFirst, '')));
      setSortByLocal(extractedValues);
      setSortByLocation(localValue);
      setSortByState(extractedStateValues);
      setTimeout(() => {
        if (document?.getElementById("country-state-selector_trigger")) {
          document?.getElementById("country-state-selector_trigger")?.getElementsByTagName("input")[0]?.setAttribute('placeholder', '');
        }
      }, 1000);
    }
  }

  // Prefilled selected values in edit report
  useEffect(() => {

    if (cartInfo) {
      if (id === '1') {
        setValue('stallionLocation', cartInfo[0].commonList ? cartInfo[0].commonList?.length > 1 ? cartInfo[0].commonList?.split(',')?.map((v: any) => (v)) : cartInfo[0].commonList : []);
        getPrefilledCountryStateValue();
      } else {
        setValue('stallionLocation', cartInfo[0].commonList ? cartInfo[0].commonList?.length > 1 ? cartInfo[0].commonList?.split(',')?.map((v: any) => Number(v)) : cartInfo[0].commonList : []);
      }
      setValue('salesLocation', cartInfo[0].commonList?.length ? cartInfo[0].commonList?.[0]?.split(',')?.map((v: any) => Number(v)) : []);
      if (localStorage.orderReports) {
        let arr = JSON.parse(localStorage.orderReports);
        arr.forEach((element: any) => {
          if (cartInfo[0].cartSessionId === element.cartSessionId) {
            setValue('fullName', element.fullName ? element.fullName : null);
            setValue('email', element.email ? element.email : null);
          }
        });
      }
      setMareSelected(cartInfo ? { mareName: cartInfo[0]?.mareName ? cartInfo[0]?.mareName : '', mareId: cartInfo[0]?.mareId ? cartInfo[0]?.mareId : '', countryCode: cartInfo[0]?.mareLocation ? cartInfo[0]?.mareLocation : '', yob: cartInfo[0]?.mareYob ? cartInfo[0]?.mareYob : '' } : { mareName: '', mareId: '', countryCode: '', yob: '' })
      setSelectStallion(cartInfo ? { horseName: cartInfo[0]?.stallionName ? cartInfo[0]?.stallionName : '', stallionId: cartInfo[0]?.stallionId ? cartInfo[0]?.stallionId : '' } : { horseName: '', stallionId: '' });

      if (cartInfo?.length) {
        if (formId !== "stallion_affinity_report_5") {
          setPreSelectedList([]);
          let arr: any = [];
          cartInfo?.forEach((element: any) => {
            let obj = { id: '', label: '', checked: true }
            if (element.stallionName) {
              obj.id = element.stallionId
              obj.label = element.stallionName
            } else {
              obj.id = element.mareId
              obj.label = element.mareName
            }
            arr.push(obj);
          });
          setPreSelectedList(arr);
        }
      }
      setCurrency(cartInfo[0].cartCurrencyId);
      if (cartInfo[0]?.selectedpriceRange) {
        let splitPrice = cartInfo[0]?.selectedpriceRange?.split('-');
        setPrice([Number(splitPrice[0]), Number(splitPrice[1])]);
        // console.log(splitPrice, 'called for splitPrice')
      }
      setIsIncludeRadioSelectedValue(cartInfo[0]?.isIncludePrivateFee);
    }
  }, [cartInfo, isProReportPriceSliderChanged])

  // Prefilled selected values in edit report
  useEffect(() => {
    if (cartInfo) {
      if (isProReportPriceSliderChanged) {
        let arr: any = [];
        stallionListInRange?.data?.forEach((element: any) => {
          let obj = { id: '', label: '', checked: true }
          obj.id = element.stallionId
          obj.label = element.horseName
          arr.push(obj);
        });
        setPreSelectedList(arr);
      }
      if (cartInfo[0]?.isIncludePrivateFee) {
        setIsProReportPriceSliderChanged(true);
      }
    }
  }, [cartInfo, isProReportPriceSliderChanged, stallionListInRangeFetching, isIncludeRadioSelectedValue])

  // Prefilled selected values in edit for sales report
  useEffect(() => {
    if (cartInfo) {
      if (cartInfo[0]?.sales) {
        if (formId === 'stallion_match_sales_report_4' || formId === 'stallion_breeding_stock_sale_7') {
          let selectedSalesArr: any = [];
          if (selectSaleList) {
            selectSaleList.forEach((element: any) => {
              cartInfo[0]?.sales.forEach((ele: any) => {
                if (element.saleId == ele.id) {
                  selectedSalesArr.push(element);
                }
              });
            });
          }
          setSaleListSelected(selectedSalesArr);

        }
      }
    }
  }, [selectSaleList])
  // console.log(formId,'formId')
  // Prefilled selected values in edit for sales report
  useEffect(() => {
    if (cartInfo) {
      if (formId === 'stallion_match_sales_report_4' || formId === 'stallion_breeding_stock_sale_7') {
        // if (cartInfo?.sales) {
        let selectedSalesArr: any = [];
        if (selectLotsList) {
          selectLotsList.forEach((element: any) => {
            cartInfo[0]?.lotNumber.forEach((ele: any) => {
              if (element.lotNumber == ele) {
                element.lotNumber = String(ele)
                selectedSalesArr.push(element);
              }
            });
          });
        }
        setSaleLotsSelected(selectedSalesArr);
      }
    }
  }, [selectLotsList])

  // Prefilled selected values in edit for stallion affinity report
  useEffect(() => {
    if (formId === "stallion_affinity_report_5") {
      if (user?.myFarms?.length > 0) {
        setFarms(user?.myFarms);
        let arr: any = [];
        if (user?.myFarms) {
          if (cartInfo) {
            cartInfo[0].commonList?.forEach((ele: any) => {
              let obj = { id: '', label: '', checked: true }
              obj.id = ele.farmId
              obj.label = ele.farmName
              arr.push(obj);
            });
          }
        }
        setPreSelectedList(arr);
      }
    }
  }, [user?.myFarms])

  // Set stallion location state based on selection
  useEffect(() => {
    if (watchStallionLocation !== undefined) {
      if (!isNaN(watchStallionLocation)) {
        setStallionLocationId(watchStallionLocation);
      }
    }
  }, [watchStallionLocation]);

  // Set sale location based on selection
  useEffect(() => {
    if (watchSaleLocation !== undefined) {
      if (watchSaleLocation?.length) {
        setSaleLocationId(watchSaleLocation);
      }
    }
  }, [watchSaleLocation]);

  // call the api based on price range change using debounce method
  const debouncedPrice = React.useRef(
    debounce(async (price) => {
      await setPriceParam(price);
    }, 1000)
  ).current;

  // call the api based on mare name typing using debounce method
  const debouncedMareName = React.useRef(
    debounce(async (mareName) => {
      // await setMareName(mareName);
      if (mareName.length >= 3 && isClearMare === 0) {
        setMareName(mareName);
        setIsMareSearch(true);
        refetchMare();
      } else {
        setIsMareSearch(false);
      }
    }, 1000)
  ).current


  //Reset the form on closing of the popup
  if (Object.keys(errors).length > 0 && Reset) {
    reset();
    setReset(false);
  }

  // Submit the report based on product id
  const SubmitOrderReport = async (reportData: any) => {
    let reportList = localStorage.getItem('orderReports');
    let reportListData = reportList && JSON.parse(reportList) || [];
    dispatch(setIsPaymentSucess(false))
    try {
      let withOutAuth = {}

      if (!user) {
        withOutAuth = {
          fullName: reportData.fullName,
          email: reportData.email,
        }
      }
      if (authentication) {
        if (user) {
          withOutAuth = {
            fullName: user.fullName,
            email: user.email,
          }
        }
      }
      // console.log(user,'withOutAuth')
      if (mareSelected) {
        reportData = { ...reportData, mareId: mareSelected.mareId, productId: parseInt(id) + 1, stallionId: "" }

      }
      if (selectedShortListedStallion.length > 0) {
        reportData = {
          ...reportData,
          items: [...selectedShortListedStallion],
          quantity: selectedShortListedStallion?.length * 1,
          price: selectedShortListedStallion.length * 25,
          currencyId: 1
        }
      }

      if (authentication) {

        if (formId === "broodmare_affinity_report_3") {
          let r_data: any = {
            ...withOutAuth,
            currencyId: reportCurrencyId,
            mareId: reportData.mareId,
            locations: reportData?.stallionLocation,
            ...(cartInfo && { cartId: cartInfo[0].cartSessionId }),
            ...(cartInfo && { price: cartInfo[0].price })
          }
          await postBroodmareReport(r_data).then(res => {
          })
          close();

        } else if (formId === "stallion_match_sales_report_4") {
          // console.log(selectedLotIds, 'selectedLotIds')
          let lotList: any = [];
          selectLotsList?.forEach((v: any) => {
            if (selectedLotIds?.includes(Number(v.lotNumber))) {
              lotList.push(Number(v.salesLotId))
            }
          })
          let oneLotPrice:any = 0;
          if (cartInfo) {
            oneLotPrice = (cartInfo[0].price / cartInfo[0].lotId?.length);
          }
          const m_data: any = {
            ...withOutAuth,
            currencyId: reportCurrencyId,
            location: saleLocationId,
            sales: selectedSaleListIds,
            lots: lotList,
            ...(cartInfo && { cartId: cartInfo[0].cartSessionId }),
            ...(cartInfo && { price: oneLotPrice }),
            // ...(cartInfo === undefined && { price: reportPrice*lotList.length })
          }
          await postMatchSaleSire(m_data).then(res => {
          })
          close();

        } else if (formId === "stallion_match_pro_2") {

          let s_match_data: any = {
            ...withOutAuth,
            currencyId: reportCurrencyId,
            // currencyId: currency,
            mareId: reportData.mareId,
            stallions: [...stallionsFeeRangeSelected],
            locations: reportData?.stallionLocation,
            selectedpriceRange: `${price[0]}-${price[1]}`,
            isIncludePrivateFee: isIncludeRadioSelectedValue,
            cartCurrencyId: currency,
            ...(cartInfo && { cartId: cartInfo[0].cartSessionId }),
            ...(cartInfo && { price: cartInfo[0].price })
          }
          await postMatchProReport(s_match_data).then(res => {
          })
          setIsViewEditStallionClicked(false);
          close();

        } else if (formId === "stallion_affinity_report_5") {

          let s_data: any = {
            ...withOutAuth,
            currencyId: reportCurrencyId,
            stallionId: selectStallion?.stallionId ? selectStallion?.stallionId : "",
            farms: isSingleFarm && radioSelectedValue == true ? [user?.myFarms?.[0]?.farmId] : [...selecteFarms],
            ...(cartInfo && { cartId: cartInfo[0].cartSessionId }),
            ...(cartInfo && { price: cartInfo[0].price })
          }
          await postStallionReport(s_data).then(res => {
          })
          close();

        } else if (formId === "stallion_dam_sire_report_6") {

          let sire_data: any = {
            ...withOutAuth,
            currencyId: reportCurrencyId,
            mareId: reportData.mareId,
            locations: reportData?.stallionLocation,
            ...(cartInfo && { cartId: cartInfo[0].cartSessionId }),
            ...(cartInfo && { price: cartInfo[0].price })
          }
          await postBroodMareSire(sire_data).then(res => {
          })
          close();

        } else if (formId === 'shortlist_report_1') {
          const shortlist_data = {
            ...withOutAuth,
            fullName: reportData.fullName,
            email: reportData.email,
            currencyId: reportCurrencyId,
            mareId: reportData.mareId,
            stallions: [...selectedShortListedStallion],
            ...(cartInfo && { cartId: cartInfo[0].cartSessionId }),
            ...(cartInfo && { price: cartInfo[0].price })
          }
          await postShortlistStallion(shortlist_data);
          close();
        } else if (formId === 'stallion_breeding_stock_sale_7') {
          // const [postStallionStockSales, uesStallionStockSalesResponse] = useAddToCartStallionStockSalesMutation();
          // const [postGuestStallionStockSales, uesGuestStallionStockSalesResponse]
          let lotList: any = [];
          selectLotsList?.forEach((v: any) => {
            if (selectedLotIds?.includes(Number(v.lotNumber))) {
              lotList.push(Number(v.salesLotId))
            }
          })
          let oneLotPrice:any = 0;
          if (cartInfo) {
            oneLotPrice = Number((cartInfo[0].price / cartInfo[0].lotId?.length)?.toFixed(2));
          }
          
          const m_data: any = {
            ...withOutAuth,
            currencyId: reportCurrencyId,
            stallionId: selectStallion?.stallionId ? selectStallion?.stallionId : "",
            location: saleLocationId,
            sales: selectedSaleListIds,
            lots: lotList,
            ...(cartInfo && { cartId: cartInfo[0].cartSessionId }),
            ...(cartInfo && { price: oneLotPrice })
          }
          await postStallionStockSales(m_data).then(res => {
          })
          close();
        } else {
          await postReport(reportData).then(res => {
          })
          close();
        }
        if (cartInfo) {
          toast.success('Report(s) Updated Successfully', {
            autoClose: 2000,
          });
        } else {
          toast.success('Report Added Successfully', {
            autoClose: 2000,
          });
        }
        reset();
      }
      else {

        let localStorageCardData: any = cartState;
        if (formId === 'stallion_breeding_stock_sale_7') {
          // const [postStallionStockSales, uesStallionStockSalesResponse] = useAddToCartStallionStockSalesMutation();
          // const [postGuestStallionStockSales, uesGuestStallionStockSalesResponse]

          let lotList: any = [];
          selectLotsList?.forEach((v: any) => {
            if (selectedLotIds?.includes(Number(v.lotNumber))) {
              lotList.push(Number(v.salesLotId))
            }
          })

          let oneLotPrice:any = 0;
          if (cartInfo) {
            oneLotPrice = Number((cartInfo[0].price / cartInfo[0].lotId?.length)?.toFixed(2));
          }

          const m_data: any = {
            ...withOutAuth,
            currencyId: reportCurrencyId,
            stallionId: selectStallion?.stallionId ? selectStallion?.stallionId : "",
            location: saleLocationId,
            sales: selectedSaleListIds,
            lots: lotList,
            productName: title + ' Report',
            currencyCode: currencyCode,
            ...(cartInfo === undefined && { price: Number(reportPrice) * selectedLotIds?.length }),
            ...(cartInfo && { price: cartInfo && oneLotPrice }),
            ...(cartInfo && { cartId: cartInfo[0].cartSessionId })
          }


          await postGuestStallionStockSales(m_data).then((res: any) => {
            localStorageCardData = {
              ...cartState,
              ...m_data,
              ...reportData,
              productId: 14,
              price: Number(reportPrice) * selectedLotIds.length,
              currencySymbol: reportCurrencySymbol,
              cartSessionId: res?.data?.cartSessionId
            }
          })
        } else if (formId === "broodmare_affinity_report_3") {
          let r_data: any = {
            ...withOutAuth,
            currencyId: reportCurrencyId,
            mareId: reportData?.mareId,
            locations: reportData?.stallionLocation,
            productName: title,
            currencyCode: currencyCode,
            ...(cartInfo === undefined && { price: cartPrice }),
            ...(cartInfo && { price: cartInfo && cartInfo[0]?.price }),
            ...(cartInfo && { cartId: cartInfo[0].cartSessionId })
          }


          await postGuestBroodMareAffinity(r_data).then((res: any) => {

            localStorageCardData = {
              ...cartState,
              ...r_data,
              ...reportData,
              price: reportPrice,
              currencySymbol: reportCurrencySymbol,
              cartSessionId: res?.data?.cartSessionId
            }
          })

        } else if (formId === "stallion_match_sales_report_4") {
          // console.log(selectedLotIds, 'selectedLotIds')
          let lotList: any = [];
          selectLotsList?.forEach((v: any) => {
            if (selectedLotIds?.includes(Number(v.lotNumber))) {
              lotList.push(Number(v.salesLotId))
            }
          })
          let oneLotPrice:any = 0;
          if (cartInfo) {
            oneLotPrice = (cartInfo[0].price / cartInfo[0].lotId?.length);
          }
          const m_data: any = {
            ...withOutAuth,
            currencyId: reportCurrencyId,
            location: saleLocationId,
            sales: selectedSaleListIds,
            lots: lotList,
            productName: title,
            currencyCode: currencyCode,
            ...(cartInfo === undefined && { price: Number(reportPrice) * selectedLotIds?.length }),
            ...(cartInfo && { price: cartInfo && oneLotPrice }),
            ...(cartInfo && { cartId: cartInfo[0].cartSessionId })
          }


          await postGuestMatchSales(m_data).then((res: any) => {
            localStorageCardData = {
              ...cartState,
              ...m_data,
              ...reportData,
              productId: 4,
              price: cartInfo === undefined ? Number(reportPrice) * selectedLotIds.length : oneLotPrice*selectedLotIds?.length ,
              currencySymbol: reportCurrencySymbol,
              cartSessionId: res?.data?.cartSessionId
            }
          })

        } else if (formId === "stallion_match_pro_2") {

          let s_match_data: any = {
            ...withOutAuth,
            currencyId: reportCurrencyId,
            // currencyId: currency,
            mareId: reportData.mareId,
            stallions: [...stallionsFeeRangeSelected],
            locations: reportData?.stallionLocation,
            productName: title,
            currencyCode: currencyCode,
            selectedpriceRange: `${price[0]}-${price[1]}`,
            isIncludePrivateFee: isIncludeRadioSelectedValue,
            cartCurrencyId: currency,
            ...(cartInfo === undefined && { price: cartPrice }),
            ...(cartInfo && { price: cartInfo && cartInfo[0]?.price }),
            ...(cartInfo && { cartId: cartInfo[0].cartSessionId })
          }

          await postGuestMatchPro(s_match_data).then((res: any) => {
            localStorageCardData = {
              ...cartState,
              ...s_match_data,
              ...reportData,
              ...(cartInfo === undefined && { price: reportPrice }),
              currencySymbol: reportCurrencySymbol,
              cartSessionId: res?.data?.cartSessionId
            }
          })
          setIsViewEditStallionClicked(false);

        } else if (formId === "stallion_affinity_report_5") {
          let s_data: any = {
            ...withOutAuth,
            currencyId: reportCurrencyId,
            stallionId: selectStallion?.stallionId ? selectStallion?.stallionId : "",
            farms: isSingleFarm && radioSelectedValue == true ? [user?.myFarms?.[0]?.farmId] : [...selecteFarms],
            productName: title,
            currencyCode: currencyCode,
            ...(cartInfo === undefined && { price: cartPrice }),
            ...(cartInfo && { price: cartInfo && cartInfo[0]?.price }),
            ...(cartInfo && { cartId: cartInfo[0].cartSessionId })
          }


          await postGuestStaliionAffinity(s_data).then((res: any) => {
            localStorageCardData = {
              ...cartState,
              ...s_data,
              ...reportData,
              price: reportPrice,
              productId: 5,
              currencySymbol: reportCurrencySymbol,
              cartSessionId: res?.data?.cartSessionId
            }
          })

        } else if (formId === "stallion_dam_sire_report_6") {

          let sire_data: any = {
            ...withOutAuth,
            currencyId: reportCurrencyId,
            mareId: reportData.mareId,
            locations: reportData?.stallionLocation,
            productName: title,
            currencyCode: currencyCode,
            ...(cartInfo === undefined && { price: cartPrice }),
            ...(cartInfo && { price: cartInfo && cartInfo[0]?.price }),
            ...(cartInfo && { cartId: cartInfo[0].cartSessionId })
          }


          await postGuestBroodMareSire(sire_data).then((res: any) => {
            localStorageCardData = {
              ...cartState,
              ...sire_data,
              ...reportData,
              price: reportPrice,
              currencySymbol: reportCurrencySymbol,
              cartSessionId: res?.data?.cartSessionId
            }
          })

        } else {

          const shortlist_data = {
            fullName: reportData.fullName,
            email: reportData.email,
            currencyId: reportCurrencyId,
            mareId: reportData.mareId,
            stallions: [...selectedShortListedStallion],
            productName: title,
            currencyCode: currencyCode,
            currencySymbol: reportCurrencySymbol,
            ...(cartInfo === undefined && { price: cartPrice }),
            ...(cartInfo && { price: cartInfo && cartInfo[0]?.price }),
            ...(cartInfo && { cartId: cartInfo[0].cartSessionId })
          }


          await postGuestShortListStallion(shortlist_data).then((res: any) => {
            localStorageCardData = {
              ...cartState,
              ...shortlist_data,
              ...reportData,
              cartSessionId: res?.data?.cartSessionId,

            }
          })

        }
        reset();
        if (localStorageCardData?.cartSessionId === undefined) {
          toast.error('Cart not exist!', {
            autoClose: 2000,
          });
        } else {
          close();
          let dataList: any = [];
          if (cartInfo) {
            let rrDuplicateList: any = [];
            let arr = JSON.parse(JSON.stringify(reportListData));
            rrDuplicateList = arr?.filter((v: any) => v?.cartSessionId !== cartInfo[0].cartSessionId);
            dataList = rrDuplicateList.concat([localStorageCardData])
          } else {
            dataList = reportListData.concat([localStorageCardData]);
          }

          dispatch(addToReportCart(dataList))
          localStorage.setItem("orderReports", JSON.stringify(dataList))

          let previousCartItems: any = window.sessionStorage.getItem('cartItems');
          if (typeof (previousCartItems) === 'string') {
            previousCartItems = JSON.parse(previousCartItems);
            window.sessionStorage.setItem('sessionCartItem', JSON.stringify([...previousCartItems, reportData]));
          }
          window.sessionStorage.setItem('sessionCartItem', JSON.stringify([reportData]))
          if (cartInfo) {
            toast.success('Report(s) Updated Successfully', {
              autoClose: 2000,
            });
          } else {
            toast.success('Report Added Successfully', {
              autoClose: 2000,
            });
          }
        }

      }
    } catch (error) {
      console.error(error);
    }
  };

  // update email popup
  const change = () => {
    reset();
    close();
    updateEmail();
  };

  // go to terms and condition page
  const goToTerms = () => {
    close();
    reset();
    window.open(ROUTES.TERMS_AND_CONDITIONS, '_blank');
  };

  let stallionListViewEditData: any = [];
  const [stallionsFeeRangeSelected, setStallionsFeeRangeSelected] = useState<any>(stallionListViewEditData);

  // Prefilled selected values in edit for match pro report
  useEffect(() => {
    if (stallionListInRangeSuccess) {
      let idsList: any = [];
      if (cartInfo) {
        if (isProReportPriceSliderChanged) {
          stallionListInRange?.data?.forEach((stallion: any) => {
            idsList.push(stallion.stallionId);
          })
        } else {
          preSelectedList?.forEach((stallion: any) => {
            idsList.push(stallion.id);
          })
        }
      } else {
        stallionListInRange?.data?.forEach((stallion: any) => {
          idsList.push(stallion.stallionId);
        })
      }
      setStallionsFeeRangeSelected(idsList)

    }
  }, [stallionListInRangeFetching, isProReportPriceSliderChanged])

  // Set analyized list of stallion 
  if (stallionListInRange?.data) {

    stallionListInRange?.data?.forEach((stallion: any) => {
      const data = {
        stallionId: stallion?.stallionId,
        horseName: stallion?.horseName,
        farmName: stallion?.farmName,
      }
      stallionListViewEditData?.push(data);
    })
  }

  // console.log(isViewEditStallionClicked,'isViewEditStallionClicked')
  // Set IsViewEditStallionClicked to true if we change location 
  useEffect(() => {
    if (watch('stallionLocation')) {
      if (id !== '1') {
        setIsViewEditStallionClicked(true)
      } else {
        setIsViewEditStallionClicked(false)
      }
      // if(filterEditCounterhook.value === 1) {
      //   setIsProReportPriceSliderChanged(true);
      // }
    }
  }, [watch('stallionLocation')])


  // setStallionsFeeRangeSelected(idsList);

  const saleList = [
    { id: 1, saleName: "2022 Magic Millions Yearling Sale" },
    { id: 2, saleName: "2022 Inglis Easter Yearling Sale" },
    { id: 3, saleName: "2021 Keeneland Sprinter Sale" },
    { id: 4, saleName: "2020 Arqana Broodmare Sale" },
    { id: 5, saleName: "2018 Inglis Broodmare Sale" },
    { id: 6, saleName: "2017 National Weanling Sale Draft" }
  ]

  const lots = [
    { id: 1, lotsValue: "1" },
    { id: 2, lotsValue: "2" },
    { id: 3, lotsValue: "3" },
    { id: 4, lotsValue: "4" },
    { id: 5, lotsValue: "5" },
    { id: 6, lotsValue: "6" }
  ];

  // On select lots selection
  const setInputValueLots = (event: any) => {
    const searchKey = event.target.value;
    if (searchKey?.length >= 1) {
      const filteredData = lots?.filter((lotsData: any) =>
        lotsData?.lotsValue?.toLowerCase().includes(searchKey.toLowerCase())
      );
      setSaleLotsSelected(filteredData);
    }
  };

  // On sales lots selection
  const setInputValue = (event: any) => {
    const searchKey = event?.target?.value;
    if (searchKey?.length >= 3) {
      const filteredData = saleList?.filter((sale: any) =>
        sale?.saleName.toLowerCase().includes(searchKey.toLowerCase())
      );
      setSaleListSelected(filteredData);
    }
  };

  const ITEM_HEIGHT = 32;
  const ITEM_PADDING_TOP = 8;
  const MenuPropss = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        boxShadow: 'none',
        marginTop: '-2px',
        marginRight: '2px',
        border: 'solid 1px #161716',
        borderRadius: '0 0 6px 6px',
        boxSizing: 'border-box',
      },
    },

  }

  const locationProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        boxShadow: 'none',
        marginTop: '-2px',
        marginRight: '2px',
        border: 'solid 1px #161716',
        borderRadius: '0 0 6px 6px',
        boxSizing: 'border-box',
      },
    },
  }
  const [isMareSearch, setIsMareSearch] = useState(false);
  const mareNameData: any = {
    mareName: mareName
  }

  const { data: mareNamesList, isLoading: mareListIsLoading, isFetching: mareListIsFetching, refetch: refetchMare } = useSearchMareNamesQuery(mareNameData, { skip: !mareNameData.mareName });

  let mareOptionList = mareName !== '' ? mareNamesList : [];

  // Call api on after typing 3 letters
  const handleMareInput = (e: any) => {
    setIsClearMare(0);
    if (e?.target?.value && e?.target?.value?.length >= 3 && isClearMare === 0) {
      // setMareName(e?.target?.value);
      debouncedMareName(e.target.value);
    }
  };

  // Validate form
  const IsSubmitDisabled = (id: string) => {

    switch (id) {
      case "0":
        if (!mareSelected?.mareId || selectedShortListedStallion.length === 0) {
          return true
        } else {
          if (authentication === false) {
            if (watch('fullName') === undefined || watch('email') === undefined || !watch('fullName') || !watch('email')) {
              return true;
            }
          }
        }
        return false;
      case "1":
        if (!mareSelected?.mareId || getValues('stallionLocation') === undefined) {
          return true;

        } else {
          if (authentication === false) {
            if (watch('fullName') === undefined || watch('email') === undefined || !watch('fullName') || !watch('email')) {
              return true;
            }
          }
        }
        if (cartInfo && preSelectedList.length === 0) {
          return true;
        }
        if (cartInfo === undefined && stallionsFeeRangeSelected.length === 0) {
          return true;
        }
        return false;
      case "2":
        if (!mareSelected?.mareId || getValues('stallionLocation') === undefined) {
          return true
        } else {
          if (authentication === false) {
            if (watch('fullName') === undefined || watch('email') === undefined || !watch('fullName') || !watch('email')) {
              return true;
            }
          }
        }
        return false;
      case "3":
        if (getValues('salesLocation') === undefined || selectedSaleListIds.length === 0 || selectedLotIds.length === 0) {
          return true
        } else {
          if (authentication === false) {
            if (watch('fullName') === undefined || watch('email') === undefined || !watch('fullName') || !watch('email')) {
              return true;
            }
          }
        }
        return false;
      case "4":
        if (!selectStallion?.stallionId) {
          return true
        } else {
          if (authentication === false) {
            if (watch('fullName') === undefined || watch('email') === undefined || !watch('fullName') || !watch('email')) {
              return true;
            }
          }
        }
        return false;
      case "5":
        if (!mareSelected?.mareId || getValues('stallionLocation') === undefined) {
          return true
        } else {
          if (authentication === false) {
            if (watch('fullName') === undefined || watch('email') === undefined || !watch('fullName') || !watch('email')) {
              return true;
            }
          }
        }
        return false;
      case "6":
        if (getValues('salesLocation') === undefined || selectedSaleListIds.length === 0 || selectedLotIds.length === 0 || !selectStallion?.stallionId) {
          return true
        } else {
          if (authentication === false) {
            if (watch('fullName') === undefined || watch('email') === undefined || !watch('fullName') || !watch('email')) {
              return true;
            }
          }
        }
        return false;
        break;
    }
  }
  // console.log(selectStallion,getValues('salesLocation'),selectedSaleListIds,selectedLotIds, 'selectStallion')

  // Reset Form
  useEffect(() => {
    if (open) {
      if (id === '0') {
        setIsStalionFirst(true);
      }
    }
    if (!open) {
      setMareName('');
      setStallionName('');
      setPreSelectedList([]);
      reset();
      setReset(false);
      setselectedShortListedStallion([]);
      setSelectSaleList([]);
      setSelectLotsList([]);
      setSelectedFarms([]);
      setSaleListSelected([]);
      setSaleLotsSelected([]);
      setSaleLocationId('');
      close();
      setSelectStallion(null);
      setMareSelected(null);
      setReset(false);
      setIsProReportPriceSliderChanged(false);
      setIsViewEditStallionClicked(true);
    }
  }, [open])


  // Reset stallionSelectRef
  useEffect(() => {
    if (!open) return

  }, [stallionSelectRef.current])

  // const handlereset = () => {
  //   setMareName('');
  // }

  // Reset Mare field
  const handleMareOptionsReset = () => {
    setIsClearMare(1);
    setMareName('');
  }

  // Reset stallion field
  const handleStallionOptionsReset = () => {
    setIsClearStallion(1);
    setStallionName('');
  }

  // Reset create stallion field
  const handleCloseCreateStallion = () => {
    setOpenCreateStallionModal(false);
  };

  const getCountryListByComma = (selected: any) => {
    let arr: any = [];
    stallionStateList?.forEach((v: any) => {
      selected?.forEach((sel: any) => {
        if (v?.countryId === sel) {
          arr.push(v?.label);
        }
      })
    })
    return arr?.join(', ');
  }

  const saveOrderListToLocalStorage = (responseData: any) => {
    let localOrderList = JSON.parse(window.localStorage.getItem('orderReports') || '{}');
    const newArr = localOrderList?.map((list: any) => {
      if (list.cartSessionId === responseData?.data.cartId) {
        return {
          ...list,
          currencyCode: responseData?.data?.toCurrency,
          currencyId: responseData?.data?.currencyId,
          currencySymbol: responseData?.data?.currencySymbol,
          price: responseData?.data?.price,
        }
      } else {
        return {
          ...list,
        };
      }
    });
    window.localStorage.setItem('orderReports', JSON.stringify(newArr));
  }

  // Hide placeholder stallion select field
  useEffect(() => {
    // console.log('called123')
    if (!isStalionFirst) {
      let elems = document.getElementById('confrm_stln_match_pro_12')?.getElementsByClassName('tag')
      if (!elems) return
      // @ts-ignore
      for (let i = 0; i < elems.length - 1; i++) {
        // @ts-ignore
        elems[i].style.display = "none";
      }
    } else {
      if (!document.getElementById('confrm_stln_match_pro_12')) {
        return
      }
      if (document.getElementById('confrm_stln_match_pro_12')?.getElementsByTagName('li') && document.getElementById('confrm_stln_match_pro_12')?.getElementsByTagName('li').length) {
        let elems = document.getElementById('confrm_stln_match_pro_12')?.getElementsByTagName('li')
        // @ts-ignore
        for (let i = 0; i < elems.length - 1; i++) {
          // @ts-ignore
          elems[i].style.display = "none";
        }
        // @ts-ignore
        document.getElementById('confrm_stln_match_pro_12').getElementsByTagName('input')[0].click()
      }
      setTimeout(() => {
        setIsStalionFirst(false)
      }, 100);
    }

  }, [stallionListViewEditData, document.getElementById('confrm_stln_match_pro_12'), document.getElementById('confrm_stln_match_pro_12')?.getElementsByTagName('li')])

  // Hide placeholder stallion select field
  useEffect(() => {
    if (!isStalionFirst) {
      let elems = document.getElementById('confrm_stln_match_ShortList_0')?.getElementsByClassName('tag')
      if (!elems) return
      // @ts-ignore
      for (let i = 0; i <= elems.length - 1; i++) {
        // @ts-ignore
        elems[i].style.display = "none";
      }
    } else {
      if (!document.getElementById('confrm_stln_match_ShortList_0')) {
        return
      }
      if (document.getElementById('confrm_stln_match_ShortList_0')?.getElementsByTagName('li') && document.getElementById('confrm_stln_match_ShortList_0')?.getElementsByTagName('li').length) {
        let elems: any = document.getElementById('confrm_stln_match_ShortList_0')?.getElementsByTagName('li')
        // @ts-ignore
        for (let i = 0; i < elems?.length - 1; i++) {
          // @ts-ignore
          if (!(elems[i].childNodes[0].nodeName === 'INPUT')) {

            elems[i].style.display = "none";
          }
        }
        // @ts-ignore
        document.getElementById('confrm_stln_match_ShortList_0').getElementsByTagName('input')[0].click()
      }
      setTimeout(() => {
        setIsStalionFirst(false)
      }, 100);
    }

  }, [guestStallionlist, shortListedStallionsList, document.getElementById('confrm_stln_match_ShortList_0'), document.getElementById('confrm_stln_match_ShortList_0')?.getElementsByTagName('li')])

  useEffect(() => {
    if (ShortlistStallionResponse.isSuccess) {
      let userCurrencyId = callConversionCurrencyId();
      if (userCurrencyId) {
        if (reportCurrencyId !== userCurrencyId) {
          setTimeout(() => {
            getConvertedCurrencyList(
              {
                "currencyId": userCurrencyId,
                "cartList": [{ 'cartId': ShortlistStallionResponse?.data?.cartSessionId }]
              }
            )
          }, 500);
        }
      }
    }
  }, [ShortlistStallionResponse.isSuccess])

  useEffect(() => {
    if (broodmareResponse.isSuccess) {
      let userCurrencyId = callConversionCurrencyId();
      if (userCurrencyId) {
        if (reportCurrencyId !== userCurrencyId) {
          setTimeout(() => {
            getConvertedCurrencyList(
              {
                "currencyId": userCurrencyId,
                "cartList": [{ 'cartId': broodmareResponse?.data?.cartSessionId }]
              }
            )
          }, 500);
        }
      }
    }
  }, [broodmareResponse.isSuccess])

  useEffect(() => {
    if (matchProResponse.isSuccess) {
      let userCurrencyId = callConversionCurrencyId();
      if (userCurrencyId) {
        if (reportCurrencyId !== userCurrencyId) {
          setTimeout(() => {
            getConvertedCurrencyList(
              {
                "currencyId": userCurrencyId,
                "cartList": [{ 'cartId': matchProResponse?.data?.cartSessionId }]
              }
            )
          }, 500);
        }
      }
    }
  }, [matchProResponse.isSuccess])

  useEffect(() => {
    if (stallionResponse.isSuccess) {
      let userCurrencyId = callConversionCurrencyId();
      if (userCurrencyId) {
        if (reportCurrencyId !== userCurrencyId) {
          setTimeout(() => {
            getConvertedCurrencyList(
              {
                "currencyId": userCurrencyId,
                "cartList": [{ 'cartId': stallionResponse?.data?.cartSessionId }]
              }
            )
          }, 500);
        }
      }
    }
  }, [stallionResponse.isSuccess])

  useEffect(() => {
    if (broodMareSireResponse.isSuccess) {
      let userCurrencyId = callConversionCurrencyId();
      if (userCurrencyId) {
        if (reportCurrencyId !== userCurrencyId) {
          setTimeout(() => {
            getConvertedCurrencyList(
              {
                "currencyId": userCurrencyId,
                "cartList": [{ 'cartId': broodMareSireResponse?.data?.cartSessionId }]
              }
            )
          }, 500);
        }
      }
    }
  }, [broodMareSireResponse.isSuccess])

  useEffect(() => {
    if (matchSaleResponse.isSuccess) {
      let userCurrencyId = callConversionCurrencyId();
      if (userCurrencyId) {
        if (reportCurrencyId !== userCurrencyId) {
          setTimeout(() => {
            getConvertedCurrencyList(
              {
                "currencyId": userCurrencyId,
                "cartList": [{ 'cartId': matchSaleResponse?.data?.cartSessionId }]
              }
            )
          }, 500);
        }
      }
    }
  }, [matchSaleResponse.isSuccess])

  // Call conversion api for unregistered users
  useEffect(() => {
    if (guestbroodMareAffinityResponse.isSuccess) {
      let userCurrencyId = callConversionCurrencyId();
      const getUsers = async () => {
        const callConversionResponse: any = await getConvertedCurrencyList(
          {
            "currencyId": userCurrencyId,
            "cartList": [{ 'cartId': guestbroodMareAffinityResponse?.data?.cartSessionId }]
          }
        )
        setTimeout(() => {
          if (callConversionResponse) {
            saveOrderListToLocalStorage(callConversionResponse);
          }
        }, 500);
      }

      if (userCurrencyId) {
        if (reportCurrencyId !== userCurrencyId) {
          getUsers()
        }
      };
    }
  }, [guestbroodMareAffinityResponse.isSuccess])

  useEffect(() => {
    if (guestShortListStallionResponse.isSuccess) {
      let userCurrencyId = callConversionCurrencyId();
      const getUsers = async () => {
        const callConversionResponse: any = await getConvertedCurrencyList(
          {
            "currencyId": userCurrencyId,
            "cartList": [{ 'cartId': guestShortListStallionResponse?.data?.cartSessionId }]
          }
        )
        setTimeout(() => {
          if (callConversionResponse) {
            saveOrderListToLocalStorage(callConversionResponse);
          }
        }, 500);
      }

      if (userCurrencyId) {
        if (reportCurrencyId !== userCurrencyId) {
          getUsers()
        }
      };
    }
  }, [guestShortListStallionResponse.isSuccess])

  useEffect(() => {
    if (guestBroodMareSireResponse.isSuccess) {
      let userCurrencyId = callConversionCurrencyId();
      const getUsers = async () => {
        const callConversionResponse: any = await getConvertedCurrencyList(
          {
            "currencyId": userCurrencyId,
            "cartList": [{ 'cartId': guestBroodMareSireResponse?.data?.cartSessionId }]
          }
        )
        setTimeout(() => {
          if (callConversionResponse) {
            saveOrderListToLocalStorage(callConversionResponse);
          }
        }, 500);
      }

      if (userCurrencyId) {
        if (reportCurrencyId !== userCurrencyId) {
          getUsers()
        }
      };
    }
  }, [guestBroodMareSireResponse.isSuccess])

  useEffect(() => {
    if (guestMatchProResponse.isSuccess) {
      let userCurrencyId = callConversionCurrencyId();
      const getUsers = async () => {
        const callConversionResponse: any = await getConvertedCurrencyList(
          {
            "currencyId": userCurrencyId,
            "cartList": [{ 'cartId': guestMatchProResponse?.data?.cartSessionId }]
          }
        )
        setTimeout(() => {
          if (callConversionResponse) {
            saveOrderListToLocalStorage(callConversionResponse);
          }
        }, 500);
      }

      if (userCurrencyId) {
        if (reportCurrencyId !== userCurrencyId) {
          getUsers()
        }
      };
    }
  }, [guestMatchProResponse.isSuccess])

  useEffect(() => {
    if (uestStaliionAffinityResponse.isSuccess) {
      let userCurrencyId = callConversionCurrencyId();
      const getUsers = async () => {
        const callConversionResponse: any = await getConvertedCurrencyList(
          {
            "currencyId": userCurrencyId,
            "cartList": [{ 'cartId': uestStaliionAffinityResponse?.data?.cartSessionId }]
          }
        )
        setTimeout(() => {
          if (callConversionResponse) {
            saveOrderListToLocalStorage(callConversionResponse);
          }
        }, 500);
      }

      if (userCurrencyId) {
        if (reportCurrencyId !== userCurrencyId) {
          getUsers()
        }
      };
    }
  }, [uestStaliionAffinityResponse.isSuccess])

  useEffect(() => {
    if (uestMatchSalesResponse.isSuccess) {
      let userCurrencyId = callConversionCurrencyId();
      const getUsers = async () => {
        const callConversionResponse: any = await getConvertedCurrencyList(
          {
            "currencyId": userCurrencyId,
            "cartList": [{ 'cartId': uestMatchSalesResponse?.data?.cartSessionId }]
          }
        )
        setTimeout(() => {
          if (callConversionResponse) {
            saveOrderListToLocalStorage(callConversionResponse);
          }
        }, 500);
      }

      if (userCurrencyId) {
        if (reportCurrencyId !== userCurrencyId) {
          getUsers()
        }
      };
    }
  }, [uestMatchSalesResponse.isSuccess])

  // const [postStallionStockSales, uesStallionStockSalesResponse] = useAddToCartStallionStockSalesMutation();
  // const [postGuestStallionStockSales, uesGuestStallionStockSalesResponse]
  useEffect(() => {
    if (uesStallionStockSalesResponse.isSuccess) {
      let userCurrencyId = callConversionCurrencyId();
      const getUsers = async () => {
        const callConversionResponse: any = await getConvertedCurrencyList(
          {
            "currencyId": userCurrencyId,
            "cartList": [{ 'cartId': uesStallionStockSalesResponse?.data?.cartSessionId }]
          }
        )
        setTimeout(() => {
          if (callConversionResponse) {
            saveOrderListToLocalStorage(callConversionResponse);
          }
        }, 500);
      }

      if (userCurrencyId) {
        if (reportCurrencyId !== userCurrencyId) {
          getUsers()
        }
      };
    }
  }, [uesStallionStockSalesResponse.isSuccess])

  useEffect(() => {
    if (uesGuestStallionStockSalesResponse.isSuccess) {
      let userCurrencyId = callConversionCurrencyId();
      const getUsers = async () => {
        const callConversionResponse: any = await getConvertedCurrencyList(
          {
            "currencyId": userCurrencyId,
            "cartList": [{ 'cartId': uesGuestStallionStockSalesResponse?.data?.cartSessionId }]
          }
        )
        setTimeout(() => {
          if (callConversionResponse) {
            saveOrderListToLocalStorage(callConversionResponse);
          }
        }, 500);
      }

      if (userCurrencyId) {
        if (reportCurrencyId !== userCurrencyId) {
          getUsers()
        }
      };
    }
  }, [uesGuestStallionStockSalesResponse.isSuccess])

  useEffect(() => {

    let countrydata: any = [];

    // stallionStateList?.map((record: any, key: number) => {

    //   const children = record.children?.map((child: any) => ({
    //     ...child,
    //     checked: false,
    //   }));

    //   countrydata.push({
    //     countryId: record.countryId,
    //     label: record.label,
    //     countryCode: record.countryCode,
    //     checked: false,
    //     children: children,
    //   });
    // });
    stallionStateList?.map((record: any, key: number) => {

      const children = record.children?.map((child: any) => ({
        ...child,
        checked: sortByState ? sortByState?.includes(child.stateId) ? true : sortByLocal ? sortByLocal?.includes(child.countryId) ? true : false : false : false,
      }));

      countrydata.push({
        countryId: record.countryId,
        label: record.label,
        countryCode: record.countryCode,
        checked: sortByLocal ? sortByLocal?.includes(record.countryId) ? true : false : false,
        children: sortByState ? children : record?.children,
      });
    });
    // console.log(countrydata, stallionStateList, 'countrydata')
    // treeDropdownRef.current.searchInput.setAttribute("placeholder", '');
    setCountryList(countrydata);

    // if (query.get('location') || sortByLocal?.length) {
    //   props.setLocation(query.get('location') + '_0');
    //   if (sortByLocal?.length) {
    //     props.setLocation(sortByLocation?.location);
    //   }
    //   props.setPage(1);
    //   props.query.refetch();
    //   if (query.get('location') || sortByLocal?.length) {
    //     props.filterCounterhook.reset();
    //     props.filterCounterhook.increment();
    //   }
    // }
    // setTimeout(() => {
    //   if (query.get('location') || sortByLocal?.length) {
    //     setHasSelectedList(true);
    //     treeDropdownRef.current.searchInput.setAttribute("placeholder", query.get('location') ? '' : 'Location');
    //     treeDropdownRef.current.searchInput.setAttribute('style', 'display:none');
    //   } else {
    //     treeDropdownRef.current.searchInput.setAttribute('style', 'display:block');
    //     treeDropdownRef.current.searchInput.setAttribute("placeholder", query.get('location') ? '' : 'Location');
    //     props.filterCounterhook.decrement();
    //   }
    // }, 250);

  }, [stallionStateList, stallionStateFetching, sortByLocal]);

  const searchPredicate = (node: any, searchTerm: any) => {

    return node.label && node.label.toLowerCase().startsWith(searchTerm)

  }

  const onChange = async (currentNode: any, selectedNodes: any) => {
    const selectedLocation = await selectedNodes.map((res: any) =>
      res.stateId ? `${res.countryId}_${res.stateId}` : `${res.countryId}_0`

    );
    // console.log('selectedNodes>>>', selectedLocation.join('|'))
    setLocationList(selectedNodes.length);
    setValue('stallionLocation', selectedLocation?.length ? selectedLocation : selectedLocation)
    // console.log(selectedLocation, 'selectedLocation');
    // props.setLocation(selectedLocation.join('|'));
    // props.setPage(1);
    // props.query.refetch();

    if (selectedLocation.length > 0) {
      treeDropdownRef.current.searchInput.setAttribute("placeholder", selectedNodes.length > 0 ? '' : 'Location');
      treeDropdownRef.current.searchInput.setAttribute('style', 'display:none');
    } else {
      treeDropdownRef.current.searchInput.setAttribute('style', 'display:block');
      treeDropdownRef.current.searchInput.setAttribute("placeholder", selectedNodes.length > 0 ? '' : 'Location');
    }
  };

  const onFocus = async () => {
    treeDropdownRef.current.searchInput.setAttribute('style', 'display:block');
  }

  const DropDownTreeSelect = useMemo(() => {
    return (
      <Box className="SDmultiselect CountrySDmultiselect">
        <DropdownTreeSelect
          data={countryList || []}
          className={'mdl-demo'}
          // className={'mdl-demo ' + (hasLocation ? ' search-hidden' : '')}
          onChange={onChange}
          onFocus={onFocus}
          texts={{ placeholder: 'Location' }}
          ref={treeDropdownRef}
          searchPredicate={searchPredicate}
          id={'country-state-selector'}
        />
      </Box>
    );
  }, [countryList]);
  // console.log(watch('stallionLocation'),'stallionLocation')

  return (
    <StyledEngineProvider injectFirst>
      {/* Form to submit all report */}
      <form onSubmit={handleSubmit(SubmitOrderReport)} className="reportModalForm" id={formId} >
        {id === '0' && (
          <Box className="shortlistreport-head">
            Please enter the details below to complete your Shortlist Stallion Match report. This
            report will run an analysis between your mare and each stallion in your shortlist.
            Please checkout to prevent any delays to your order.
          </Box>
        )}
        {!authentication && (
          <Box>
            <InputLabel>Your Name</InputLabel>
            <TextField
              fullWidth
              type="text"
              autoComplete="new-password"
              {...register('fullName', { required: true })}
              defaultValue={getValues('fullName') ? getValues('fullName') : ''}
              placeholder="Enter Full Name"
            />
            <p>{errors.fullName?.message}</p>

            <Box className="updateEmailPopup" sx={{ display: 'flex' }}>
              <InputLabel>Your Email</InputLabel>
            </Box>
            <TextField
              fullWidth
              type="text"
              autoComplete="new-password"
              {...register('email', { required: true })}
              defaultValue={getValues('email') ? getValues('email') : ''}
              placeholder="Enter Email"
              className="custfield"
            />
            <p>{errors.email?.message}</p>
          </Box>
        )}
        {authentication && user && !viewStallionsAnalysed && (
          <Box className="reportpop-name">
            <Box className='reportFullname'>{user?.fullName}</Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box className='reportEmail'>{user?.email}</Box>
              {false && <Button className="popup-btn changebtn" onClick={change}>
                change
              </Button>}
            </Box>
          </Box>
        )}

        {(id === '2' || id === '5') && (
          <Box className="search-stallion-pop-box reportPopup">
            <InputLabel>Your Mare</InputLabel>
            <Box className="search-stallion-pop-box-inner mareSelectPopup">
              <Autocomplete
                disablePortal
                popupIcon={<KeyboardArrowDownRoundedIcon />}
                id="checkboxes-tags-demo"
                options={mareOptionList || []}
                onInputChange={handleMareInput}
                sx={{ margin: '0px', padding: '0px' }}
                getOptionLabel={(option: any) => `${toPascalCase(option?.mareName)?.toString()} (${option.countryCode}) ${option.yob} `}
                onChange={(e, selectedOptions: any) => {
                  setMareSelected(selectedOptions);
                  setCartState({ ...cartState, ...selectedOptions })
                }}
                value={mareSelected}
                // renderOption={(props, option: any) => (
                //   <li className='searchstallionListBox'{...props}>
                //     <span className='stallionListBoxName'>{toPascalCase(option.mareName)} ({option.countryCode}) {option.yob}</span>
                //   </li>
                // )}
                renderOption={(props, option: any) => (
                  <React.Fragment key={option?.mareId}>
                    <li className={`${mareOptionList[mareOptionList?.length - 1]?.mareId === option?.mareId ? 'floting-btn' : 'hide'}`}>
                      <Box className="submit-new-bg">
                        <Button
                          variant="text"
                          className="lr-btn lr-btn-outline"
                          color="primary"
                          type="button"
                          onClick={() => setOpenCreateStallionModal(true)}
                        >
                          Submit a new Mare
                        </Button>
                      </Box>
                    </li>
                    <li className="searchstallionListBox" {...props}>
                      <Stack className="stallionListBoxHead">
                        {toPascalCase(option.mareName)} ({option.yob},{' '}
                        <span>{option.countryCode}</span>)
                      </Stack>
                      <Stack className="stallionListBoxpara">
                        <strong>X</strong>
                        <p style={{ marginBottom: '0px' }}>
                          {toPascalCase(option.sireName)} ({option.sireYob},{' '}
                          <span>{option.sireCountryCode}</span>),{' '}{toPascalCase(option.damName)} (
                          {option.damYob}, <span>{option.damCountryCode}</span>)
                        </p>
                      </Stack>
                    </li>

                  </React.Fragment>
                )}
                // style={ { width: 100% } }
                renderInput={(params: any) => (
                  <TextField {...params} placeholder={'Enter Mare Name'} />
                )}
                // clearIcon={<div onClick={handlereset}><CloseRoundedIcon className='cross-icon' /></div>}
                onBlur={handleMareOptionsReset}
                noOptionsText={
                  mareName != '' &&
                  (
                    <Box className="search-couldnot d-flex align-items-center justify-content-between mt-2 scroll-submit-stallion-wrp">
                      <span className="fw-bold sorry-message">
                        {mareListIsFetching ? 'Loading...' : `Sorry, we couldn't find any matches for "${mareName}"`}
                      </span>
                      <Box className="submit-new-bg">
                        <Button
                          variant="text"
                          className="lr-btn lr-btn-outline"
                          color="primary"
                          type="button"
                          onClick={() => setOpenCreateStallionModal(true)}
                        >
                          Submit a new Mare
                        </Button>
                      </Box>
                    </Box>
                  )
                }
              // noOptionsText={mareName.length < 3 ? '' : mareListIsLoading ?  'Loading...' : 'Sorry could not find horses'}
              />
            </Box>
            <p></p>
            <InputLabel>
              Location of Stallions
              <HtmlTooltip
                enterTouchDelay={0}
                leaveTouchDelay={6000}
                className="CommonTooltip studfee-tooltip"
                placement="right-start"
                title={
                  <React.Fragment>
                    {/* <Typography color="inherit">Tooltip with HTML</Typography> */}
                    {'A deeper analysis will be run to determine the best stallion crossed with your broodmare sire based on location.'}{' '}

                    {/* {
                    'fee will remain confidential within our platform it’s users and will only be used internally for reporting'
                  } */}
                    {' '}
                  </React.Fragment>
                }
              >
                <i className="icon-Info-circle"></i>
              </HtmlTooltip>
            </InputLabel>
            <CustomSelect
              className="selectDropDownBox"
              disablePortal
              fullWidth
              sx={{ mb: '1rem' }}
              MenuProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: "top                                                                                                            ",
                  horizontal: "left"
                },
                ...MenuPropss
              }}
              IconComponent={KeyboardArrowDownRoundedIcon}
              defaultValue={'none'}
              multiple
              displayEmpty
              value={getValues('stallionLocation') ? getValues('stallionLocation') : []}
              // {...register('stallionLocation', { required: true })}
              onChange={(e: any) => setValue('stallionLocation', e.target.value)}
              renderValue={(selected: any) => {
                if (selected?.length === 0) {
                  return <em>Select Region</em>;
                }
                return <em>View Selected Regions</em>;

              }}
            >
              <MenuItem className="selectDropDownList mobileCountryList" value="none" disabled>
                <em>Select Region</em>
              </MenuItem>
              {/* {countriesList?.map(({ id, countryName }) => (
                <MenuItem className="selectDropDownList mobileCountryList" value={id} key={id}>
                  {countryName}
                </MenuItem>
              ))} */}
              {stallionStateList?.map((v: any) => (
                <MenuItem className="selectDropDownList mobileCountryList reportDropDownBox" value={v.countryId} key={v.countryId}>
                  {/* {v.label} */}
                  <ListItemText primary={v.label} />
                  {/* <Checkbox checked={getValues('stallionLocation')?.indexOf(v.countryId) > -1} /> */}
                  <Checkbox
                    checkedIcon={<img src={Images.checked} alt="checkbox" />} icon={<img src={Images.unchecked} alt="checkbox" />}
                    checked={getValues('stallionLocation')?.indexOf(v.countryId) > -1}
                    disableRipple
                  />
                </MenuItem>
              ))}
            </CustomSelect>
            {/* <Autocomplete
              disablePortal
              popupIcon={<KeyboardArrowDownRoundedIcon />}
              id="country-select-demo"
              sx={{ mt: '8px' }}
              options={countriesList || []}
              autoHighlight
              defaultValue={cartInfo ? countriesList?.filter((v:any,i) => getValues('stallionLocation') === v.id)[0] : null}
              getOptionLabel={(option: any) => `${!(option?.countryName?.split(' ')[0]?.length <= 2) && option?.countryName?.length > 3 ? toPascalCase(option?.countryName)?.toString() : option?.countryName?.toString()}`}
              onChange={ (event, newValue: any) => setValue('stallionLocation', newValue?.id)}
              renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                  {option.countryName}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    placeholder: 'Select Country',
                    autoComplete: 'new-password', // disable autocomplete and autofill
                  }}
                />
              )}
              filterOptions={(option: any, state: any) => {
                let optionList: any = [];
                optionList = option?.filter((v: any) => {
                  let countryFullname = v?.countryName?.toLowerCase();
                  let searchCountryName = state?.inputValue?.toLowerCase();
                  if (countryFullname?.startsWith(searchCountryName)) {
                    return true;
                  }
                  return false;
                })
                return optionList;
              }}
            /> */}
            <p />
          </Box>
        )}
        {id === '4' && (
          <>
            <Box className="search-stallion-pop-box reportPopup ">
              <InputLabel>Enter Stallion</InputLabel>
              <Box className="search-stallion-pop-box-inner stallionReportPopup">
                {/* <Autocomplete
                disablePortal
                popupIcon={<KeyboardArrowDownRoundedIcon />}
                id="checkboxes-tags-demo"
                options={selectStallionList || []}
                onInputChange={handleMareInput}
                sx={{ margin: '0px', padding: '0px' }}
                getOptionLabel={(option: any) => `${toPascalCase(option?.horseName)?.toString()}`}
                onChange={(e, selectedOptions: any) => {
                  setSelectStallion(selectedOptions);
                }}
                value={selectStallion}
                renderOption={(props, option: any) => (
                  <li className='searchstallionListBox'{...props}>
                    <span className='stallionListBoxName'>{toPascalCase(option.horseName)}</span>
                  </li>
                )}
                renderInput={(params: any) => (
                  <TextField {...params} placeholder={'Enter Stallion Name'} />
                )}
                onBlur={handleStallionOptionsReset}
              /> */}
                <Autocomplete
                  disablePortal
                  // noOptionsText={stallionNameEnter.length < 3 ? '' : stallionFetching ? 'Loading...' : 'Sorry could not find stallion'}
                  noOptionsText={
                    stallionNameEnter != '' &&
                    isClearStallion === 0 && (
                      <Box className="search-couldnot d-flex align-items-center justify-content-between mt-2 scroll-submit-stallion-wrp">
                        <span className="fw-bold sorry-message">
                          {stallionFetching ? 'Loading...' : `Sorry, we couldn't find any matches for "${stallionNameEnter}"`}
                        </span>
                        <Box className="submit-new-bg">
                          <Button
                            variant="text"
                            className="lr-btn lr-btn-outline"
                            color="primary"
                            type="button"
                            onClick={() => setOpenCreateStallionModal(true)}
                          >
                            Submit a new Stallion
                          </Button>
                        </Box>
                      </Box>
                    )
                  }
                  popupIcon={<KeyboardArrowDownRoundedIcon />}
                  id="checkboxes-tags-demo"
                  options={stallionOptionList || []}
                  onInputChange={handleStallionInput}
                  sx={{ margin: '0px', padding: '0px' }}
                  getOptionLabel={(option: any) => `${toPascalCase(option?.horseName)?.toString()}`}
                  onChange={(e, selectedOptions: any) => {
                    setSelectStallion(selectedOptions);
                  }}
                  value={selectStallion}
                  renderOption={(props, option: any) => (
                    // <li className='searchstallionListBox'{...props}>
                    //   <span className='stallionListBoxName'>{toPascalCase(option.horseName)}</span>
                    // </li>
                    <>
                      <li className={`${stallionOptionList[stallionOptionList?.length - 1]?.stallionId === option?.stallionId ? 'floting-btn' : 'hide'}`}>
                        <Box className="submit-new-bg">
                          <Button
                            variant="text"
                            className="lr-btn lr-btn-outline"
                            color="primary"
                            type="button"
                            onClick={() => setOpenCreateStallionModal(true)}
                          >
                            Submit a new Stallion
                          </Button>
                        </Box>
                      </li>
                      <li className="searchstallionListBox" {...props}>
                        <Stack className="stallionListBoxHead">
                          {toPascalCase(option.horseName)} ({option.yob},{' '}
                          <span>{option.countryCode}</span>){' '} {'-'} {option?.farmName}
                        </Stack>
                        <Stack className="stallionListBoxpara">
                          <strong>X</strong>
                          <p style={{ marginBottom: '0px' }}>
                            {toPascalCase(option.sireName)} ({option.sireYob},{' '}
                            <span>{option.sireCountryCode}</span>),{' '}{toPascalCase(option.damName)} (
                            {option.damYob}, <span>{option.damCountryCode}</span>)
                          </p>
                        </Stack>
                      </li>
                    </>

                  )}
                  renderInput={(params: any) => (
                    <TextField {...params} placeholder={'Enter Stallion Name'} />
                  )}
                  onBlur={handleStallionOptionsReset}
                />
              </Box>
            </Box>
            {user?.myFarms && (isSingleFarm ? <Box className='makeavailableradio'>
              <FormControl>
                <FormControlLabel
                  control={<Radio value={radioSelectedValue} onChange={handleRadioChange} checkedIcon={<img src={Images.Radiochecked} alt="checkbox" />}
                    icon={<img src={Images.Radiounchecked} alt="checkbox" />} />}
                  {...register('singleFarmAvailable')}
                  label={`Make avaliable for collegues at ${user?.myFarms?.[0]?.farmName}`}
                  className="SDradio"
                />
              </FormControl>
              <HtmlTooltip
                enterTouchDelay={0}
                leaveTouchDelay={6000}
                className="CommonTooltip studfee-tooltip"
                placement="bottom-start"
                title={
                  <React.Fragment>
                    {'Users associated with your farm will also be given access.'}{' '}
                  </React.Fragment>
                }
              >
                <i className="icon-Info-circle"></i>
              </HtmlTooltip>
            </Box>
              :
              <Box mt={2}>
                <InputLabel>Share with Users From
                  <HtmlTooltip
                    enterTouchDelay={0}
                    leaveTouchDelay={6000}
                    className="CommonTooltip studfee-tooltip"
                    placement="right-start"
                    title={
                      <React.Fragment>
                        {/* <Typography color="inherit">Tooltip with HTML</Typography> */}
                        {' By selecting a farm, your report will be shared'}{' '}
                        {'  to all registered farm users of that farm.'}{' '}
                        {/* {
                    'fee will remain confidential within our platform it’s users and will only be used internally for reporting'
                  } */}
                        {' '}
                      </React.Fragment>
                    }
                  >
                    <i className="icon-Info-circle"></i>
                  </HtmlTooltip></InputLabel>
                <TypedMultiSelect
                  placeholder={selecteFarms.length ? '' : `Select Farms`}
                  data={farms}
                  from={"SALES-CATALOG-REPORT"}
                  values={selecteFarms}
                  returnFunction={setSelectedFarms}
                  ref={stallionSelectRef}
                  selectedPrefilledData={preSelectedList}
                  cartInfo={cartInfo}
                />
              </Box>)
            }
          </>
        )}
        {id === '0' && (
          <Box className="search-stallion-pop-box reportPopup">
            <InputLabel>Your Mare</InputLabel>
            <Box className="search-stallion-pop-box-inner mareSelectPopup">
              <Autocomplete
                disablePortal
                // noOptionsText={
                //   (( mareName != 'str')  && <Box className="search-couldnot d-flex align-items-center justify-content-between mt-2 scroll-submit-stallion-wrp">
                // <span className="fw-bold sorry-message">{mareListIsLoading ? "loading..." : ((mareName?.length < 3) ? " " :  `Sorry, we couldn't find any matches for ${mareName && `"${mareName}"`}`)}</span>
                // </Box>)
                // }
                // noOptionsText={
                //   isMareSearch &&
                //   mareName != '' &&
                //   isClearMare === 0 && (
                //     <Box className="search-couldnot d-flex align-items-center justify-content-between mt-2 scroll-submit-stallion-wrp">
                //       <span className="fw-bold sorry-message">
                //       Sorry could not find horses
                //       </span>
                //     </Box>
                //   )
                // }
                popupIcon={<KeyboardArrowDownRoundedIcon />}
                id="checkboxes-tags-demo"
                options={mareOptionList || []}
                onInputChange={handleMareInput}
                getOptionLabel={(option: any) => `${toPascalCase(option?.mareName)?.toString()} (${option.countryCode}) ${option.yob} `}
                onChange={(e, selectedOptions: any) => {
                  setMareSelected(selectedOptions);
                  setCartState({ ...cartState, ...selectedOptions })
                  // handleSelectedStallionsValues(selectedOptions);
                }}
                value={mareSelected}
                // renderOption={(props, option: any) => (
                //   <li className='searchstallionListBox'{...props}>
                //     <span className='stallionListBoxName'>{toPascalCase(option.mareName)} ({option.countryCode}) {option.yob}</span>
                //   </li>
                // )}
                renderOption={(props, option: any) => (
                  <React.Fragment key={option?.mareId}>
                    <li className={`${mareOptionList[mareOptionList?.length - 1]?.mareId === option?.mareId ? 'floting-btn' : 'hide'}`}>
                      <Box className="submit-new-bg">
                        <Button
                          variant="text"
                          className="lr-btn lr-btn-outline"
                          color="primary"
                          type="button"
                          onClick={() => setOpenCreateStallionModal(true)}
                        >
                          Submit a new Mare
                        </Button>
                      </Box>
                    </li>
                    <li className="searchstallionListBox" {...props}>
                      <Stack className="stallionListBoxHead">
                        {toPascalCase(option.mareName)} ({option.yob},{' '}
                        <span>{option.countryCode}</span>)
                      </Stack>
                      <Stack className="stallionListBoxpara">
                        <strong>X</strong>
                        <p style={{ marginBottom: '0px' }}>

                          {toPascalCase(option.sireName)} ({option.sireYob},{' '}
                          <span>{option.sireCountryCode}</span>),{' '}{toPascalCase(option.damName)} (
                          {option.damYob}, <span>{option.damCountryCode}</span>)
                        </p>
                      </Stack>
                    </li>

                  </React.Fragment>

                )}
                // style={ { width: 100% } }
                renderInput={(params: any) => (
                  <TextField {...params} placeholder={'Enter Mare Name'} />
                )}
                onBlur={handleMareOptionsReset}
                noOptionsText={
                  mareName != '' &&
                  (
                    <Box className="search-couldnot d-flex align-items-center justify-content-between mt-2 scroll-submit-stallion-wrp">
                      <span className="fw-bold sorry-message">
                        {mareListIsFetching ? 'Loading...' : `Sorry, we couldn't find any matches for "${mareName}"`}
                      </span>
                      <Box className="submit-new-bg">
                        <Button
                          variant="text"
                          className="lr-btn lr-btn-outline"
                          color="primary"
                          type="button"
                          onClick={() => setOpenCreateStallionModal(true)}
                        >
                          Submit a new Mare
                        </Button>
                      </Box>
                    </Box>
                  )
                }
              // noOptionsText={mareName.length < 3 ? '' : mareListIsLoading ?  'Loading...' : 'Sorry could not find horses'}

              />
            </Box>
            <p />
            <Box className='StallionIcludeInreport shortlistConfirm' id="confrm_stln_match_ShortList_0">
              <InputLabel>Confirm Stallions Selected </InputLabel>
              <Box>
                <TypedMultiSelect
                  selectedPlaceholder="View Shortlisted Stallions"
                  placeholder={'Select Stallions'}
                  data={!isLoggedIn ? guestStallionlist : (shortListedStallionsList?.data || [])}
                  from={'Stallion-Shortlist-Report'}
                  values={selectedShortListedStallion}
                  returnFunction={setselectedShortListedStallion}
                  ref={stallionSelectRef}
                  selectedPrefilledData={preSelectedList}
                  noMatches={true ? 'No stallions in your shortlist' : ''}
                  selectedId={id}

                />
              </Box>
            </Box>

            {!isLoggedIn && guestStallionlist.length === 0 && <Box mt={1}>
              <div>
                <p>You have no Stallions in your shortlist. Add new <Link to={'/stallion-directory'} className="add-shortlist">
                  here.
                </Link></p>
              </div>
            </Box>}
            {isLoggedIn && shortListedStallionsList?.data.length === 0 && <Box mt={1}>
              <div>
                <p>You have no Stallions in your shortlist. Add new <Link to={'/stallion-directory'} className="add-shortlist">
                  here.
                </Link></p>
              </div>
            </Box>}
            <Box mt={2}>
              <div className="report-bottom-title">
                {currencyCode && currencyCode?.substring(0, 2)}
                {reportCurrencySymbol}{cartInfo && cartInfo ? preSelectedList.length * reportPrice : selectedShortListedStallion.length * reportPrice}
              </div>
              <div className="report-bottom-sub-title">
                {`${selectedShortListedStallion?.length ? selectedShortListedStallion.length : 0} Stallions Analysed.`}
              </div>
            </Box>
          </Box>
        )}
        {/* {id === '1' && !viewStallionsAnalysed && ( */}
        <Box className={`search-stallion-pop-box reportPopup ${(id === '1' && viewStallionsAnalysed === false) ? '' : 'hide'}`}>
          <InputLabel>Your Mare</InputLabel>
          <Box className="search-stallion-pop-box-inner mareSelectPopup">
            <Autocomplete
              disablePortal
              popupIcon={<KeyboardArrowDownRoundedIcon />}
              // noOptionsText={
              //   (<Box className="search-couldnot d-flex align-items-center justify-content-between mt-2 scroll-submit-stallion-wrp">
              //     <span className="fw-bold sorry-message">{mareListIsLoading ? "loading..." : ((mareName?.length < 3) ? " " : `Sorry, we couldn't find any matches for ${mareName && `"${mareName}"`}`)}</span>
              //   </Box>)
              // }
              // noOptionsText={"Sorry could not find horses"}
              // noOptionsText={
              //   isMareSearch &&
              //   mareName != '' &&
              //   isClearMare === 0 && (
              //     <Box className="search-couldnot d-flex align-items-center justify-content-between mt-2 scroll-submit-stallion-wrp">
              //       <span className="fw-bold sorry-message">
              //       Sorry could not find horses
              //       </span>
              //     </Box>
              //   )
              // }
              id="checkboxes-tags-demo"
              options={mareOptionList || []}
              onInputChange={handleMareInput}
              sx={{ margin: '0px', padding: '0px' }}
              getOptionLabel={(option: any) => `${toPascalCase(option?.mareName)?.toString()} (${option.countryCode}) ${option.yob} `}
              onChange={(e, selectedOptions: any) => {
                setMareSelected(selectedOptions);
                setCartState({ ...cartState, ...selectedOptions })
                // handleSelectedStallionsValues(selectedOptions);
              }}
              value={mareSelected}
              // renderOption={(props, option: any) => (
              //   <li className='searchstallionListBox'{...props}>
              //     <span className='stallionListBoxName'>{toPascalCase(option.mareName)} ({option.countryCode}) {option.yob}</span>
              //   </li>
              // )}
              renderOption={(props, option: any) => (
                <React.Fragment key={option?.mareId}>
                  <li className={`${mareOptionList[mareOptionList?.length - 1]?.mareId === option?.mareId ? 'floting-btn' : 'hide'}`}>
                    <Box className="submit-new-bg">
                      <Button
                        variant="text"
                        className="lr-btn lr-btn-outline"
                        color="primary"
                        type="button"
                        onClick={() => setOpenCreateStallionModal(true)}
                      >
                        Submit a new Mare
                      </Button>
                    </Box>
                  </li>
                  <li className="searchstallionListBox" {...props}>
                    <Stack className="stallionListBoxHead">
                      {toPascalCase(option.mareName)} ({option.yob},{' '}
                      <span>{option.countryCode}</span>)
                    </Stack>
                    <Stack className="stallionListBoxpara">
                      <strong>X</strong>
                      <p style={{ marginBottom: '0px' }}>
                        {toPascalCase(option.sireName)} ({option.sireYob},{' '}
                        <span>{option.sireCountryCode}</span>),{' '}{toPascalCase(option.damName)} (
                        {option.damYob}, <span>{option.damCountryCode}</span>)
                      </p>
                    </Stack>
                  </li>

                </React.Fragment>
              )}
              renderInput={(params: any) => (
                <TextField {...params} placeholder={'Enter Mare Name'} />
              )}
              onBlur={handleMareOptionsReset}
              noOptionsText={
                mareName != '' &&
                (
                  <Box className="search-couldnot d-flex align-items-center justify-content-between mt-2 scroll-submit-stallion-wrp">
                    <span className="fw-bold sorry-message">
                      {mareListIsFetching ? 'Loading...' : `Sorry, we couldn't find any matches for "${mareName}"`}
                    </span>
                    <Box className="submit-new-bg">
                      <Button
                        variant="text"
                        className="lr-btn lr-btn-outline"
                        color="primary"
                        type="button"
                        onClick={() => setOpenCreateStallionModal(true)}
                      >
                        Submit a new Mare
                      </Button>
                    </Box>
                  </Box>
                )
              }
            // noOptionsText={
            //   mareName.length < 3 ? '' : mareListIsLoading ?  'Loading...' : 'Sorry could not find horses'
            // }
            />
          </Box>
          <p />
          <InputLabel>Location of Stallions</InputLabel>
          {/* <CustomSelect
              className="selectDropDownBox"
              fullWidth
              sx={{ mb: '1rem' }}
              IconComponent={KeyboardArrowDownRoundedIcon}
              MenuProps={locationProps}
              // defaultValue={'none'}
              displayEmpty
              multiple
              value={getValues('stallionLocation') ? typeof (getValues('stallionLocation')) === 'string' ? getValues('stallionLocation')?.split(',')?.map((v: any) => Number(v)) : getValues('stallionLocation') : []}
              onChange={(e: any) => {
                // console.log( e.target.value,'TAGRET')
                const {
                  target: { value },
                } = e;
                setValue('stallionLocation', typeof (e?.target?.value) === 'string' ? value.split(',')?.map((v: any) => Number(v)) : value)
              }}
              renderValue={(selected: any) => {
                if (selected?.length === 0) {
                  return <em>Select Region</em>;
                }
                return <em>View Selected Regions</em>;
                // return getCountryListByComma(selected);

              }}
            // {...register('stallionLocation', { required: true })}
            >
              <MenuItem className="selectDropDownList mobileCountryList" value="none" disabled>
                <em>Select Region</em>
              </MenuItem>
              {stallionStateList?.map((v: any) => (
                <MenuItem className="selectDropDownList mobileCountryList reportDropDownBox" value={v.countryId} key={v.countryId}>
                  <ListItemText primary={v.label} />
                  <Checkbox
                    checkedIcon={<img src={Images.checked} alt="checkbox" />} icon={<img src={Images.unchecked} alt="checkbox" />}
                    checked={getValues('stallionLocation')?.indexOf(v.countryId) > -1}
                    disableRipple
                  />
                </MenuItem>
              ))}
            </CustomSelect> */}
          {/* {countriesList?.map(({ id, countryName }) => (
                <MenuItem className="selectDropDownList mobileCountryList" value={id} key={id}>
                  {countryName}
                </MenuItem>
              ))} */}
          {DropDownTreeSelect}
          <p />
          <InputLabel>Stud Fee Range</InputLabel>

          {/* Fee range slider for stallion list */}
          <FeeRangeTemp
            setPrice={setPrice}
            currency={currency}
            setCurrency={setCurrency}
            price={price}
            valueLabelDisplay="auto"
            radioValue={isIncludeRadioSelectedValue}
            radioOnChange={handleisIncludeRadioChange}
            open={open}
            min={stallionListInRange?.priceRange?.min}
            max={stallionListInRange?.priceRange?.max}
            cartInfo={cartInfo}
            setIsViewEditStallionClicked={setIsViewEditStallionClicked}
            setIsProReportPriceSliderChanged={setIsProReportPriceSliderChanged}
            isProReportPriceSliderChanged={isProReportPriceSliderChanged}
            viewStallionsAnalysed={viewStallionsAnalysed}
            location={watch('stallionLocation')}
            filterCounterhook={filterCounterhook}
            filterEditCounterhook={filterEditCounterhook}
          />
          <Box className='stallionanalysedBlock'>
            {stallionListInRange ? stallionsFeeRangeSelected.length : 0} Stallions Analysed.
            <span
              className='stallionanalysedBtn'
              onClick={() => (setViewStallionsAnalysed(true), setIsStalionFirst(true), setIsViewEditStallionClicked(true), filterEditCounterhook.increment())}>
              View/Edit
            </span>
          </Box>
        </Box>

        {id === '1' && viewStallionsAnalysed && (
          <Box className={`StallionIcludeInreport' id="confrm_stln_match_pro_12`}>
            <InputLabel>Stallions Included in Report</InputLabel>
            <Box className="shortlistreport-head">
              The below list will be included within your report. Please update the list by either
              checking or unchecking stallions.
            </Box>
            <Box mt={2}>
              <TypedMultiSelect
                selectedPlaceholder="View Selected Stallions"
                placeholder='Enter stallion name'
                from='STALLION-PRO-REPORT'
                data={stallionListViewEditData}
                values={stallionsFeeRangeSelected}
                returnFunction={setStallionsFeeRangeSelected}
                ref={stallionSelectRef}
                selectedPrefilledData={cartInfo ? preSelectedList : stallionsFeeRangeSelected}
                cartInfo={cartInfo}
              />
            </Box>
          </Box>
        )}
        {id === '6' &&
          <Box className="search-stallion-pop-box reportPopup" mb={2}>
            <InputLabel>Enter Stallion</InputLabel>
            <Box className="search-stallion-pop-box-inner stallionReportPopup">
              {/* <Autocomplete
            disablePortal
            popupIcon={<KeyboardArrowDownRoundedIcon />}
            id="checkboxes-tags-demo"
            options={selectStallionList || []}
            onInputChange={handleMareInput}
            sx={{ margin: '0px', padding: '0px' }}
            getOptionLabel={(option: any) => `${toPascalCase(option?.horseName)?.toString()}`}
            onChange={(e, selectedOptions: any) => {
              setSelectStallion(selectedOptions);
            }}
            value={selectStallion}
            renderOption={(props, option: any) => (
              <li className='searchstallionListBox'{...props}>
                <span className='stallionListBoxName'>{toPascalCase(option.horseName)}</span>
              </li>
            )}
            renderInput={(params: any) => (
              <TextField {...params} placeholder={'Enter Stallion Name'} />
            )}
            onBlur={handleStallionOptionsReset}
          /> */}
              <Autocomplete
                disablePortal
                // noOptionsText={stallionNameEnter.length < 3 ? '' : stallionFetching ? 'Loading...' : 'Sorry could not find stallion'}
                noOptionsText={
                  stallionNameEnter != '' &&
                  isClearStallion === 0 && (
                    <Box className="search-couldnot d-flex align-items-center justify-content-between mt-2 scroll-submit-stallion-wrp">
                      <span className="fw-bold sorry-message">
                        {stallionFetching ? 'Loading...' : `Sorry, we couldn't find any matches for "${stallionNameEnter}"`}
                      </span>
                      <Box className="submit-new-bg">
                        <Button
                          variant="text"
                          className="lr-btn lr-btn-outline"
                          color="primary"
                          type="button"
                          onClick={() => setOpenCreateStallionModal(true)}
                        >
                          Submit a new Stallion
                        </Button>
                      </Box>
                    </Box>
                  )
                }
                popupIcon={<KeyboardArrowDownRoundedIcon />}
                id="checkboxes-tags-demo"
                options={stallionOptionList || []}
                onInputChange={handleStallionInput}
                sx={{ margin: '0px', padding: '0px' }}
                getOptionLabel={(option: any) => `${toPascalCase(option?.horseName)?.toString()}`}
                onChange={(e, selectedOptions: any) => {
                  setSelectStallion(selectedOptions);
                }}
                value={selectStallion}
                renderOption={(props, option: any) => (
                  // <li className='searchstallionListBox'{...props}>
                  //   <span className='stallionListBoxName'>{toPascalCase(option.horseName)}</span>
                  // </li>
                  <>
                    <li className={`${stallionOptionList[stallionOptionList?.length - 1]?.stallionId === option?.stallionId ? 'floting-btn' : 'hide'}`}>
                      <Box className="submit-new-bg">
                        <Button
                          variant="text"
                          className="lr-btn lr-btn-outline"
                          color="primary"
                          type="button"
                          onClick={() => setOpenCreateStallionModal(true)}
                        >
                          Submit a new Stallion
                        </Button>
                      </Box>
                    </li>
                    <li className="searchstallionListBox" {...props}>
                      <Stack className="stallionListBoxHead">
                        {toPascalCase(option.horseName)} ({option.yob},{' '}
                        <span>{option.countryCode}</span>){' '} {'-'} {option?.farmName}
                      </Stack>
                      <Stack className="stallionListBoxpara">
                        <strong>X</strong>
                        <p style={{ marginBottom: '0px' }}>
                          {toPascalCase(option.sireName)} ({option.sireYob},{' '}
                          <span>{option.sireCountryCode}</span>),{' '}{toPascalCase(option.damName)} (
                          {option.damYob}, <span>{option.damCountryCode}</span>)
                        </p>
                      </Stack>
                    </li>
                  </>

                )}
                renderInput={(params: any) => (
                  <TextField {...params} placeholder={'Enter Stallion Name'} />
                )}
                onBlur={handleStallionOptionsReset}
              />
            </Box>
          </Box>
        }
        {(id === '3' || id === '6') && (
          <Box>
            <InputLabel>Select Sale Location</InputLabel>
            {/* <CustomSelect
              className="selectDropDownBox"
              fullWidth
              sx={{ mb: '1rem' }}
              IconComponent={KeyboardArrowDownRoundedIcon}
              MenuProps={locationProps}
              defaultValue={'none'}
              value={getValues('salesLocation')}
              {...register('salesLocation', { required: true })}
            >
              <MenuItem className="selectDropDownList mobileCountryList" value="none" disabled>
                <em>Select Location</em>
              </MenuItem>
              {countriesList?.map(({ id, countryName }) => (
                <MenuItem className="selectDropDownList mobileCountryList" value={id} key={id}>
                  {countryName}
                </MenuItem>
              ))}
            </CustomSelect> */}

            <CustomSelect
              className="selectDropDownBox"
              fullWidth
              sx={{ mb: '1rem' }}
              IconComponent={KeyboardArrowDownRoundedIcon}
              MenuProps={locationProps}
              // defaultValue={'none'}
              displayEmpty
              multiple
              // {...register('salesLocation', { required: true })}
              value={getValues('salesLocation') ? typeof (getValues('salesLocation')) === 'string' ? getValues('salesLocation')?.split(',')?.map((v: any) => Number(v)) : getValues('salesLocation') : []}
              onChange={(e: any) => {
                // console.log( e.target.value,'TAGRET')
                const {
                  target: { value },
                } = e;
                setValue('salesLocation', typeof (e?.target?.value) === 'string' ? value.split(',')?.map((v: any) => Number(v)) : value)
              }}
              renderValue={(selected: any) => {
                if (selected?.length === 0) {
                  return <em>Select Location</em>;
                }
                return <em>View Selected Location</em>;
                // return getCountryListByComma(selected);

              }}
            // {...register('stallionLocation', { required: true })}
            >
              <MenuItem className="selectDropDownList mobileCountryList" value="none" disabled>
                <em>Select Region</em>
              </MenuItem>
              {/* {countriesList?.map(({ id, countryName }) => (
                <MenuItem className="selectDropDownList mobileCountryList" value={id} key={id}>
                  {countryName}
                </MenuItem>
              ))} */}
              {countriesList?.map(({ id, countryName }) => (
                <MenuItem className="selectDropDownList mobileCountryList reportDropDownBox" value={id} key={id}>
                  {/* {v.label} */}
                  <ListItemText primary={countryName} />
                  {/* <Checkbox checked={getValues('stallionLocation')?.indexOf(v.countryId) > -1} /> */}
                  <Checkbox
                    checkedIcon={<img src={Images.checked} alt="checkbox" />} icon={<img src={Images.unchecked} alt="checkbox" />}
                    checked={getValues('salesLocation')?.indexOf(id) > -1}
                    disableRipple
                  />
                </MenuItem>
              ))}
            </CustomSelect>

            <Box mt={2}>
              <InputLabel>Select Sale</InputLabel>
              <Autocomplete
                disablePortal
                id="checkboxes-tags-demo"
                options={selectSaleList?.length ? selectSaleList : []}
                defaultValue={cartInfo ? cartInfo[0]?.sales ? cartInfo[0]?.sales[0] : null : null}
                popupIcon={<KeyboardArrowDownRoundedIcon />}
                ChipProps={{ deleteIcon: <CloseIcon /> }}
                noOptionsText={salesApiResponse ? 'Sorry could not find sales' : ''}
                disableCloseOnSelect
                onInputChange={(e) => setInputValue(e)}
                sx={{ margin: '0px', padding: '0px' }}
                getOptionLabel={(option: any) => `${toPascalCase(option?.salesName)?.toString()}`}
                onChange={(e, selectedOptions: any) => {
                  let selectedOpt: any = [];
                  selectedOpt.push(selectedOptions);
                  setSaleListSelected([...selectedOpt]);
                }}
                renderOption={(props, option, { selected }) => {
                  return (
                    <MenuList sx={{ boxShadow: 'none' }} key={`${option?.salesName}-${option?.salesCode}`}>
                      <MenuItem {...props} disableRipple className="LoactionFilter reportfilter" onWheel={(e) => console.log("wgelllll")}>
                        <span
                          style={{ width: '100%', paddingLeft: '16px', whiteSpace: 'break-spaces' }}
                        >
                          {toPascalCase(option?.salesName)}
                        </span>
                        <Checkbox
                          checkedIcon={<img src={Images.checked} alt="checkbox" />} icon={<img src={Images.unchecked} alt="checkbox" />}
                          checked={selected}
                          disableRipple
                        />
                      </MenuItem>
                    </MenuList>
                  );
                }}
                renderInput={(params: any) => (
                  <TextField {...params} placeholder={saleListSelected.length ? '' : 'Select Sale'} />
                )}
              />
            </Box>
            <Box mt={2}>
              <InputLabel>Select Lots</InputLabel>
              <Autocomplete
                disablePortal
                id="checkboxes-tags-demo"
                options={selectLotsList?.length ? selectLotsList : []}
                popupIcon={<KeyboardArrowDownRoundedIcon />}
                ChipProps={{ deleteIcon: <CloseIcon /> }}
                defaultValue={cartInfo ? cartInfo[0]?.lotNumber ? cartInfo[0]?.lotNumber.map((v: any) => { return { lotNumber: String(v) } }) : [] : []}
                // filterSelectedOptions
                multiple
                disableCloseOnSelect
                noOptionsText={lotsApiResponse ? 'Sorry could not find lots' : ''}
                onInputChange={(e) => setInputValueLots(e)}
                sx={{ margin: '0px', padding: '0px' }}
                getOptionLabel={(option: any) => String(option?.lotNumber)}
                onChange={(e, selectedOptions: any) => {
                  setSaleLotsSelected(selectedOptions);
                }}
                renderOption={(props, option, { selected }) => {
                  return (
                    <MenuList sx={{ boxShadow: 'none' }} key={`${option?.salesLotId}-${option?.gender}`}>
                      <MenuItem {...props} disableRipple className="LoactionFilter reportfilter">
                        <span
                          style={{ width: '100%', paddingLeft: '16px', whiteSpace: 'break-spaces' }}
                        >
                          {option?.lotNumber}
                        </span>
                        <Checkbox
                          checkedIcon={<img src={Images.checked} alt="checkbox" />} icon={<img src={Images.unchecked} alt="checkbox" />}
                          checked={selected}
                          disableRipple
                        />
                      </MenuItem>
                    </MenuList>
                  );
                }}
                renderInput={(params: any) => (
                  <TextField {...params} placeholder={saleLotsSelected.length ? '' : 'Select Lots'} />
                )}
              />
              {/* <p>{ errors?.apiError &&  errors?.apiError?.message}</p> */}
            </Box>

            {/** Below lines must be made dynamic with appropriate logic */}
            {/* <div className="report-bottom-title" style={{ marginTop: '20px' }}>{currencyCode && currencyCode === 'AUD' ? 'AU' : currencyCode}{stallionRangeParams?.currency}{150}</div> */}
            <div className="report-bottom-title" style={{ marginTop: '20px' }}>{currencyCode && currencyCode?.substring(0, 2)}{reportCurrencySymbol}{cartInfo ? cartInfo[0]?.price : reportPrice}</div>
            <div className="report-bottom-sub-title">{`${selectLotsList?.length ? selectLotsList.length : 0} Total Lots. ${selectLotsList.filter((val: any) => val.gender == 'Colt').length} Male, ${selectLotsList.filter((val: any) => val.gender == 'Filly').length} Female`}</div>

          </Box>
        )}
        {!viewStallionsAnalysed &&
          <LoadingButton
            className="AddtoCartBtn"
            type="submit"
            fullWidth
            id={id}
            disabled={IsSubmitDisabled(id)}
            loading={isSubmitting}
            sx={{ height: '48px', mt: '1rem', backgroundColor: '' }}
          >
            {' '}
            {cartInfo ? 'Save' : 'Add to cart'}
          </LoadingButton>
        }

      </form>
      {
        id === '1' && viewStallionsAnalysed &&
        <CustomButton
          className="AddtoCartBtn"
          // type="submit"
          onClick={() => { setViewStallionsAnalysed(false) }}
          fullWidth
          sx={{ height: '48px', mt: '1rem', backgroundColor: '' }}
        >
          Save
        </CustomButton>
      }
      {!viewStallionsAnalysed && <Box className="terms termsModal report-terms-modal">
        By clicking Add to cart, you agree to our{' '}
        <Button className="terms-btn" disableRipple onClick={goToTerms}>
          {' '}
          Terms and Conditions
        </Button>.
      </Box>}
      {/* </form> */}

      {/* Create new stallion popup, opens if user cannot find stallion */}
      <WrapperDialog
        open={openCreateStallionModal}
        title={id === '4' ? 'Submit a new Stallion' : mareTitle}
        dialogClassName={'dialogPopup showBackIcon'}
        onClose={handleCloseCreateStallion}
        isSubmitStallion={id === '4' ? true : false}
        isSubmitMare={id === '4' ? false : true}
        closeAddMare={''}
        body={CreateAStallion}
        className={'cookieClass'}
        createStallion="createStallion"
        sx={{ backgroundColor: '#1D472E', color: '#2EFFB4 !important' }}
      />
    </StyledEngineProvider>
  );
}

export default OrderReports;

OrderReports.propTypes = {
  onClose: PropTypes.func.isRequired,
  openOther: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
