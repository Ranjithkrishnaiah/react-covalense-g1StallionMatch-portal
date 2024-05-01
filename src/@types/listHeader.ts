import React from 'react';

export interface Buttons {
    buttonText: string;
    buttonStyles: object;
    className: string;
    type?: string;
    downloadBtnLink?: string;
    downloadClassName?: string;
  }
export interface ListHeaderProps {
    title: string;
    buttons: Buttons[];
    buttonFunctionId:number[],
    dropdownList?: string[];
    farmId?: string;
    farmName?: string;
    setSortBy?: React.Dispatch<React.SetStateAction<string>>
}