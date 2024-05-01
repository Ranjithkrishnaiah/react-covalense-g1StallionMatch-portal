import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import React, { Dispatch, ReactChild, SetStateAction, SyntheticEvent } from 'react';
import { StallionAnalyticsDialogProps } from './StallionAnalytics';
import { OrderReportDialogProps } from './orderReport';
import { SxProps } from '@mui/material';
import { AnyLayer } from 'mapbox-gl';
import { NominationOfferProps } from './nominationOffer';
export type ReactChildProp = {
  children: ReactChild;
};

export type EventProp = SyntheticEvent;

export type VoidFunctionType = () => void;

export type VoidFunctionOneStringArg = (any: string) => void;

export type LoginProps = {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  openOther: VoidFunctionType;
  OFP: VoidFunctionType;
  firstLogin: boolean;
  farmAdminFirstLogin: boolean;
  setRegistrationTitle?: VoidFunctionType;
  forwardLinkObj?: any;
  body: (
    onClose: VoidFunctionType,
    openOther: VoidFunctionType,
    OFP: VoidFunctionType,
    firstLogin: boolean,
    farmAdminFirstLogin: boolean,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>,
    setRegistrationTitle?: VoidFunctionType,
    forwardLinkObj?: any
  ) => ReactJSXElement;
};

export interface RegistrationProps {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  openOther: VoidFunctionType;
  changeTitleTo: Dispatch<SetStateAction<string>>;
  setIsFirstLogin: Dispatch<SetStateAction<boolean>>;
  setFarmAdminFirstLogin: Dispatch<SetStateAction<boolean>>;
  hash?: string;
  fullName?: string;
  InvitedEmail?: string;
  emailValue?: string;
  setEmailValue?: Dispatch<SetStateAction<string>>;
  isAgreed?: boolean;
  setIsAgreed?: Dispatch<SetStateAction<boolean>>;
  isLoginOpen?: boolean;
  closeLogin?: VoidFunctionType;
  body: (
    title: string,
    onClose: VoidFunctionType,
    openOther: VoidFunctionType,
    changeTitleTo: Dispatch<SetStateAction<string>>,
    setIsFirstLogin: Dispatch<SetStateAction<boolean>>,
    setFarmAdminFirstLogin: Dispatch<SetStateAction<boolean>>,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>,
    hash: string | undefined,
    emailValue: string | undefined,
    setEmailValue: Dispatch<SetStateAction<string>> | undefined,
    isAgreed: boolean | undefined,
    fullName: string | undefined,
    InvitedEmail: string | undefined,
    setIsAgreed?: Dispatch<SetStateAction<boolean>>,
    isLoginOpen?: boolean,
    closeLogin?: VoidFunctionType
  ) => ReactJSXElement;
}

export interface ConfirmDialogProps {
  open: boolean;
  title: 'Are you sure?';
  onClose: VoidFunctionType;
  tableId: string;
  itemName: string;
  itemId: string;
  farmId?: string;
  customMessage?: string;
  body: (
    onClose: VoidFunctionType,
    tableId: string,
    itemName: string,
    itemId: string,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>,
    farmId?: string,
    customMessage?: string
  ) => ReactJSXElement;
}

export interface UserAccessProps {
  open: boolean;
  title: 'User Access';
  onClose: VoidFunctionType;
  invitationId: any;
  userName: string;
  userImage: string;
  email: string;
  // farmId: string;
  // accessLevel: number;
  body: (
    onClose: VoidFunctionType,
    userId: string,
    userName: string,
    userImage: string,
    email: string,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>
  ) => ReactJSXElement;
}

export interface AddToLists {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  param: string;
  body: (
    onClose: VoidFunctionType,
    param: string,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>
  ) => ReactJSXElement;
}

export interface HypomatingProps {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  parameter: string;
  body: (
    onClose: VoidFunctionType,
    parameter: string,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>
  ) => ReactJSXElement;
}

export interface CookieDialogProps {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  className: string;
  body: (
    onClose: VoidFunctionType,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>
  ) => ReactJSXElement;
  titleSx: SxProps;
  iconSx: SxProps;
}
export interface EditProfileProps {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  className: string;
  body: (
    onClose: VoidFunctionType,
    propDetails: any,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>
  ) => ReactJSXElement;
  dialogClassName: string;
  propDetails: any;
}
export interface LinkExpiredProps {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  link: string;
  body: (onClose: VoidFunctionType, link: string) => ReactJSXElement;
}

export interface reportPopupProps {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  reportUrl: string;
  body: (onClose: VoidFunctionType, title: string, reportUrl: string) => ReactJSXElement;
}

export interface fileMediaProps {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  mediaUrl: any;
  fileType: string;
  blobFetching: boolean;
  body: (onClose: VoidFunctionType, title: string, mediaUrl: any, fileType: string, blobFetching: boolean) => ReactJSXElement;
}

