import {
  Box, Typography, TableContainer, Table,
  TableHead, TableRow, TableCell, TableBody, Divider, Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import PaginationSettings from 'src/utils/pagination/PaginationFunction'
import { parseDate, toPascalCase } from 'src/utils/customFunctions';
import { createRef, useRef, useState, useEffect } from 'react';
import OrderDetailsPDF from '../OrderDetailsPDF';
// @ts-ignore
import jspdf from "jspdf"
//@ts-ignore
import html2canvas from 'html2canvas';
import { useGetOrderPdfQuery, useGetInvoicePdfQuery } from 'src/redux/splitEndpoints/getOrderHistory';

import useCounter from 'src/hooks/useCounter';

//types
type Order = {
  orderId: string;
  paymentMethod: string;
  paymentStatus: string;
  total: number;
  orderCreatedOn: string;
  productCategoryName: string;
  productDetails: any;
  downloadStatus: Boolean;
  cardDetails?: any;
  orderIdNum?: any;
  status: string;
  reportLink: string;
  reportStatus: string;
  productName: string;
  quantity: number;
  currencyCode: string;
  currencySymbol: string;
  price: number;
  brand: string;
}
//types
type OrderHistoryProps = {
  data: any;
  meta: object;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>
}


function OrderHistory({ data = [], meta, page, setPage }: OrderHistoryProps) {
  const filterCounterhook = useCounter(0);
  const [listOrderIdToDownload, setListOrderIdToDownload] = useState("");
  const [listInvoiceToDownload, setInvoiceToDownload] = useState("");


  const { data: orderInvoiceDownload, isSuccess } = useGetInvoicePdfQuery(listInvoiceToDownload,{skip:listInvoiceToDownload?.length === 0});

  // Function to force download order reports
  const handleDownload = async (url: any, selectedOrderId: any) => {
    let i = 1;

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const filename = `${selectedOrderId}_${i}.pdf`;
      const tempUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = tempUrl;
      link.download = filename;
      link.click();

      URL.revokeObjectURL(tempUrl);
      i++;
      filterCounterhook.reset();
    } catch (error) {
      console.error('Error downloading file:', error);
    }

  };

  const [isShow, setIsShow] = useState(false);
  const [productDetailIndex, setProductDetailIndex] = useState(null);
  const [hideDownloadPDF, setHideDownloadPDF] = useState(true);

  let listData = data ? data : [];
  const elementsRef: any = useRef(listData.map(() => createRef()));

  const columnArr = ['Order', 'Details', 'Price', 'Status', ''];
  const paginationObj = { ...meta, setPage }

  // Toggle the order details
  const toggleDetails = (indexKey: any) => {
    setIsShow(!isShow)
    setProductDetailIndex(indexKey)
  }

  // Print the order details in pdf format
  let handleInvoiceDownload = (e:any,data: any) => {
    // console.log(data, 'DATTA')
    setInvoiceToDownload(data.orderId);
    setHideDownloadPDF(false);
    setTimeout(() => {
      document.getElementsByTagName('body')[0].style.overflow = 'hidden';
      const input: any = document.getElementById(`template_invoice-${data.orderId}`);
      html2canvas(input, {
        scale: 3,
      }).then(function (canvas: any) {

        var base64image = canvas.toDataURL("image/jpeg");
        var imgWidth = 207;
        var pageHeight = 288;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;
        var doc = new jspdf("p", "mm", "a4"); // landscape
        var position = 0;

        var width = doc.internal.pageSize.getWidth();
        var height = doc.internal.pageSize.getHeight();
        doc.addImage(base64image, 'JPEG', 0, 0, imgWidth - 0, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(base64image, 'JPEG', 0, position, imgWidth - 0, imgHeight);
          heightLeft -= pageHeight;
        }
        doc.save('order-receipt.pdf');
        setHideDownloadPDF(true);
        document.getElementsByTagName('body')[0].style.overflow = 'auto';
      });
    }, 2000);
  }

  // Invoice pdf component
  const invoiceComponent = (data: any, ref: any) => {
    if (hideDownloadPDF) {
      return <></>
    }
    return (
      <div className='order-invoice-pdf' ref={ref}>
        <OrderDetailsPDF data={data} />
      </div>
    )
  }

  return (
    <>
      <Box className='orderHistory-wrapper'>
        <Box mt={5}>
          <Typography variant='h3'>Order History</Typography>
        </Box>
        <Box mt={1}>
          {/* Order report list table */}
          <TableContainer className='DataList OrderHistoryTable'>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  {columnArr.map((columnName: string, index: number) => (
                    <TableCell key={columnName + index}>{columnName}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((row: Order, index: number) => {
                  return (
                    <TableRow key={row.orderId + index}>
                      <TableCell align="left" valign="middle" width="20%">
                        {/* @ts-ignore */}
                        <Typography component='span'>{row?.orderIdNum}

                        </Typography>
                        <Typography>{parseDate(row?.orderCreatedOn)}</Typography>
                      </TableCell>
                      {/* @ts-ignore */}
                      <TableCell align="left" className='order-dtls'>
                        <Typography variant='h6'>
                          {
                            // @ts-ignore 
                            row?.productDetails?.length
                          } Items
                          <div style={{ marginBottom: "10px" }}>
                            <span style={{ cursor: "pointer", marginBottom: "10px" }} className='signout' onClick={() => toggleDetails(index)}>Details</span>
                          </div>
                          {(isShow && (index === productDetailIndex)) ?

                            <span>{` ${row.productName} X ${row.quantity} (${row.currencyCode?.substring(0, 2)}${row.currencySymbol}${row.price})`}</span>
                            : ""}
                        </Typography>
                      </TableCell>

                      <TableCell align="left" width="20%">
                        <Typography component='span'>{row?.currencyCode?.substring(0, 2) || "AU"}{row.currencySymbol}{row.total}</Typography>
                        <Box>
                          <Typography sx={{ textTransform: 'capitalize' }}>{row.paymentMethod == 'card' ? toPascalCase(row?.brand) : 'Paypal'}</Typography>
                        </Box>
                        {/* @ts-ignore */}
                        <Link to={'./'} className='signout' style={{ cursor: "pointer" }} onClick={(e:any) => handleInvoiceDownload(e,row)}>Download invoice</Link>
                      </TableCell>
                      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>

                        <div >{row?.reportStatus}</div>

                      </TableCell>
                      {/* @ts-ignore */}
                      <TableCell
                        align="left" sx={{ verticalAlign: 'middle !important' }}>
                        {row && <div onClick={() => (row?.reportStatus === 'Delivered' && handleDownload(row?.reportLink, row?.orderIdNum))}  >
                          {(row?.reportStatus === 'Delivered') ? <i className='icon-Download' /> : <i className='icon-Disabled' />}

                        </div>}
                        {orderInvoiceDownload && invoiceComponent(orderInvoiceDownload, elementsRef.current[index])}

                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {/* End Order report list table */}

          {/* Order report list table pagination */}
          <PaginationSettings data={paginationObj} />
          {/* End Order report list table pagination */}
        </Box>
      </Box>
    </>
  )
}

export default OrderHistory