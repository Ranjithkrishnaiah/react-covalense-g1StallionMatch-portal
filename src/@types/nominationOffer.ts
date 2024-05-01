import React from 'react';

export interface NominationOfferProps {
  counterOfferPrice: number;
  currencyCode: string;
  currencySymbol: string;
  channelId: string;
  fromMemberId: number;
  fromMemberUuid: number;
  farmName: string;
  horseName: string;
  isAccepted: boolean;
  isCounterOffer: boolean;
  isDeclined: boolean;
  isRead: boolean;
  message: string;
  messageId: 174;
  nominationRequestId: number;
  offerPrice: number;
  recipientId: number;
  recipientName: string;
  senderCountryName: string;
  senderId: number;
  senderName: string;
  senderStateName: null;
  subject: string;
  timestamp: string;
  senderImage: string;
}
