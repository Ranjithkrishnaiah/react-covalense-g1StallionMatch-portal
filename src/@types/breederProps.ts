export interface User {
    id: string;
    src: string;
    name: string;
    location: string;
}
export interface Farm  {
    farmId: string;
    farmName: string;
    isActive: boolean;
    profilePic: string;
  }
  
export interface Message {
    timestamp: string;
    timeStamp: string;
    farmName: string;
    subject: string;
    message: string;
    messageText: string;
    messageTitle: string;
    isRead: boolean;
    senderName: string;
    featureName: string;
  }

  export type ProfileProps = {
    user: User;
    farms: Farm[];
    messages: Message[];
    farm?: Farm;
    received?: number;
    sent?: number;
    nominations?: number;
    accessLevel?:any;
    isFarmOwner?:boolean;
  }