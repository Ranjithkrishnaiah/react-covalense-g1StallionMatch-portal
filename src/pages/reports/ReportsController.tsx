import React, { useEffect, useState } from 'react'
import { Container, Grid, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
// MetaTags
import useMetaTags from 'react-metatags-hook';

import ReportCard from 'src/components/cards/ReportCard'
import { ReportCardProps } from '../../@types/reports'
import { Images } from '../../assets/images';
import './Reports.css';
import CaroselDialog from 'src/components/WrappedDialog/CaroselDialog';
import { singleCardCaroselProps } from '../../constants/CaroselConstants'
import { scrollToTop } from '../../utils/customFunctions';
import { useGetCartItemsQuery } from 'src/redux/splitEndpoints/getCartItemsSplit'
import useAuth from 'src/hooks/useAuth'
import { WrapperDialog } from 'src/components/WrappedDialog/WrapperDialog'

import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';
import { VoidFunctionType } from 'src/@types/typeUtils'
import { useGetProjectReportsCurrencyInfoQuery, useGetProjectReportsQuery } from 'src/redux/splitEndpoints/getProjectReport';
import useCounter from 'src/hooks/useCounter';
import useQuery from 'src/hooks/useQuery';
import { usePageDataSplitQuery } from 'src/redux/splitEndpoints/pageDataSplit';
import { usePostRegisteredReportPageCountMutation, usePostUnRegisteredReportPageCountMutation } from 'src/redux/splitEndpoints/postReportOverviewCount';


function ReportsController() {
  const reportsPageId = process.env.REACT_APP_REPORTS_OVERVIEW_PAGE_ID;

  // Meta tags for report page
  useMetaTags({
    title: `Sales and Affinity Reports | Stallion Match`,
    description: `Need more detailed or breeding ancestry data for your shortlisted stallions? Order your custom PRO thoroughbred reports based on your criteria and make the best decision and match for your pedigree match.`,
    openGraph: {
      title: `Sales and Affinity Reports | Stallion Match`,
      description: `Need more detailed or breeding ancestry data for your shortlisted stallions? Order your custom PRO thoroughbred reports based on your criteria and make the best decision and match for your pedigree match.`,
      site_name: 'Stallion Match',
      url: 'https://dev.stallionmatch.com/reports',
      type: 'business.business',
      image: 'https://dev-s3-lambda-bucket.s3.ap-southeast-2.amazonaws.com/og%20tag%20images/StallionMatch-Reports.png',
    },
  }, [])

  const [showSample, setShowSample] = React.useState(false);
  const { authentication } = useAuth();
  const countryName = window.localStorage.getItem("geoCountryName");
  const user = JSON.parse(window.localStorage.getItem("user") || '{}');
  const [cartItemList, setCartItemList] = React.useState<any[]>([])
  const { data: cartItems, isSuccess: isCartItemsSuccess } = useGetCartItemsQuery(null, { skip: !authentication,refetchOnMountOrArgChange: true });
  const { data: projectReportList, isSuccess: isProjectReportListSuccess } = useGetProjectReportsQuery({});
  const { data: projectReportCurrencyInfoList, isSuccess: isProjectReportCurrencyInfoListSuccess } = useGetProjectReportsCurrencyInfoQuery(authentication ?
    { member: user?.id, country: user?.memberaddress[0]?.countryName ? user?.memberaddress[0]?.countryName : "Australia" } : { country: countryName ? countryName : "Australia" });
  // const { data: pageData, isFetching: pageDateIsFetching } = usePageDataSplitQuery(
  //   reportsPageId
  // );
    // console.log(projectReportCurrencyInfoList, 'user>>>>');
  const [openReport, setOpenReport] = React.useState(false)
  const [selectedReportId, setSelectedReportId] = React.useState<any>(undefined);
  const [reportUrl, setReportUrl] = React.useState('')
  const [title, setTitle] = React.useState('')
  const hide = () => setShowSample(false);
  const hideReportForm = () => setOpenReport(false);
  const counter = useCounter(0);
  const counterRender = useCounter(0);
  const query = useQuery();
  let selectedId = Number(query.get('reportId'));

  const geoCountry = localStorage.getItem('geoCountryName');

  // Not logged Report Page API call
  const [registeredReportPageCount] = usePostRegisteredReportPageCountMutation();

  // Logged in Report Page API call
  const [unRegisteredReportPageCount] = usePostUnRegisteredReportPageCountMutation();

  // Check if location based country is available or not then call api
  useEffect(() => {
    if (geoCountry !== "") {
      handlePostHomePageCount();
    }
  }, [geoCountry]);

  const handlePostHomePageCount = async () => { 
    if(authentication) {
      await registeredReportPageCount({countryName: geoCountry});
    } else {
      await unRegisteredReportPageCount({countryName: geoCountry});
    }
  }


  useEffect(() => {
    if (query.get('reportId') && counter?.value === 0) {
      // console.log(query,'called query')
      counter?.increment();
      setSelectedReportId(selectedId);
    }
  }, [query])

  // on page render scroll to top
  useEffect(() => {
    scrollToTop()
  }, [])

  // set the cart list.
  if (isCartItemsSuccess && cartItems?.length !== 0 && cartItemList?.length !== cartItems?.length) {
    cartItems && setCartItemList(cartItems)
  }

  // list of reports
  const formIds = (type: any) => {
    switch (type) {
      case "Shortlist Stallion Report":
        return "shortlist_report_1";
      case "Stallion Match PRO Report":
        return "stallion_match_pro_2";
      case "Broodmare Affinity Report":
        return "broodmare_affinity_report_3";
      case "Stallion Match Sales Report":
        return "stallion_match_sales_report_4";
      case "Stallion Affinity Report":
        return "stallion_affinity_report_5";
      case "Broodmare Sire Report":
        return "stallion_dam_sire_report_6";
      case "Stallion X Breeding Stock Sale":
        return "stallion_breeding_stock_sale_7";
      default:
        return "";
    }
  }
  
  // Report data
  const reportData = projectReportList?.length && projectReportList.map((item: any) => {
    return {
      id: JSON.stringify(parseInt(item?.productId) - 1),
      src: item?.imageUrl,
      title: item?.productName,
      formId: formIds(item?.productName),
      orderPrice: item.currencyCode?.substring(0, 2) + item.currencySymbol + item.price + ((item?.productId === "1" || item?.productId === 1) ? '/stallion' : ''),
      description: item.description,
      reportUrl: item.reportUrl,
      show: setShowSample, hide, hideReportForm,
      price: item?.price,
      currencyCode: item?.currencyCode,
      currencySymbol: item?.currencySymbol,
      productCode: item?.productCode,
      buttonText: item?.buttonText,
      isActive: item?.isActive,
    }
  });

  // Open sample report
  const handleOpenPdf = (url: string, title: string) => {
    setOpenReport(true);
    setReportUrl(url);
    setTitle(title);
  }
  const reportCurrencyInfoList = projectReportCurrencyInfoList?.length ? projectReportCurrencyInfoList : [];
  // const pageDataReportList = pageData ? pageData?.overview?.list?.filter((v:any) => v.isActive)  : [];
  // console.log(pageDataReportList,'pageDataReportList');

  let reportsList: any = reportData?.length ? reportData?.filter((v:any) => v.isActive) : [];
  let arr: any = [];
  if (reportCurrencyInfoList?.length) {
    arr = [];
    for (let index = 0; index < reportsList.length; index++) {
      const element1: any = reportsList[index];
      for (let index = 0; index < reportCurrencyInfoList.length; index++) {
        const element: any = reportCurrencyInfoList[index];
        let obj = {};
        if (element?.productCode == element1?.productCode) {
          obj = {
            ...element1,
            price: element?.price,
            currencyCode: element?.currencyCode,
            currencySymbol: element?.currencySymbol,
            currencyId: element?.currencyId,
            orderPrice: element.currencyCode?.substring(0, 2) + element.currencySymbol + element.price + ((element?.productId === "1" || element?.productId === 1) ? '/stallion' : ''),
          }
          arr.push(obj);
          break;
        }
      }

    }
  }

  reportsList = JSON.parse(JSON.stringify(arr));
  // console.log(reportsList,arr, 'reportsList arr')

  // let newArr: any = [];
  // if (pageDataReportList?.length) {
  //   arr = [];
  //   for (let index = 0; index < reportsList.length; index++) {
  //     const element1: any = reportsList[index];
  //     for (let index = 0; index < pageDataReportList.length; index++) {
  //       const element: any = pageDataReportList[index];
  //       let obj = {};
  //       if (element?.title == element1?.title) {
  //         obj = {
  //           ...element1,
  //           buttonText: element?.buttonText,
  //           description: element?.description,
  //           imageUrl: element?.imageUrl,
  //           pdfUrl: element?.pdfUrl,
  //           title: element?.title,
  //         }
  //         newArr.push(obj);
  //         break;
  //       }
  //     }

  //   }
  //   // console.log(arr, 'reportsList arr')
  // }
  
  
  // reportsList = JSON.parse(JSON.stringify(newArr));
  // console.log(reportsList,newArr, 'reportsList newArr')


  return (
    <>
      <Box pb={5}>
        <Container className='report-overview-page'>
          <Grid item lg={7} sm={10} className='Main-Title'>
            <Typography variant='h1'>The most valued reports for Farms and Breeders.</Typography>
          </Grid>
          {/* Sample pdf popup */}
          <WrapperDialog
            open={openReport}
            title={title}
            onClose={() => setOpenReport(false)}
            body={IframeComp}
            reportUrl={reportUrl}
            dialogClassName={'pdf-view-modal'}
          />
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              position: 'relative'
            }}
          >
            {/* Individual report cards */}
            {reportsList.map((report: ReportCardProps) => (
              <ReportCard {...report} key={report.title} selectedReportId={selectedReportId} handleOpenPdf={handleOpenPdf} />
            ))}

            {/* carosel dialog */}
            <CaroselDialog
              open={showSample}
              onClose={() => setShowSample(false)}
              {...singleCardCaroselProps} />
          </Box>
        </Container>
      </Box>
    </>
  )
}