export interface CreatePasswordProps {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  name: string;
  email: string;
  securityKey: string;
  openSuccessUpdate?: boolean;
  setOpenSuccessUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
  body: (
    onClose: VoidFunctionType,
    name: string,
    email: string,
    securityKey: string,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>,
    openSuccessUpdate?: boolean,
    setOpenSuccessUpdate?: React.Dispatch<React.SetStateAction<boolean>>
  ) => ReactJSXElement;
}

export interface ChangePasswordProps {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  name: string;
  email: string;
  securityKey: string;
  body: (
    onClose: VoidFunctionType,
    name: string,
    email: string,
    securityKey: string,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>
  ) => ReactJSXElement;
}

export interface StallionDialogProps {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  openOther: VoidFunctionType;
  changeTitleTest: Dispatch<SetStateAction<string>>;
  setDialogClassName: Dispatch<SetStateAction<string>>;
  handleSelectedStallions: (value: any) => void;
  openPromoteStallion: VoidFunctionType;
  body: (
    title: string,
    onClose: VoidFunctionType, //TO DO: Find the exact Property and fix
    openOther: VoidFunctionType,
    changeTitleTest: Dispatch<SetStateAction<string>>,
    setDialogClassName: Dispatch<SetStateAction<string>>,
    handleSelectedStallions: (value: any) => void,
    openPromoteStallion: VoidFunctionType,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>
  ) => ReactJSXElement;
  maxWidth?: null;
  sx?: SxProps;
}
export interface RegisterInterestProps {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  className: string;
  sx: SxProps;
  maxWidth?: null;
  openSuccess: VoidFunctionType;
  body: (
    title: string,
    onClose: VoidFunctionType, //TO DO: Find the exact Property and fix
    openSuccess: VoidFunctionType,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>
  ) => ReactJSXElement;
}

export interface ConfirmEditStallionProfile {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  pageTitle: any;
  setConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  body: (
    onClose: VoidFunctionType,
    pageTitle: any,
    setConfirm: React.Dispatch<React.SetStateAction<boolean>>,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>
  ) => ReactJSXElement;
}

export interface ForgotAndResetPasswordProps {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  body: (
    onClose: VoidFunctionType,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>
  ) => ReactJSXElement;
}

export interface createStallionProps {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  createStallion: string;
  isSubmitStallion: boolean;
  setOpenStallionModal?: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitMare: boolean;
  closeAddMare: any;
  className: string;
  sx: SxProps;
  maxWidth?: null;
  body: (
    title: string,
    onClose: VoidFunctionType,
    createStallion: string,
    isSubmitStallion: boolean,
    isSubmitMare: boolean,
    closeAddMare: any,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>
  ) => ReactJSXElement;
}

export interface openStallionPromoteProps {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  openOther: VoidFunctionType;
  OpenPromote: string;
  selectedStallionIds: any;
  className: string;
  sx: SxProps;
  maxWidth?: null;
  body: (
    title: string,
    onClose: VoidFunctionType,
    openOther: VoidFunctionType,
    OpenPromote: string,
    selectedStallionIds: any,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>
  ) => ReactJSXElement;
}

export interface StallionPromoteProps {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  promoteStallionType: VoidFunctionType;
  selectedStallionIds: any;
  stallionId?: string;
  onCloseSuccess?: VoidFunctionType;
  isEdit?: boolean;
  body: (
    title: string,
    onClose: VoidFunctionType,
    promoteStallionType: VoidFunctionType,
    selectedStallionIds: any,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>,
    open: boolean,
    stallionId?: string,
    onCloseSuccess?: VoidFunctionType,
    isEdit?: boolean
  ) => ReactJSXElement;
}

export interface ConfirmStopNominationPromotion {
  open: boolean;
  title: string;
  promoted: boolean;
  nominated: boolean;
  onClose: VoidFunctionType;
  stallionName: string;
  stallionId: string;
  closeConfirmPopupFuture: VoidFunctionType;
  expiryDate: string;
  chosenDate: (val: string) => void;
  body: (
    onClose: VoidFunctionType,
    promoted: boolean,
    nominated: boolean,
    stallionName: string,
    stallionId: string,
    closeConfirmPopupFuture: VoidFunctionType,
    expiryDate: string,
    open: boolean,
    chosenDate: (val: string) => void,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>
  ) => ReactJSXElement;
}

export interface RemoveStallion {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  StallionName: string;
  ExpiryDate: string;
  ChangeTitleRemove: (value: any) => void;
  stallionId?: string;
  body: (
    onClose: VoidFunctionType,
    StallionName: string,
    ExpiryDate: string,
    ChangeTitleRemove: (value: any) => void,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>,
    stallionId?: string
  ) => ReactJSXElement;
}

