import React from 'react';
import { isFuture, isSameDay, isSameMonth, sub, add } from 'date-fns';
import { SxProps, Theme } from '@mui/material/styles';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import format from 'date-fns/format';
// import { fromPairs } from 'lodash';

/** This folder contains functions that could be reused accross multiple modules
 * Any new function added to this folder must be listed in the comment below by
 * describing its functionality in a single line while the detailed description
 * must be provided above the function before writing the function definition.
 *
 * List
 *
 * 1. makeObjectArrayFromArrays: Generate Object Array from 2 given arrays
 */

//This allows to build one-to-one mapping between between related variables brought from different locations
export const makeObjectArrayFromArrays = (arr1: string[], arr2: any[]) => {
  if (arr1.length !== arr2.length) {
    // console.log('Arrays must be of same length');
    return;
  } else {
    let CombinedArrayOfObjects = [];
    for (let i: number = 0; i < arr1.length; i++) {
      let obj = new Object({ [arr1[i]]: arr2[i] });
      CombinedArrayOfObjects.push(obj);
    }
    return CombinedArrayOfObjects;
  }
};

//functionName, reducerPath, baseUrl, tagType are strings
//callTypes is an object with specific parameters
/**
 * callTypes = {
 *  getMethod: {
 *  name: countries
 *  getResponseType: responseType,
 *  getRequestType: requestType,
 *  getUrl: api.countriesUrl,
 * }
 *
 * }
 */

type GetMethodsObject = {
  name: string | number | symbol;
  params: any;
  Url: string;
  cachePeriod: number;
};

type PostMethodObject = {
  name: string | number | symbol;
  body: object;
  method: 'POST' | 'PUT' | 'DELETE' | undefined;
  Url: string;
};

type GetFunctionObject = {
  reducerPath: string;
  baseUrl: string;
  providerTag: string;
  queryType: GetMethodsObject;
  invalidateTag: string;
  mutationType: PostMethodObject;
};

// type PostFunctionObject = {
//   reducerPath: string;
//   baseUrl: string;
//   invalidateTag: string;
//   mutationType: PostMethodObject;
// };

export const reduxRtkHOF = ({
  reducerPath,
  baseUrl,
  providerTag,
  queryType,
  invalidateTag,
  mutationType,
}: GetFunctionObject) => {
  const getURL = queryType.Url;
  const getParams = queryType.params;
  return createApi({
    reducerPath: reducerPath,
    baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
    tagTypes: [providerTag || invalidateTag],
    endpoints: (build) => ({
      [queryType.name]: build.query<any, void>({
        query: () => ({
          url: getURL,
          params: getParams,
        }),
        keepUnusedDataFor: queryType.cachePeriod, //Keeps country data valid for an year
        providesTags: (result, error) => [{ type: providerTag }],
      }),
      [mutationType.name]: build.mutation<any, void>({
        query: (body) => ({
          url: mutationType.Url,
          method: mutationType.method,
          body: body,
        }),

        invalidatesTags: [invalidateTag],
      }),
    }),
  });
};

// export const reduxRtkMutationHOF = ({ reducerPath, baseUrl, invalidateTag, mutationType}: PostFunctionObject) => {

//     return  createApi({
//             reducerPath: reducerPath,
//             baseQuery: fetchBaseQuery({ baseUrl: baseUrl}),
//             tagTypes: [invalidateTag],
//             endpoints: (build) => ({
//                  [mutationType.name]: build.mutation<any,void>({
//                     query: body => ({
//                         url: mutationType.Url,
//                         method: mutationType.method,
//                         body: body
//                     }),

//                     invalidatesTags: [invalidateTag]
//                 })
//             })
//         })
// }

// createApi({
//     reducerPath: "countriesApi",
//     baseQuery: fetchBaseQuery({ baseUrl: api.baseUrl}),
//     tagTypes: ['Country'],
//     endpoints: (build) => ({
//         countries: build.query<Countries[],void>({
//             query: () => api.countriesUrl,
//             keepUnusedDataFor: 60*60*24*365, //Keeps country data valid for an year
//             providesTags: (result, error) => [{type: 'Country'}],
//         })
//     })
// })

// export const { useCountriesQuery } = countriesApi;