// Component to show sample pdf on clicking view sample button
const IframeComp = (onClose: VoidFunctionType, title: string, reportUrl: string) => {
  const [numPages, setNumPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [scaleVal, setScale] = useState(1.0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSuccessfullyLoaded, setIsSuccessfullyLoaded] = useState(false);

  //  On Document Load
  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
    setPageNumber(1);
    setScale(1);
    setIsFullScreen(false);
    setIsSuccessfullyLoaded(true);
  }

  // On page change
  function changePage(offSet: any) {
    setPageNumber(prevPageNumber => prevPageNumber + offSet);
  }

  // on previous page
  function changePageBack() {
    changePage(-1)
  }

  // on next page
  function changePageNext() {
    changePage(+1)
  }

  // handle fullscreen for sample report pdf
  function handleFullScreen() {
    let pdf = document.getElementsByClassName('pdf-report')[0];
    pdf?.requestFullscreen();
    setScale(1.0);
    setIsFullScreen(true)
  }

  // change the scale of report
  function handleScale(type: string) {
    if (type === 'plus') {
      setScale((prev) => prev + 0.5)
    }
    if (type === 'minus') {
      scaleVal > 0.5 && setScale((prev) => prev - 0.5)
    }
  }

  // on close reset the value
  useEffect(() => {
    setPageNumber(1);
    setScale(1);
    setIsFullScreen(false);
  }, [onClose])

  // set fullscreen state on fullscreen event listener
  useEffect(() => {
    function onFullscreenChange() {
      setIsFullScreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  return (
    <div>
      <header className="App-header">
        {/* Show pdf sample report */}
        <Document file={reportUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <Page height={600} width={410} scale={scaleVal}
            className={`pdf-report ${isFullScreen === true ? 'centered-pdf' : ''}`}
            pageNumber={pageNumber} >
          </Page>
        </Document>

        {/* Navigation buttons */}
        <Stack className='report-nav'>
          {
            <button disabled={(pageNumber <= 1)} className='report-nav-left' onClick={changePageBack}><i className='icon-Chevron-left'></i></button>
          }
          {
            <button disabled={(pageNumber >= numPages)} className='report-nav-right' onClick={changePageNext}><i className='icon-Chevron-right'></i></button>
          }
        </Stack>

        {/* Sample report controller */}
        <Stack className='report-modal-controller'>
          {isSuccessfullyLoaded && <button onClick={() => handleScale('minus')}><img src={Images.ZoomOut} alt="ZoomOut" /></button>}
          {isSuccessfullyLoaded && <button onClick={() => handleScale('plus')}><img src={Images.ZoomIn} alt="ZoomIn" /></button>}
          {isSuccessfullyLoaded && <a href={reportUrl} download={title}><i className='icon-Download'></i></a>}
          {isSuccessfullyLoaded && <button onClick={handleFullScreen} className='expand-modal'><i className='icon-Expand'></i></button>}
          {<button onClick={onClose}><i className='icon-Cross'></i></button>}
        </Stack>
      </header>
    </div>
  )
}

export default ReportsController