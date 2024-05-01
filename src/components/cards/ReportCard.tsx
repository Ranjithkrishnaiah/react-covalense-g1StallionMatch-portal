import React, { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, CardActions, Stack, StyledEngineProvider } from '@mui/material';
import { WrapperDialog } from '../WrappedDialog/WrapperDialog'
import './card.css';
import { CustomButton } from '../CustomButton';
import { ReportCardProps } from '../../@types/reports';
import OrderReports from '../../forms/OrderReports';
import UpdateEmail from 'src/forms/UpdateEmail';
import { TitleArray } from 'src/constants/ReportsTitleArray';
import { Link, useNavigate } from 'react-router-dom';
import useQuery from 'src/hooks/useQuery';

export default function ReportCard(props: ReportCardProps) {
  const navigate = useNavigate();
  const [openReport, setOpenReport] = React.useState(false);
  const [openUpdateEmail, setOpenUpdateEmail] = React.useState(false);
  const [viewStallionsAnalysed, setViewStallionsAnalysed] = React.useState<boolean>(false);
  const query = useQuery();

  const id = query.get('reportId') !== null ? (Number(query.get('reportId')) - 1) : parseInt(props.id);
  const shortListDescription1 = `Create your Shortlist of stallions from the`;
  const shortListDescription2 = `page, 
  then run a detailed report of these stallions over your broodmare. The result is a report identifying 
  the most suitable stallions to achieve your desired outcome for your and your broodmare. 
  A clear and precise report you can easily use.`

  useEffect(() => {
    if (query.get('reportId') !== null) {
      if (parseInt(props?.id) === 5) {
        console.log(query.get('reportId'),id, 'selectedReportId -> id')
        if (id >= 0 && id <= 14) {
          setOpenReport(true);
        }
      }
    }
  }, [query])

  // list of reports
  const formIds = (type: any) => {
    switch (type) {
      case 0:
        return "shortlist_report_1";
      case 1:
        return "stallion_match_pro_2";
      case 2:
        return "broodmare_affinity_report_3";
      case 3:
        return "stallion_match_sales_report_4";
      case 4:
        return "stallion_affinity_report_5";
      case 5:
        return "stallion_dam_sire_report_6";
      case 6:
        return "stallion_breeding_stock_sale_7";
      default:
        return "";
    }
  }
  
  return (
    <StyledEngineProvider injectFirst>
      {/* Open order report popup */}
      <WrapperDialog
        reportId={query.get('reportId') !== null ? String(id) == '13' ? '6' : String(id) : props.id == '13' ? '6' : props.id}
        open={openReport}
        title={TitleArray[String(id) == '13' ? '6' : id]}
        onClose={() => {
          if (viewStallionsAnalysed) {
            setViewStallionsAnalysed(false)
          } else {
            setOpenReport(false);
            setViewStallionsAnalysed(false);
          }
        }}
        openOther={() => setOpenUpdateEmail(true)}
        formId={query.get('reportId') !== null ? String(id) == '13' ? formIds(6) : formIds(id) : props.formId}
        currencyCode={props.currencyCode}
        reportPrice={props.price}
        reportCurrencyId={props.currencyId}
        reportCurrencySymbol={props.currencySymbol}
        cartInfo={props.cartInfo}
        deleteResponse={props.deleteResponse}
        viewStallionsAnalysed={viewStallionsAnalysed}
        setViewStallionsAnalysed={setViewStallionsAnalysed}
        body={OrderReports}
      />

      {/* Open update email address  */}
      <WrapperDialog
        open={openUpdateEmail}
        title={"Update Email Address"}
        onClose={() => setOpenUpdateEmail(false)}
        body={UpdateEmail}
      />

      {/* Report Info */}
      <Card className='ReportCard'>
        <Stack className='ReportCardMedia'>
          <CardMedia
            component="img"
            height="240"
            image={props.src + '?h=400&w=400&ar=3:2&fit=crop&nr=-100&nrs=100'}
            alt={props.title + ' Order Now'}
          />
          {/* <Imgix
            src={props.src}
            width={360} // This sets what resolution the component should load from the CDN and the size of the resulting image
            height={240}
            htmlAttributes={{ alt: `${item.type}` }}
          /> */}
        </Stack>
        <CardContent sx={{ padding: '1.5rem', minHeight: '300px' }}>
          <Typography py={1} gutterBottom variant="h4" className="MediacardTitle">
            {props.title}
          </Typography>
          <Typography gutterBottom py={1} variant="h5" sx={{ color: '#626E60', fontFamily: 'Synthese-Book' }}>
            {props.orderPrice}
          </Typography>
          <Box className='reportCardDes'>
            <Typography variant='h6' mt={1}>
              {props.id !== "0" && props.description?.replace('<p>', ' ')?.replace('</p>', '')}
            </Typography>

            {props.id === "0" &&
              <Box sx={{ display: 'inline' }} className='linkreportCardDes'>
                <Typography variant='h6' mt={1}>
                  {shortListDescription1?.replace('<p>', ' ')?.replace('</p>', '')}

                  <Link to='/stallion-directory'>Stallion Directory</Link>
                  {shortListDescription2?.replace('<p>', ' ')?.replace('</p>', '')}
                </Typography>
              </Box>}
          </Box>
        </CardContent>
        <CardActions className='report-card-bottom'>
          {/* Order the report */}
          <CustomButton className="viewButton" onClick={() => {
            if (query.get('reportId')) {
              navigate('/reports');
            }
            setTimeout(() => {
              setOpenReport(true);
            }, 250);
          }}>
            {/* Order Report */}
            {props.buttonText}

          </CustomButton>
          {/* View sample report */}
          <CustomButton className='view' onClick={(e: any) => props.handleOpenPdf(props?.reportUrl, props?.title)}>View Sample</CustomButton>
        </CardActions>
      </Card>
      {/* End Report Info */}
    </StyledEngineProvider>
  )
}