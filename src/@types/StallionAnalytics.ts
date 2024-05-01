import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { SxProps } from "@mui/material";
export interface Profile {
  id: string;
  src?: string;
  name?: string;
  location?: string;
  serviceFee?: string;
  currency?: string;
  nominationStatus: boolean;
  isPromoted: boolean;
  profileRating: string;
  yearToStud: string;
  expiryDate: string;
}
export interface Farm {
  id: string;
  name: string;
  approvalStatus: string;
  src: string;
}

export interface Message {
  timeStamp: string;
  sender: string;
  content: string;
}
export interface StallionDetails { 
  isPromoted: boolean;
  nominationStatus: boolean;
  profileRating: string;
}
export interface AnalyticsDetails {
  smSearches : string,
  type20Type20 : string,
  perfectMatches : string,
  pageViews : string,
  messages: string,
  nominations: string,
  noOfRunners: string,
  noOfWinners: string,
  winnersPerRunners:string,
  mfRunners: string,
  noOfStakesWinners : string,
  stakesWinnersPerRuns : string,
}
export type StallionProfileProps = {
  profile?: Profile;
  analyticsDetails?: AnalyticsDetails;
  stallionDetails?: StallionDetails;
};

export interface StallionAnalyticsDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  body: (onClose: () => void, Reset: boolean) => ReactJSXElement;
}
