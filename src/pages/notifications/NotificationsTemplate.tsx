import { Button, Grid, Stack, StyledEngineProvider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useRef, useState } from 'react';
import { formatDistance } from 'date-fns';
import { useNavigate } from 'react-router';
import { useGetOrderSessionDataQuery } from 'src/redux/splitEndpoints/getInvitationGetHash';
import { usePatchAcceptInvitationMutation } from 'src/redux/splitEndpoints/patchAcceptInvitaion';
import { toast } from 'react-toastify';
// @ts-ignore
import jspdf from 'jspdf';
//@ts-ignore
import html2canvas from 'html2canvas';
import OrderDetailsPDF from '../profile/OrderDetailsPDF';
import { useGetProfileImageQuery } from 'src/redux/splitEndpoints/addUserProfileImage';
import useAuth from 'src/hooks/useAuth';

function NotificationsTemplate(props: any) {
  // props
  const {
    key,
    notification,
    patchNotificationsReadHandler,
    setBoostStallionDialog,
    openConfirmAccount,
    setOpenConfirmAccount,
    patchResponse,
    userInfo,
    apiStatus,
    setApiStatus,
    apiStatusMsg,
    setApiStatusMsg,
  } = props;

  const navigate = useNavigate();
  const [notificationTimestamp, setNotificationTimestamp] = useState(null);
  const [viewOrder, setViewOrder] = useState(false);
  const [orderSessionId, setOrderSessionId] = useState('');
  const [orderPDFData, setOrderPDFData] = useState<any>();
  const [hideDownloadPDF, setHideDownloadPDF] = useState(true);
  const [notificationReadId, setNotificationReadId] = useState('');
  

  // get time of notification from API and convert
  useEffect(() => {
    const res = notification.timeStamp;
    const timestamp = res ? new Date(res) : 0;
    const distance: any = formatDistance(Date.now(), timestamp, { addSuffix: true });
    const timeStamp = distance.substring(distance.indexOf(distance.match(/\d+/g)));
    setNotificationTimestamp(timeStamp);
  }, [notification]);

  // API call for getting the order data
  const { data: viewOrderData } = useGetOrderSessionDataQuery(orderSessionId, {
    skip: !viewOrder,
  });

  // set order pdf data
  useEffect(() => {
    if (viewOrderData) {
      setOrderPDFData(viewOrderData);
    }
  }, [viewOrderData]);

  // set view order details
  useEffect(() => {
    if (orderPDFData) {
      printDocument(orderPDFData);
      setViewOrder(false);
    }
  }, [orderPDFData]);

  // API call for accept invitation
  const [PatchAcceptInvitation, acceptInvitationResponse] = usePatchAcceptInvitationMutation();

  // method to handle accept invitation
  const acceptInvitationHandler = (actionUrl: any) => {
    let data = {
      hash: actionUrl,
    };
    PatchAcceptInvitation(data);
  };

  // on success accept invitation
  useEffect(() => {
    if (acceptInvitationResponse?.isSuccess) {
      toast.success('Invitation Accepted successfully.', {
        autoClose: 2000,
      });
    } else if (acceptInvitationResponse?.isError) {
      toast.error('Link expired.', {
        autoClose: 2000,
      });
    }
  }, [acceptInvitationResponse]);

  const elementsRef: any = useRef(orderPDFData);

  // method for invoiceComponent
  const invoiceComponent = (data: any, ref: any) => {
    if (hideDownloadPDF) {
      return <></>;
    }
    return (
      <div className="order-invoice-pdf" ref={ref}>
        <OrderDetailsPDF data={data} />
      </div>
    );
  };

  let printDocument = (data: any) => {
    setHideDownloadPDF(false);
    setTimeout(() => {
      document.getElementsByTagName('body')[0].style.overflow = 'hidden';
      const input: any = document.getElementById(`template_invoice-${data.orderId}`);
      html2canvas(input, {
        scale: 0.8,
      }).then(function (canvas: any) {
        var base64image = canvas.toDataURL('image/jpeg');

        var imgWidth = 207;
        var pageHeight = 288;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;
        var doc = new jspdf('p', 'mm', 'a4'); // landscape
        var position = 0;

        var width = doc.internal.pageSize.getWidth();
        var height = doc.internal.pageSize.getHeight();
        doc.addImage(base64image, 'JPEG', 10, 10, imgWidth - 17, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(base64image, 'JPEG', 10, position, imgWidth - 17, imgHeight);
          heightLeft -= pageHeight;
        }
        doc.save('order-receipt.pdf');
        setHideDownloadPDF(true);
        document.getElementsByTagName('body')[0].style.overflow = 'auto';
        patchNotificationsReadHandler(notificationReadId);
      });
    }, 1000);
  };

  // method to handle notification links
  const buttonHandler = (notification: any) => {
    if (notification.linkName.toLowerCase().includes('resend')) {
      if (!notification?.isRead) {
        patchNotificationsReadHandler(notification.notificationId);
      }
      setTimeout(() => {
        setOpenConfirmAccount(true);
      }, 500);
    } else if (notification.linkName.toLowerCase().includes('boost profiles')) {
      if (!notification?.isRead) {
        patchNotificationsReadHandler(notification.notificationId);
      }
      setTimeout(() => {
        setBoostStallionDialog(true);
      }, 500);
    } else if (notification.linkName.toLowerCase().includes('accept invitation')) {
      if (!notification?.isRead) {
        patchNotificationsReadHandler(notification.notificationId);
      }
      acceptInvitationHandler(notification?.actionUrl);
    } else if (
      notification.linkName.toLowerCase().includes('multiple links within email') ||
      notification.linkName.toLowerCase().includes('none - mailto: links only')
    ) {
      if (!notification?.isRead) {
        patchNotificationsReadHandler(notification.notificationId);
      }
    } else if (
      notification.linkName.toLowerCase().includes('renew now') ||
      notification.linkName.toLowerCase().includes('renew now auto-renew on')
    ) {
      if (!notification?.isRead) {
        patchNotificationsReadHandler(notification.notificationId);
      }
      setTimeout(() => {
        navigate(`${notification.actionUrl}`);
      }, 500);
    } else if (notification.linkName.toLowerCase().includes('go to profile')) {
      if (!notification?.isRead) {
        patchNotificationsReadHandler(notification.notificationId);
      }
      setTimeout(() => {
        navigate('/user/profile');
      }, 500);
    } else if (
      notification.linkName.toLowerCase().includes('view details') ||
      notification.linkName.toLowerCase().includes('stallion roster')
    ) {
      if (!notification?.isRead) {
        patchNotificationsReadHandler(notification.notificationId);
      }
      setTimeout(() => {
        navigate(`${notification.actionUrl}`);
      }, 500);
    } else if (
      notification.linkName.toLowerCase().includes('view report') &&
      notification?.messageTitle != 'Order Delivery'
    ) {
      if (!notification?.isRead) {
        patchNotificationsReadHandler(notification.notificationId);
      }
      setTimeout(() => {
        navigate('/reports');
      }, 500);
    } else if (
      notification.linkName.toLowerCase().includes('view report') &&
      notification?.messageTitle == 'Order Delivery'
    ) {
      if (!notification?.isRead) {
        patchNotificationsReadHandler(notification.notificationId);
      }
      setTimeout(() => {
        window.open(notification?.actionUrl);
      }, 500);
    } else if (notification.linkName.toLowerCase().includes('view order')) {
      if (!notification?.isRead) {
        setNotificationReadId(notification.notificationId);
      }
      setOrderSessionId(notification?.actionUrl);
      setViewOrder(true);
    } else {
      if (!notification?.isRead) {
        patchNotificationsReadHandler(notification.notificationId);
      }
      setTimeout(() => {
        window.sessionStorage.setItem('SessionViewOptions', 'All Messages');
        window.sessionStorage.setItem('SessionFilteredFarm', '');
        if (notification.actionUrl) {
          navigate(`${notification.actionUrl}`);
        }
      }, 500);
    }
  };

  return (
    <StyledEngineProvider injectFirst>
      <Box key={key} className="notification">
        <Grid
          container
          columns={12}
          mb={1}
          p={2}
          className={`${
            notification.featureName === 'Messaging'
              ? 'List-content'
              : 'List-content system-notification'
          } ${notification.messageTitle.toLowerCase().includes('message received') && 'noBorder'}`}
        >
          {notification.isRead === false && (
            <Box
              className="notif-close"
              onClick={() => patchNotificationsReadHandler(notification.notificationId)}
            >
              <i className="icon-Cross" />
            </Box>
          )}
          {notification.isRead === false && (
            <Grid
              item
              lg={0.5}
              sm={0.5}
              xs={1}
              sx={{ display: 'flex', justifyContent: 'center' }}
              className="notificationLeft"
            >
              <Typography className="redDot" />
            </Grid>
          )}
          <Grid
            item
            lg={11.5}
            sm={11.5}
            xs={11}
            pl={0}
            className={`${
              notification.isRead === false
                ? 'notificationRight'
                : 'notificationRight notificationRead'
            }`}
          >
            <Box sx={{ display: 'flex' }}>
              <Typography variant="h4" pb={1}>
                {notification.messageTitle}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="h5"
                sx={{ fontFamily: 'Synthese-Book', color: '#161716' }}
                dangerouslySetInnerHTML={{ __html: notification.messageText }}
              ></Typography>
            </Box>
            <Stack direction="row" mt={1}>
              <Box flexGrow={1}>
                <Typography component="span" sx={{ color: '#626E60' }}>
                  {notificationTimestamp} ago
                </Typography>
              </Box>
              <Box>
                <Button
                  className={`view-request ${
                    (notification?.isInviteAccepted == 1 ||
                      (userInfo?.isVerified &&
                        notification?.linkName?.toLowerCase()?.includes('resend'))) &&
                    'disableStateBtn'
                  }`}
                  onClick={() => buttonHandler(notification)}
                >
                  {notification.linkName === 'Multiple links within email' ||
                  notification.linkName === 'None - mailto: links only'
                    ? ''
                    : notification.linkName}
                </Button>
                <div
                  className="invoiceBlock"
                  style={{
                    position: 'absolute',
                    left: '-10000px',
                    top: 'auto',
                  }}
                >
                  {!hideDownloadPDF && invoiceComponent(orderPDFData, elementsRef.current)}
                </div>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </StyledEngineProvider>
  );
}

export default NotificationsTemplate;
