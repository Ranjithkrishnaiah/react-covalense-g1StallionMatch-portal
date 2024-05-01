export interface Notification {
    timeStamp: string;
    title: string;
    type: "Notification Request" | "System Notification" |"Standard Notification";
    message: string;
    read: boolean;
    senderType: "Person" | "System";
    senderName?: string;
    action: string;
    colorCode: string;
}

export interface NotificationsList {
  linkName: string;
  notificationId: string;
  notificationShortUrl: string;
  messageTemplateId: number;
  messageTitle: string;
  messageText: string;
  isRead: boolean;
  timeStamp: string;
  featureId: number;
  featureName: string;
  messageTypeId: number;
  messageTypeName: string;
  senderId: number;
  senderName: string;
  roleName: string;
}

 export interface NotificationsResponse {
    data: NotificationsList[];
    mata: object;
 }