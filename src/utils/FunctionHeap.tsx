import { convertNumberToWords, dateConvertDisplay, toPascalCase } from "./customFunctions";
import { NotificationsArray } from 'src/constants/ProfileConstants';
import { orderBy } from 'lodash'
const formatDate = (str: string) => {
  return `${str.split("").reverse().join("")
  .split("-").map((str: any) => str.split("").reverse().join(""))}`.replaceAll(",","/")
}

const removeHyperLinkFromString = (str:string) => {
  return str?.replace(/(<([^>]+)>)/gi, "")
}

const numberWithCommas =(x:any) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const createInformation = (oldValue : string, newValue: string, 
  attributeName: string, activityName: string,messageText:string) =>{
    // if(activityName && attributeName && newValue){
    //   if(newValue.length < 20) return `${activityName}d ${attributeName} to ${newValue}`
    //   return `${activityName}d ${activityName === 'Delete' || activityName === 'Create' ? '': attributeName}`
    // }
    // else if(activityName && attributeName) return `${activityName}d ${activityName === 'Delete' || activityName === 'Create' ? '': attributeName}`
    // return "has new updates"
    return `${removeHyperLinkFromString(messageText)}`
}

export const transformResponse = (entityArray: any[], type: string) : any[] => {
  let transformedArray: any = [];
  switch (type) {
    case 'FAV BROODMARE SIRES':
      entityArray?.map((damsire: any) => {
        const { horseId: id, horseName: name, rnrs, sw, swByRnrs:SWBYRN } = damsire;
        let RNRS = numberWithCommas(rnrs);
        let SW = numberWithCommas(sw);
        let swByRnrs = numberWithCommas(SWBYRN);
        transformedArray.push({ id, src: '', name, RNRS, SW, swByRnrs, n: '' });
      });
      return transformedArray;
    case 'FAV STALLIONS':
      entityArray?.map((stallion: any) => {
        const {
          stallionId: id,
          horseName: name,
          image: src,
          rnrs,
          sw,
          swByRnrs:SWBYRN,
          isPromoted: isPromoted
        } = stallion;
        let RNRS = numberWithCommas(rnrs);
        let SW = numberWithCommas(sw);
        let swByRnrs = numberWithCommas(SWBYRN);
        transformedArray.push({ id, name, src, RNRS, SW, swByRnrs, isPromoted, n: '' });
      });
      return transformedArray;
    case 'FAV FARMS':
      entityArray?.map((farm: any) => {
        const { farmId: id, farmName: name, image } = farm;
        transformedArray.push({ id, src: image, name, n: '' });
      });
      return transformedArray;
    case 'MY MARES':
      entityArray?.map((mare: any) => {
        const { horseId: id, horseName: name, yob: yearOfBirth, countryCode: countryCode } = mare;
        transformedArray.push({ id, src: '', name: `${ name + ' ' + '(' + yearOfBirth + ', ' + 'F' + ','+ countryCode + ')'}`, n: '' });
      });
      // console.log("Entry && Exit: ", transformedArray)
      return transformedArray;
    case 'RECENT SEARCHES':
      entityArray.map((search: any) => {
        const { stallionId, stallionName, mareName, createdOn, searchDate, mareId, matchResult} = search;
        let Rating = matchResult;
        transformedArray.push({id: `${stallionId}~${mareId}`, searchName: `${stallionName} X ${mareName}`,  searchDate: formatDate(createdOn.split('T')[0]), Rating})
      })
      return transformedArray;

    case 'SIMILAR-STALLIONS':
      entityArray.map((stallion: any) => {
        const { isPromoted, stallionId, horseName, similarTo, currencyCode, currencySymbol, fee, feeYear, profilePic, farmName, stateName: farmState, yob, countryCode } = stallion;
        transformedArray.push({isPromoted, stallionId, horseName, similarTo, currencyCode:currencyCode?.substring(0, 2), currencySymbol, fee, feeYear, profilePic, yob, farmName, farmState, countryCode})
      })
      return transformedArray;

    case 'POPULAR-STALLIONS':
    entityArray.map((stallion: any) => {
      const { isPromoted, stallionId, horseName, currencyCode, currencySymbol, fee, feeYear, profilePic, farmName, stateName: farmState, yob, countryCode } = stallion;
      transformedArray.push({ isPromoted, stallionId, horseName, currencyCode:currencyCode?.substring(0, 2), currencySymbol, fee, feeYear, profilePic, farmName, yob, stateName: farmState, countryCode })
    })
    return transformedArray;

    case 'COMPATIBLE-STALLIONS':
    entityArray.map((stallion: any) => {
      const { stallionId, horseName, withHorseName, farmName, countryName, stateName: farmState, profilePic, galleryImage, fee, feeYear, currencyCode, currencySymbol, isPromoted } = stallion;
      transformedArray.push({ isPromoted, stallionId, horseName, currencyCode:currencyCode?.substring(0, 2), currencySymbol, fee, feeYear, profilePic, farmName, yob: 1999, stateName: farmState, countryCode: countryName, galleryImage })
    })
    return transformedArray;

    case 'USER LIST':
      entityArray?.map((userList: any) => {
        const { invitationId: id, fullName: name, isAccepted, accessLevelId, email } = userList;
        let status = '';
        if (isAccepted) {
          status = 'Active';
        } else {
          status = 'Pending';
        }
        transformedArray.push({ id, src: '', name, email, status, accessLevel: accessLevelId, n: '' });
      });
      return transformedArray;

    case 'STALLION ACTIVITY':
      entityArray?.map((stallion: any) => {
        const { stallionId: id, stallionName: horseName, pageViews, searchCount, arrowFlag, profilePic:src, perfectMatches, ttMatches ,isPromoted,farmName,farmUuid} = stallion;
        
        let perfectt20Match = `${ttMatches ? ttMatches: 0}/${perfectMatches ? perfectMatches :0}`;
        let searches = searchCount ?numberWithCommas(searchCount) : 0;
        let pageviews = pageViews ?numberWithCommas(pageViews) :0;
        
        transformedArray.push({ id, src, horseName,searches, arrowFlag, pageviews, perfectMatch: perfectt20Match,isPromoted,farmName,farmUuid, n: '' });
      });
      return transformedArray;

    case 'BREEDER ACTIVITY':
      entityArray?.map((breeders: any) => {
        const { id, searches:ss, views:view, breederName : name, countryCode : location, profilePic:src, memberEmail, isFarmUser  } = breeders;
        let searches = numberWithCommas(ss);
        let views = numberWithCommas(view);
        transformedArray.push({ id, src,name, searches,views,location, memberEmail, isFarmUser, n: '' });
      });
      return transformedArray;

    case 'MARES LIST':
      entityArray?.map((maresList: any) => {
        const { mareListInfoId:id, listname : list, maresCount: count, uploadedOn:date } = maresList;
        transformedArray.push({ id, src: '',list,count: `Mares:${count}`,
        date : `Uploaded: ${formatDate((date.split('T')[0]))}`, n: '' });
      });
      return transformedArray;

    case 'MY STALLIONS LIST':
      entityArray?.map((myStallionList: any) => {
        //{ id: "0", src:"", name:"Tyranny", studFee:"AUS 22,000", status:"Active", expiry:"23.08.2022", autoRenew:{ disabled: true, checked: true }, n:"" },
        const {stallionId: id, horseName  : name, profilePic:src, fee: studFee, feeYear, currencyCode, expiryDate : expiry,isActive, isPromoted,isAutoRenew,stallionPromotionId } = myStallionList;
        const expiryDate= dateConvertDisplay(expiry,true);
        transformedArray.push({ id, src,name: toPascalCase(name),studFee, currencyCode:currencyCode?.substring(0, 2), feeYear, status: isActive ? 'Active' : 'Inactive',expiry: expiryDate,isAutoRenew:isAutoRenew,stallionPromotionId:stallionPromotionId,
        autoRenew:{ disabled:  isPromoted ? false : true, checked: isPromoted ? false : true }, n: '' });
      });
      return transformedArray;

      case 'RECENT-SEARCHES':
      entityArray?.map((recentSearchObj: any) => {
        const { isPromoted, mareName,mareId, stallionName, profilePic, mareCountryCode: countryCode, mareYob: yob, stallionId } = recentSearchObj;
        transformedArray.push({ stallionId, profilePic, stallionName, mareName,mareId, isPromoted, countryCode, yob });
      });
      return transformedArray;

      case 'USER-ACCESS':
      entityArray?.map((Obj: any) => {
        const { stallionId, stallionName } = Obj;
        transformedArray.push({ id: stallionId,  label: toPascalCase(stallionName)});
      });
      return transformedArray;

      case "Stallion-Shortlist-Report":
        entityArray?.map((Obj: any) => {
          const { stallionId: id, horseName: label } = Obj;
          transformedArray.push({id, label: toPascalCase(label), checked: false })
        })
      return transformedArray;

      case "SALES-CATALOG-REPORT":
        entityArray?.map((Obj: any) => {
          const { farmId: id, farmName: label } = Obj;
          transformedArray.push({id, label: toPascalCase(label), checked: false })
        })
      return transformedArray;

      case 'USER-ACCESS':
        entityArray?.map((Obj: any) => {
          const { stallionId: id, stallionName: label } = Obj;
          transformedArray.push({id, label: toPascalCase(label), checked: false })
        })
      return transformedArray;

      case 'STALLION-PRO-REPORT':
        entityArray?.map((Obj: any) => {
          const { stallionId: id, horseName: label ,farmName} = Obj;
          transformedArray.push({id, label: toPascalCase(label) + ' - ' + toPascalCase(farmName) , checked: false })
        })
      return transformedArray;

      case 'TRENDS-MOST-SEARCHED-STALLIONS':
        entityArray?.map((Obj: any) => {
          const { stallionId: id, stallionName: name, profilePic: src,isPromoted,stallionCount } = Obj;
          transformedArray.push({id, name: toPascalCase(name), src,isPromoted,stallionCount, n:""})
        })
      return transformedArray;

      case 'TRENDS-TOP-PERFORMING-STALLION':
        entityArray?.map((Obj: any) =>{
          const { stallionId: id, horseName: name, profilePic: src, currencySymbol, fee,isPromoted,stallionCount} = Obj;
          transformedArray.push({id, name, src, fee:`${currencySymbol}${fee?.toLocaleString()}`,isPromoted,stallionCount})
        })
        return transformedArray;

      case 'TRENDS-MOST-POPULAR-STALLION':
        entityArray?.map((Obj: any) =>{
          const { stallionId: id, horseName: name, profilePic: src, currencySymbol, fee,isPromoted,stallionCount} = Obj;
          transformedArray.push({id, name, src, fee:`${currencySymbol}${fee?.toLocaleString()}`,isPromoted,stallionCount})
        })
        return transformedArray;

      case 'TRENDS-MOST-POPULAR-DAMSIRE':
        entityArray?.map((Obj: any) =>{
          const { horseUuid: id, horseName: name, profilePic: src, sireName, damName} = Obj;
          transformedArray.push({id, name, src, sireName, damName})
        })
        return transformedArray;
      case "PROFILE-NOTIFICATIONS":
        entityArray?.map((notification: any) =>{
          const { notificationTypeId:id, notificationTypeName: type, isActive} = notification;
          transformedArray.push({id, type, isActive})
        })
        transformedArray = orderBy(transformedArray, 'id', 'asc')
        return transformedArray;
      case "TRENDS-MOST-MATCHED-DAMSIRES":
        entityArray?.map((Obj: any) =>{
          const { horseUuid: id, horseName: name, profilePic: src} = Obj;
          transformedArray.push({id, name, src, n:""})
        })
        return transformedArray;
      case "TRENDS-MOST-MATCHED-SIRES":
        entityArray?.map((Obj: any) =>{
          let pp = Number(Obj?.Perc).toFixed(2);
          const { StallionUuid: id, horseName: name,TotalRunners:RNRS,TotalStakeWinners:SW,isPromoted,stallionCount} = Obj;
          transformedArray.push({id, name, RNRS,SW,Perc:pp,isPromoted,stallionCount, n:""})
        })
        return transformedArray;
      case "TOP-10-PERFECT-MATCH-MATCHED-SIRES":
        entityArray?.map((Obj: any) =>{
          let pp = Number(Obj?.Perc).toFixed(2);
          const { StallionUuid: id, horseName: name,TotalRunners:RNRS,TotalStakeWinners:SW,isPromoted,stallionCount} = Obj;
          transformedArray.push({id, name, RNRS,SW,Perc:pp,isPromoted,stallionCount, n:""})
        })
        return transformedArray;
      case "TRENDS-TOP-MATCHED-BROODMARESIRES":
        entityArray?.map((Obj: any) =>{
          let pp = Number(Obj?.Perc).toFixed(2);
          const { horseUuid: id, horseName: name,TotalRunners:RNRS,TotalStakeWinners:SW} = Obj;
          transformedArray.push({id, name, RNRS,SW,Perc:pp, n:""})
        })
        return transformedArray;
      case "TOP-10-PERFECT-MATCH-BROODMARESIRES-SIRES":
        entityArray?.map((Obj: any) =>{
          let pp = Number(Obj?.Perc).toFixed(2);
          const { horseUuid: id, horseName: name,TotalRunners:RNRS,TotalStakeWinners:SW} = Obj;
          transformedArray.push({id, name, RNRS,SW,Perc:pp, n:""})
        })
        return transformedArray;
      case 'TRENDS-FARM-ACTIVITY':
        entityArray?.map((Obj: any) =>{
          const { auditId: id, farmName, profilePic: src, oldValue, newValue, attributeName, activityName, createdOn:timeStamp,messageText,farmActivityId} = Obj;
          transformedArray.push({id, farmName, src, timeStamp, information: createInformation(oldValue, newValue, attributeName, activityName,messageText),farmActivityId})
        })
        return transformedArray;
      case 'STAKES-PROGENY':
          entityArray.map((Obj: any) => {
            const { horseName,yob, g1, g2, g3, listed  } = Obj;
            transformedArray.push({horseName, yob: yob ? yob : 'N/A', g1: g1 ? g1 : 0, g2: g2 ? g2 : 0, g3: g3 ? g3 : 0, listed: listed ? listed : 0})
          })
          return transformedArray;
      case 'STALLION_PAGE':
       entityArray.map((Obj: any) => {
              const { age, starts, first, second, third, fourth } = Obj;
              transformedArray.push({
                age : age ? (age === 'Total' ? 'Total': convertNumberToWords(age)) : '-',
                starts: starts ? starts: '-',
                first: first ? first : '-',
                second: second ? second : '-',
                third: third ? third : '-',
                fourth: fourth ? fourth : '-',
                
              });
            });
            return transformedArray;
        } 
  return transformedArray;
};

export const capitalizeCountry = (str: any) : any => {
  if(typeof(str) === 'string'){
    if(str.includes('(')  && str[str.length-1] === ')'){
      let string = str.slice(0,str.length-6);
      // console.log("STR: ",', ' + str.split('(')[1].split(',')[1].toUpperCase() + ', ' + str.split('(')[1].split(',')[2].replace(')','').toUpperCase() + ')')
      return string + str.split('(')[1].split(',')[1].toUpperCase() + ', ' + str.split('(')[1].split(',')[2].replace(')','').toUpperCase() + ')';
    }
  }
  
  return str
}

export const InsertCommas = (fee : any) => {
  if(fee){
    let tempFee = fee.toString();

    let nStr = tempFee+'';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }
  return fee;
}