export interface ActivateNomination {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  stallionName: string;
  stallionId: string;
  activateNomination: string;
  chosenDate: (val: any) => void;
  maxExpiryDate?: any;
  onCloseNominated?: VoidFunctionType;
  body: (
    title: string,
    onClose: VoidFunctionType,
    stallionName: string,
    stallionId: string,
    activateNomination: string,
    open: boolean,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>,
    chosenDate: (val: any) => void,
    maxExpiryDate?: any,
    onCloseNominated?: VoidFunctionType
  ) => ReactJSXElement;
}

export interface UpdateServiceFee {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  stallionName: string;
  stallionId: string;
  updateServiceFee: string;
  maxExpiryDate?: any;
  onCloseNominated?: VoidFunctionType;
  body: (
    open: boolean,
    title: string,
    onClose: VoidFunctionType,
    stallionName: string,
    stallionId: string,
    updateServiceFee: string,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>,
    maxExpiryDate?: any,
    onCloseNominated?: VoidFunctionType
  ) => ReactJSXElement;
}

export interface AlreadyAvailablePromotion {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  alreadyAvailable: string;

  body: (
    title: string,
    onClose: VoidFunctionType,
    alreadyAvailable: string,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>
  ) => ReactJSXElement;
}

export interface BoostStallionProfileProps {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  setBoostStallionDialogTitle: Dispatch<SetStateAction<string>>;
  boostStallionDialogTitle: string;
  boostStallionDialog: boolean;
  apiStatus: boolean;
  setApiStatus: any;
  apiStatusMsg: any;
  setApiStatusMsg: any;
  body: (
    onClose: VoidFunctionType,
    setBoostStallionDialogTitle: Dispatch<SetStateAction<string>>,
    boostStallionDialogTitle: string,
    boostStallionDialog: boolean,
    apiStatus: boolean,
    setApiStatus: any,
    apiStatusMsg: any,
    setApiStatusMsg: any
  ) => ReactJSXElement;
}

export interface ConfirmYourAccountProps {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  confirmYourAcccount: any;
  apiStatus: boolean;
  setApiStatus: any;
  apiStatusMsg: any;
  setApiStatusMsg: any;
  body: (
    onClose: VoidFunctionType,
    confirmYourAcccount: any,
    apiStatus: boolean,
    setApiStatus: any,
    apiStatusMsg: any,
    setApiStatusMsg: any
  ) => ReactJSXElement;
}

export interface AddAFarm {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  addAFarm: string;
  email: any;
  body: (
    onClose: VoidFunctionType,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>
  ) => ReactJSXElement;
}

export interface NominationOffer {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  farmId: string;
  openNominationWrapper: boolean;
  selectedFarmHeader: any;
  setLoaderInProgress: any;
  body: (
    onClose: VoidFunctionType,
    farmId: string,
    openNominationWrapper: boolean,
    selectedFarmHeader: any,
    setLoaderInProgress: any,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>
  ) => ReactJSXElement;
}

export interface AcceptOffer {
  offerPrice: any;
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  patchParams: any;
  respondedValueState: any;
  setRespondedValueState: any;
  setLoaderInProgress: any;
  body: (
    onClose: VoidFunctionType,
    patchParams: any,
    offerPrice: any,
    respondedValueState: any,
    setRespondedValueState: any,
    setLoaderInProgress: any,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>
  ) => ReactJSXElement;
}

export interface UnRegisteredContactForm {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  openSuccessForm: VoidFunctionType;
  changeTheTitle: Dispatch<SetStateAction<string>>;
  getFarmName: (val: string) => void;
  stallionId: string;
  horseName: string;
  farmId: string;
  contactForm: boolean;
  selectedMareName?: any;
  body: (
    onClose: VoidFunctionType,
    openSuccessForm: VoidFunctionType,
    changeTheTitle: Dispatch<SetStateAction<string>>,
    getFarmName: (val: string) => void,
    stallionId: string,
    horseName: string,
    farmId: string,
    contactForm: boolean,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>,
    selectedMareName?: any
  ) => ReactJSXElement;
}

export interface UnregisteredSuccess {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  openRegister: VoidFunctionType;
  unregisteredSuccess: string;
  farmNameSelected: string;
  body: (
    onClose: VoidFunctionType,
    openRegister: VoidFunctionType,
    unregisteredSuccess: string,
    farmNameSelected: string,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>
  ) => ReactJSXElement;
}

