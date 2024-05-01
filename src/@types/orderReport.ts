import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { SxProps } from "@mui/material";
import React from "react";
import { VoidFunctionType } from "./typeUtils";

interface ProReportSchema1 {
    id: string;
    fullName: string;
    email: string;
    mare: string;
    stallionLocation: string;
    stallionStateId: number;
    isPrivateFee: any;
}

interface AffinityReportSchema2 {
    id: string;
    fullName: string;
    email: string;
    stallion: string;
    singleFarmAvailable: any;
    selectedFarms: any;
}

interface ShortListReportSchema3 {
    id: string;
    fullName?: string;
    email?: string;
    quantity: number;
    mareId: string;
    items: string[];
    productId: number;
    price: number;
    currencyId: number;
    stallionId: string;
}

interface ProReportSchema4 {
    id: string;
    fullName: string;
    email: string;
    mare: string;
    stallionLocation: string;
    stallionStateId: number;
    currency: string;
}

interface SalesCatalogueReportSchema5 {
    id: string;
    fullName: string;
    email: string;
    salesLocation: string;
    sale: string;
    selectedLots: any;
    saleStateId: any;
}

interface BroodmareSireReportSchema6 {
    id: string;
    fullName: string;
    email: string;
    mare: string;
    stallionLocation: string;
    stallionStateId: number;
}
export type OrderReportSchema = ProReportSchema1 | AffinityReportSchema2 | ShortListReportSchema3 |
    ProReportSchema4 | SalesCatalogueReportSchema5 | BroodmareSireReportSchema6

export interface OrderReportDialogProps {
    reportId: string;
    open: boolean;
    title: string;
    onClose: VoidFunctionType;
    openOther: VoidFunctionType;
    formId: string,
    currencyCode?: string,
    reportPrice?: any,
    reportCurrencyId?: any,
    reportCurrencySymbol?: any,
    cartInfo?: any,
    deleteResponse?: any,
    viewStallionsAnalysed?: boolean,
    setViewStallionsAnalysed?: any,
    body: (
        onClose: VoidFunctionType,
        openOther: VoidFunctionType,
        reportId: string,
        Reset: boolean,
        setReset: React.Dispatch<React.SetStateAction<boolean>>,
        formId: string,
        open:boolean,
        title?: string,
        currencyCode?: string,
        reportPrice?: any,
        reportCurrencyId?: any,
        reportCurrencySymbol?: any,
        cartInfo?: any,
        deleteResponse?: any,
        viewStallionsAnalysed?: boolean,
        setViewStallionsAnalysed?: any,
    ) => ReactJSXElement;
    maxWidth?: null;
    sx?: SxProps;
}