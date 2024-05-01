
export interface ReportItem {
    id: string;
    type: string;
    reportName: string;
    stallionCount: number;
    mareName: string;
    mareId: string;
    stallionList: string[];
    price: number;
    currency: string;
}

export interface PromoteStallion {
    id: string;
    type: string;
    farmName: string;
    // stallionCount: number;
    // stallionList: string[];
    expiryDate: Date;
    price: number;
    currency: string;
}

export interface LocalBoost {
    id: string;
    type: string;
    notificationId: string;
    price: number;
    currency: string;
    stallionId: string;
    stallionName: string;
}

export interface ExtendedBoost {
    id: string;
    type: string;
    notificationId: string;
    price: number;
    currency: string;
    stallionId: string;
    stallionName: string;
}

export interface Nomination {
    id: string;
    type: string;
    nominationId: string;
    stallionId: string;
    stallionName: string;
    mareId: string;
    mareName: string;
    price: number;
    currency: string;
}

export type ProductType = ReportItem | PromoteStallion | LocalBoost | ExtendedBoost | Nomination