export interface OpenNominationMessage {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  openNominationMessage: string;
  openAcceptOfferFunction: VoidFunctionType;
  nominationOfferData: NominationOfferProps;
  receipentNameVar: any;
  setPatchParams: Dispatch<SetStateAction<any>>;
  openOfferReceived: boolean;
  respondedValueState: any;
  setRespondedValueState: any;
  subject: any;
  loaderInProgress: any;
  setLoaderInProgress: any;
  setIsFileUpload: any;
  body: (
    onClose: VoidFunctionType,
    openNominationMessage: string,
    openAcceptOfferFunction: VoidFunctionType,
    nominationOfferData: NominationOfferProps,
    receipentNameVar: any,
    setPatchParams: Dispatch<SetStateAction<any>>,
    openOfferReceived: boolean,
    respondedValueState: any,
    setRespondedValueState: any,
    subject: any,
    loaderInProgress: any,
    setLoaderInProgress: any,
    setIsFileUpload: any,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>
  ) => ReactJSXElement;
}

export interface DeleteMessage {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  deleteFarmId: string;
  setSelected: VoidFunctionType;
  setSelectedTile: VoidFunctionType;
  apiStatus: boolean;
  setApiStatus: VoidFunctionType;
  apiStatusMsg: any;
  setApiStatusMsg: VoidFunctionType;
  body: (
    onClose: VoidFunctionType,
    deleteFarmId: string,
    setSelected: VoidFunctionType,
    setSelectedTile: VoidFunctionType,
    apiStatus: boolean,
    setApiStatus: VoidFunctionType,
    apiStatusMsg: any,
    setApiStatusMsg: VoidFunctionType,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>
  ) => ReactJSXElement;
}

export interface RestoreMessage {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  deleteRestoreId: string;
  setSelected: VoidFunctionType;
  setSelectedTile: VoidFunctionType;
  body: (
    onClose: VoidFunctionType,
    deleteRestoreId: string,
    setSelected: VoidFunctionType,
    setSelectedTile: VoidFunctionType,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>
  ) => ReactJSXElement;
}

export interface MessageSearchFarm {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  getSelectedFarm: (val: any) => void;
  messageFarmSearch: string;
  body: (
    onClose: VoidFunctionType,
    getSelectedFarm: (val: any) => void,
    messageFarmSearch: string,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>
  ) => ReactJSXElement;
}

export interface MessageNewFarm {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  subjectForMessage: string;
  newMessageForm: any;
  handleSelected: any;
  setMessageViewOptions: any;
  setMessageViewOptionsFiltered: any;
  setNewMessageCreated: any;
  setLoaderInProgress: any;
  body: (
    onClose: VoidFunctionType,
    subjectForMessage: string,
    newMessageForm: any,
    handleSelected: any,
    setMessageViewOptions: any,
    setMessageViewOptionsFiltered: any,
    setNewMessageCreated: any,
    setLoaderInProgress: any,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>
  ) => ReactJSXElement;
}

export interface AutoRenewel {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  promotionalId: string;
  stallionId: string;
  body: (
    onClose: VoidFunctionType,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>,
    promotionalId: string,
    stallionId: string
  ) => ReactJSXElement;
}

export interface UserAccessSuccessProps {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  userEmail: any;
  body: (onClose: VoidFunctionType, userEmail: string) => ReactJSXElement;
}

export interface UploadMareListProps {
  open: boolean;
  title: string;
  farmID: string;
  onClose: VoidFunctionType;
  body: (
    onClose: VoidFunctionType,
    Reset: boolean,
    setReset: React.Dispatch<React.SetStateAction<boolean>>,
    farmID: string,
    open?: boolean
  ) => ReactJSXElement;
}

export interface paymentModalProps {
  open: boolean;
  title: string;
  onClose: VoidFunctionType;
  resetPaymentModal: any;
  body: (title: string, onClose: VoidFunctionType, resetPaymentModal: any) => ReactJSXElement;
}

export type DialogProps =
  | LoginProps
  | RegistrationProps
  | StallionAnalyticsDialogProps
  | ConfirmDialogProps
  | OrderReportDialogProps
  | AddToLists
  | CookieDialogProps
  | CreatePasswordProps
  | LinkExpiredProps
  | ConfirmDialogProps
  | CookieDialogProps
  | StallionDialogProps
  | EditProfileProps
  | RegisterInterestProps
  | createStallionProps
  | openStallionPromoteProps
  | StallionPromoteProps
  | ConfirmStopNominationPromotion
  | RemoveStallion
  | UpdateServiceFee
  | AlreadyAvailablePromotion
  | HypomatingProps
  | BoostStallionProfileProps
  | ConfirmYourAccountProps
  | UserAccessProps
  | ActivateNomination
  | AddAFarm
  | UnRegisteredContactForm
  | UnregisteredSuccess
  | OpenNominationMessage
  | MessageSearchFarm
  | MessageNewFarm
  | NominationOffer
  | AcceptOffer
  | DeleteMessage
  | RestoreMessage
  | ForgotAndResetPasswordProps
  | ConfirmEditStallionProfile
  | AutoRenewel
  | UploadMareListProps
  | reportPopupProps
  | fileMediaProps
  | UserAccessSuccessProps
  | paymentModalProps;
