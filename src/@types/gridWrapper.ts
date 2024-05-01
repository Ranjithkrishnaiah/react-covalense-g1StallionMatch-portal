import { SxProps } from '@mui/material';
import React from 'react';
import { NavigateFunction } from 'react-router'
import { number } from 'yup';
export interface Buttons {
    buttonText: string;
    buttonStyles: object;
    className: string;
  }

  export interface TableWrapperProps {
      title: string;
      isTrends?: boolean;
      dueDate?: any;
      tableHeaderClass?:string;
      setDueDate?:(arg0: any) => void;
      tableTitleClass?: string;
      farmID?: string;
      description?: string;
      descriptionClassName?: string;
      descriptionSx?: SxProps;
      children: React.ReactNode;
      buttons?: Buttons[];
      linkBtnText?: string;
      tableName?: string;
      showLinkBtn?: boolean;
      InviteBtnClassName?: string;
      InviteBtnText?: string;
      infoIconText?: string;
      userBtnText?: string;
      mareListsBtnText?: string;
      mareListsBtnClassName?: string;
      viewAllMareListsBtnText?: string;
      viewAllMarelistsBtnClassName?: string;
      userBtnClassName?: string;
      downloadBtnText?: string;
      downloadBtnLink?: string;
      dropdown?: boolean;
      dropdownOptions?: string[];
      defaultSelected?: string;
      datePicker?: boolean;
      navigate?: NavigateFunction;
      path?: string;
      userId?: string;
      userName?: string;
      buttonFunctionId?: number[];
      childClassName?: string;
      downloadBtnClassName?: string;
      bottomButtonClassName?: string;
      downloadBtnIcon?: string;
      InviteBtnIcon?: string;
      mareListsBtnIcon?: string;
      farmId?:string;
      farmName?:string;
      linkBtnIcon?:string;
      customSendToList?: NavigateFunction;
      customSendToUserLists?: NavigateFunction;
      customSendToMareLists?: NavigateFunction;
      setDefaultSelected?: React.Dispatch<React.SetStateAction<string>>
      isInviteUsers?:boolean;
  }

  export type Row = Record<any, any>
  // export interface Row  {
  //     id: string;
  //     src?: string;
  //     isPromoted?: boolean;
  //     horseName?: string;
  //     RNRS?: string;
  //     SW?: string;
  //     "SW/RNRS%"?: string;
  //     farm?: string;
  // }
  // export type Row =  any ;

  export interface TableProps {
    id?: number;
    columns: string[];
    displayColumns: string[];
    tableIdentifier: string,
    data?: Row[];
    hasAvatar: boolean;
    hascolumnDivider?: boolean;
    name?: string;
    src?: string;
    options?: string[];
    optionFunctionIndex?: number[];
    selectedOption?: any;
    farmId?: string;
    isFarmUser?: number;
  }