export const scrollToTop = () => {
  setTimeout(() => {
    window.scrollTo(1, 0);
  }, 500);
};

export const dataGridTableStyles = (
  tableIdentifier: string,
  index: number | undefined,
  lastColumn: number
) => {
  //======== This is Specific Styling corresponding to data of different Grid Tables=====
  const notLastRowCondition = typeof index === 'number' && index < lastColumn - 1;

  const indexzero: SxProps<Theme> | undefined = {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '1rem',
  };

  const lastIndex: SxProps<Theme> | undefined = {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const mareListsLastIndex: SxProps<Theme> | undefined = {
    display: 'block',
    width: '40px',
  };

  const secondIndex: SxProps<Theme> | undefined = {
    paddingRight: '5px',
  };

  const mareListsFirstIndex: SxProps<Theme> | undefined = {
    display: 'block',
    marginRight: '-3px',
  };

  const commonForList: SxProps<Theme> | undefined = {
    display: 'flex',
    alignItems: 'center',
    background: '#F4F1EF',
  };

  const listLastColumnCell: SxProps<Theme> | undefined = {
    justifyContent: 'center',
    borderTopRightRadius: '8px',
    borderBottomRightRadius: '8px',
  };

  const listFirstColumnCell: SxProps<Theme> | undefined = {
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px',
  };

  const rowSx: SxProps<Theme> | undefined = {
    display: 'flex',
    borderRadius: '8px',
    background: '#F4F1EF',
    padding: '0.5%',
    justifyContent: 'space-between',
  };

  const MareListIndexZero: SxProps<Theme> | undefined = {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '1rem',
    fontSize: '16px',
    color: '#161716 ',
    fontFamily: 'Synthese-Regular',
    letterSpacing: '-0.01em',
  };

  switch (tableIdentifier) {
    case 'DASHBOARD':
      return {
        lg: index === 0 ? 4 : 2,
        xs: index === 0 ? 4 : 2,
        sx: index === 0 ? indexzero : index === lastColumn - 1 ? lastIndex : undefined,
        className: 'List-content',
        notLastColumn: notLastRowCondition,
        columnRowClassName: 'List-title',
      };

    case 'STALLION_SIRE DASHBOARD':
      return {
        lg: index === 0 ? 5 : index !== 4 ? 2 : 1,
        xs: index === 0 ? 5 : index !== 4 ? 2 : 1,
        sx: index === 0 ? indexzero : index === lastColumn - 1 ? lastIndex : undefined,
        className: 'List-content',
        notLastColumn: notLastRowCondition,
        columnRowClassName: 'List-title',
      };

    case 'LIST':
      return {
        lg: index === 0 ? 4 : 2,
        xs: index === 0 ? 4 : 2,
        sx:
          index === 0
            ? { ...commonForList, ...indexzero, ...listFirstColumnCell }
            : index === lastColumn - 1
            ? { ...commonForList, ...listLastColumnCell }
            : commonForList,
        className: 'List-content',
        notLastColumn: notLastRowCondition,
        // rowSx: rowSx,
        columnRowClassName: 'SPracerecord',
      };

    case 'STALLION_PAGE':
      return {
        lg: 2,
        xs: 2,
        sx: index === 0 ? { paddingLeft: 2 } : undefined,
        className: index === lastColumn - 1 ? 'SPracerecordTotal' : 'SPracerecordCount',
        notLastColumn: true,
        columnRowClassName: 'SPracerecord',
      };
    case 'STAKES-PROGENY':
      return {
        lg: 2,
        xs: 2,
        sx: index === 0 ? { paddingLeft: 2 } : undefined,
        className: 'SPracerecordCount',
        notLastColumn: true,
        columnRowClassName: 'SPracerecord',
      };
    case 'FD-USERLIST':
      return {
        lg: index === 0 ? 4 : 2,
        xs: index === 0 ? 4 : 2,
        sx: index === 0 ? indexzero : index === lastColumn - 1 ? lastIndex : undefined,
        className: 'List-content',
        notLastColumn: notLastRowCondition,
        rowSx: rowSx,
        columnRowClassName: 'SPracerecord',
      };
    case 'MY-STALLIONS':
      return {
        lg: index === 0 ? 3 : index !== lastColumn - 1 ? 2 : 1,
        xs: index === 0 ? 3 : index !== lastColumn - 1 ? 2 : 1,
        sx:
          index === 0
            ? { ...commonForList, ...indexzero, ...listFirstColumnCell }
            : index === lastColumn - 1
            ? { ...commonForList, ...listLastColumnCell }
            : commonForList,
        className: 'List-content ',
        notLastColumn: notLastRowCondition,
        rowSx: rowSx,
        columnRowClassName: 'SPracerecord listTablehead',
      };
    case 'LIST-USERLIST':
      return {
        lg: index === 1 ? 4 : 2,
        xs: index === 1 ? 4 : 2,
        sx:
          index === 1
            ? { ...commonForList, ...indexzero, ...listFirstColumnCell }
            : index === lastColumn - 1
            ? { ...commonForList, ...listLastColumnCell }
            : commonForList,
        className: 'List-content user-list-table-wrp',
        notLastColumn: notLastRowCondition,
        rowSx: rowSx,
        columnRowClassName: 'SPracerecord',
      };
    case 'EMPTY-COLUMN-NAMES-DASHBOARD':
      return {
        lg: index === 0 ? 10 : 2,
        xs: index === 0 ? 10 : 2,
        sx: index === 0 ? indexzero : index === lastColumn - 1 ? lastIndex : undefined,
        className: 'List-content',
        notLastColumn: notLastRowCondition,
        columnRowClassName: 'List-border',
      };
    case 'EMPTY-COLUMN-NAMES-DASHBOARD-REPORTS-ORDERED':
      return {
        lg: index === 0 ? 10 : 2,
        xs: index === 0 ? 10 : 2,
        sx: index === 0 ? indexzero : index === lastColumn - 1 ? lastIndex : undefined,
        className: 'List-content',
        notLastColumn: notLastRowCondition,
        columnRowClassName: 'List-border',
      };
    case 'EMPTY-COLUMN-NAME-LIST':
      return {
        lg: index === 0 ? 4 : 2,
        xs: index === 0 ? 4 : 2,
        sx:
          index === 0
            ? { ...commonForList, ...indexzero, ...listFirstColumnCell }
            : index === lastColumn - 1
            ? { ...commonForList, ...listLastColumnCell }
            : commonForList,
        className: 'List-content mare-list-table-wrp',
        notLastColumn: notLastRowCondition,
        rowSx: rowSx,
        columnRowClassName: 'List-border',
      };
    case 'RECENT-SEARCHES-DASHBOARD':
      return {
        lg: index === 0 ? 6 : 3,
        xs: index === 0 ? 6 : 3,
        sx: index === 0 ? indexzero : undefined,
        className: 'List-content',
        notLastColumn: true,
        columnRowClassName: 'List-border',
      };
    case 'EMPTY-COLUMN-NAMES-DASHBOARD-MARELISTS':
      return {
        lg: index === 0 ? 6 : 2,
        xs: index === 0 ? 6 : 2,
        sx:
          index === 0
            ? MareListIndexZero
            : index === 1
            ? mareListsFirstIndex
            : index === lastColumn - 1
            ? mareListsLastIndex
            : index === 2
            ? secondIndex
            : undefined,
        className: 'List-content',
        notLastColumn: notLastRowCondition,
      };
    case 'EMPTY-COLUMN-NAMES-MARE-LIST':
      return {
        lg: index === 0 ? 4 : 2,
        xs: index === 0 ? 4 : 2,
        sx:
          index === 0
            ? { ...commonForList, ...indexzero, ...listFirstColumnCell }
            : index === lastColumn - 1
            ? { ...commonForList, ...listLastColumnCell }
            : commonForList,
        className: 'List-content mare-list-table-wrp',
        notLastColumn: notLastRowCondition,
        rowSx: rowSx,
        columnRowClassName: 'List-border',
      };
  }
};

export const tableStyles = () => {};

export const timer = (eventUTCTimeStamp: number) => {
  const MINUTE = 60 * 1000;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const WEEK = 7 * DAY;
  const MONTH = 30 * DAY;
  const YEAR = 365 * DAY;
  const localTime = Date.now() - new Date().getTimezoneOffset() * 60 * 1000;
  const timeDifference = localTime - eventUTCTimeStamp;

  const showPeriod = (difference: number) => {
    let output = null;

    if (difference / DAY >= 1 && difference / WEEK < 1) {
      output =
        Math.floor(difference / DAY) === 1
          ? '1 day ago'
          : Math.floor(difference / DAY) + ' days ago';
    } else if (difference / DAY >= 7 && difference / DAY < 30) {
      output =
        Math.floor(difference / WEEK) === 1
          ? '1 week ago'
          : Math.floor(difference / WEEK) + 'weeks ago';
    } else if (difference / MONTH >= 1 && difference / MONTH < 12) {
      output =
        Math.floor(difference / MONTH) === 1
          ? '1 month ago'
          : Math.floor(difference / MONTH) + ' months ago';
    } else if (difference / MONTH >= 12) {
      output =
        Math.floor(difference / YEAR) === 1
          ? '1 year ago'
          : Math.floor(difference / YEAR) + ' years ago';
      // console.log('D: ', Math.floor(difference / YEAR), output);
    } else if (difference / DAY < 1) {
      if (difference / HOUR >= 1) {
        output =
          Math.floor(difference / HOUR) === 1
            ? '1 hour ago'
            : Math.floor(difference / HOUR) + ' hours ago';
      } else if (difference / MINUTE >= 1) {
        output =
          Math.floor(difference / MINUTE) === 1
            ? '1 minute ago'
            : Math.floor(difference / MINUTE) + ' minutes ago';
      } else output = 'Just Now';
    }
    return output;
  };
  return showPeriod(timeDifference);

  // console.log("LO: ", localTime, localTime - eventUTCTimeStamp)
};
type DateRange = [number | null, number | null];
export function useDatePicker({ date }: { date: DateRange }) {
  const [dueDate, setDueDate] = React.useState<DateRange>([date[0], date[1]]);
  const [openPicker, setOpenPicker] = React.useState(false);
  const startTime = dueDate[0] || '';
  const endTime = dueDate[1] || '';

  const isSameDays = isSameDay(new Date(startTime), new Date(endTime));
  const isSameMonths = isSameMonth(new Date(startTime), new Date(endTime));

  const handleChangeDueDate: any = (newValue: DateRange) => {
    setDueDate(newValue);
  };

  const handleOpenPicker = () => {
    setOpenPicker(true);
  };

  const handleClosePicker = () => {
    setOpenPicker(false);
  };

  return {
    dueDate,
    startTime,
    endTime,
    isSameDays,
    isSameMonths,
    onChangeDueDate: handleChangeDueDate,
    openPicker,
    onOpenPicker: handleOpenPicker,
    onClosePicker: handleClosePicker,
  };
}

// const result = timer(Date.now() - new Date().getTimezoneOffset()*60*1000-15*31*24*60*60*1000);

export function prepareHeaders() {
  const accessToken = localStorage.getItem('accessToken');
  if(accessToken && accessToken !== null)
    return { Authorization: `Bearer ${accessToken}` };
}

// Return query param value by query string name
export function getQueryParameterByName(name: any) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// Prepare API Query for RTK
export function prepareAPIQuery(
  apiUrl: any,
  apiName: any,
  params: any,
  isAuthTokenRequired = false
) {
  const queryParams: any = {
    url: `${apiUrl}${apiName}`,
    params: params,
  };
  if (isAuthTokenRequired) {
    queryParams.headers = prepareHeaders();
  }
  return queryParams;
}

// Prepare API Mutation for RTK
export function prepareAPIMutation(
  apiUrl: any,
  apiName: any,
  params: any,
  method: any,
  payload = {},
  isAuthTokenRequired = false
) {
  const queryParams: any = {
    url: `${apiUrl}${apiName}`,
    params: params,
    method: method,
    body: payload,
  };
  
  if (isAuthTokenRequired) {
    queryParams.headers = prepareHeaders();
  }
  return queryParams;
}

//Converting date to required format
export const dateConvert: any = (str: any) => {
  if (str) {
    const result = format(new Date(str), 'yyyy-MM-dd');
    return result;
  }

  // var date = new Date(str),
  //   mnth = ("0" + (date.getMonth() + 1)).slice(-2),
  //   day = ("0" + date.getDate()).slice(-2);
  // return [day,mnth,date.getFullYear()].join("-");
};

export const dateConvertDisplay: any = (str: any, isDotted = false) => {
  // console.log("Date: ", str)
  if (isDotted) {
    const result = format(new Date(str), 'dd.MM.yyyy');
    return result;
  }

  const result = format(new Date(str), 'dd-MM-yyyy');
  return result;
  // var date = new Date(str),
  //   mnth = ("0" + (date.getMonth() + 1)).slice(-2),
  //   day = ("0" + date.getDate()).slice(-2);
  // return [day,mnth,date.getFullYear()].join("-");
};

export const timeToDateConvert: any = (str: any) => {
  const result = format(new Date(str), 'dd/MM/yy');
  return result;
};

export function getLastWeek() {
  let lastWeek = sub(new Date(), {
    weeks: 1,
  });
  return lastWeek;
}

export function getNextWeek() {
  let lastWeek = add(new Date(), {
    weeks: 1,
  });
  return lastWeek;
}

export function isToday(value: any) {
  let today = format(new Date(), 'dd-MM-yyyy') === format(new Date(value), 'dd-MM-yyyy');
  return today;
}

export function isStartDateInFuture(value: any) {
  let result = isFuture(new Date(value));
  return result;
}

export function getLastFourWeek() {
  let result = sub(new Date(), {
    weeks: 4,
  });
  return result;
}

export function getLastMonth() {
  let result = sub(new Date(), {
    months: 1,
  });
  return result;
}

export function parseDate(dateToParse: string) {
  const result = format(new Date(dateToParse), 'dd/MM/yyyy');
  return result;
}

export function getDateForMessage(date: string) {
  const result = format(new Date(date), 'dd MMM yyyy');
  return result;
}

export function toPascalCase(sentence: string | number | undefined) {
  if (typeof sentence === 'string')
    return sentence
      .split(' ')
      .map((word: string) =>
        word
          .split('')
          .map((character: string, index: number) =>
            index === 0 ? character.toUpperCase() : character.toLowerCase()
          )
          .join('')
      )
      .join(' ');
  else if (typeof sentence === 'number') {
    return sentence;
  }
  return undefined;
}

export function toTitleCase(sentence: string | number | undefined) {
  if (typeof sentence === 'string') {
    return sentence.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  } else if (typeof sentence === 'number') {
    return sentence;
  }
  return undefined;
}

export function getNumberWithOrdinal(n: number) {
  var s = ['th', 'st', 'nd', 'rd'],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
export function convertNumberToWords(n: any) {
  var converter = require('number-to-words');
  return toPascalCase(converter.toWords(n));
}

export function convertNumberToOrdinal(n: any) {
  var converter = require('number-to-words');
  return toPascalCase(converter.toOrdinal(n));
}

export function isObjectEmpty(value: any) {
  return (
    Object.prototype.toString.call(value) === '[object Object]' && JSON.stringify(value) === '{}'
  );
}

export const dateHypenConvert: any = (str: any) => {
  if (str) {
    const result = format(new Date(str), 'yyyy-MM-dd');
    return result;
  }
};

export function fullFormatDateMonthYear(inputDate: string): string {
  const [day, month, year] = inputDate.split("/");
  const date = new Date(`${year}-${month}-${day}`);

  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const formatter = new Intl.DateTimeFormat('en-US', options);

  const formattedParts = formatter.formatToParts(date);
  const formattedDay = formattedParts.find(part => part.type === 'day')?.value || ''; // Use optional chaining
  const formattedMonth = formattedParts.find(part => part.type === 'month')?.value || ''; // Use optional chaining
  const formattedYear = formattedParts.find(part => part.type === 'year')?.value || ''; // Use optional chaining

  return `${formattedDay} ${formattedMonth}, ${formattedYear}`;
}

export function startOfMonth() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const startOfMonth = new Date(currentYear, currentMonth, 1);
  return startOfMonth;
}

export function startOfYear() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  return startOfYear;
}

export function startOfWeek() {
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();
  const startOfWeek = new Date(currentDate);  
  return startOfWeek.setDate(currentDate.getDate() - dayOfWeek);
}