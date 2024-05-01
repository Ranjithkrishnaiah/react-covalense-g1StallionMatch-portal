import { Box, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import CustomizedSwitches from 'src/components/Switch';
import { NotificationsArray } from '../../../constants/ProfileConstants';
import { useGetNotificationPreferencesQuery } from 'src/redux/splitEndpoints/getNotificationPreferences';
import { transformResponse } from 'src/utils/FunctionHeap';

type NotificationObj = {
  id: number;
  message: string;
};

function Notifications() {
  const [notificationPreferencesArray, setNotificationPreferencesArray] = useState<any>([]);

  // Api call
  const { data: NotificationPreferences, isSuccess: isNotificationPreferencesSuccess } =
    useGetNotificationPreferencesQuery();

  // Set the state from api call
  useEffect(() => {
    if (isNotificationPreferencesSuccess && NotificationPreferences?.length) {
      setNotificationPreferencesArray(
        transformResponse(NotificationPreferences, 'PROFILE-NOTIFICATIONS')
      );
    }
  }, [isNotificationPreferencesSuccess, NotificationPreferences]);

  // Notification status array
  const notificationStatusArray: any =
    NotificationPreferences !== undefined
      ? NotificationPreferences?.map((notification: any) => ({
        id: notification.notificationTypeId,
        type: notification.notificationTypeName,
        isActive: notification.isActive,
      }))
      : '';

  // Notification status message
  const getNotificationOffMessageById = (id: number) => {
    if (id)
      return notificationOffMessages.filter((notification: any) => notification.id == id)[0]
        ?.message;
  };

  // Notification off status
  const notificationOffMessages: any = [
    { id: 1, message: 'Be updated when you receive a reply to your message.' },
    { id: 2, message: 'Know the outcome of your Nomination Request.' },
    { id: 3, message: 'Stay informed with current stats and breeding information.' },
    { id: 4, message: 'Changes impacting your membership will not be communicated.' },
    { id: 5, message: 'You will not be notified of important technical information.' },
    { id: 6, message: 'Unique offerings will no longer be avaliable.' },
  ];

  return (
    <>
      <Box mt={5}>
        <Typography variant="h3">Notifications</Typography>
      </Box>
      <Box pt={3}>
        <Typography variant="h6">
          Let us know what you would like to be notified about via email:
        </Typography>
      </Box>
      {/* List of notification */}
      <Box className="profile-notifcations">
        {NotificationsArray.map((notification: NotificationObj, index: number) => (
          <Box key={`${notification.id}`} mt={2}>
            <Box className="notifc">
              <CustomizedSwitches
                notificationType={notification.message}
                id={`notification-${notificationPreferencesArray[index]?.id}-${notificationPreferencesArray[index]?.isActive}`}
                name={notificationStatusArray[index]?.type}
                profilePage={true}
                checked={notificationPreferencesArray[index]?.isActive}
              />
              <Typography variant="h4">{notification.message}</Typography>
            </Box>
            {!notificationPreferencesArray[index]?.isActive && (
              <Typography variant="h6">
                {getNotificationOffMessageById(notificationPreferencesArray[index]?.id)}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
      {/* End List of notification */}
    </>
  );
}

export default Notifications;
