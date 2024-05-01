import React from "react";
import { VoidFunctionType } from "./typeUtils";

export interface ReportCardProps {
  id: string;
  src: string;
  title: string;
  price: string;
  currencyId: string;
  description: string;
  reportUrl: string;
  buttonText :any;
  show: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenPdf?: any;
  formId: string;
  orderPrice?: string;
  currencyCode?: string;
  currencySymbol?: string;
  selectedReportId?: any;
  cartInfo: any;
  deleteResponse :any;
}