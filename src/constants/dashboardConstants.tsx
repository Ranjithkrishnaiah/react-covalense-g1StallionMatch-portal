import { Images } from '../assets/images'
import * as Functions from '../utils/FunctionHeap'
//=====================================Table Wrapper Props ====================================

export const yourMareProps = {
    title: "Your Mares",
    buttons: [{ buttonText: "Order Report", buttonStyles: {},className: "icon-Document-text" },
              { buttonText: "Add", buttonStyles: { marginLeft: "10px" },className: "icon-Plus" }],
    linkBtnText:"Go to Your Mares",
    infoIconText:"Create a list of female horses that can be readily accessed for future searches, reports and real-time statistical updates.",
    childClassName: 'your-mare-box',
    buttonFunctionId:[4, 0],
    path: "mares-list",
}
export const favStallionProps = {
    title: "Your Favourite Stallions",
    buttons: [
        { buttonText: "Add", buttonStyles: {},className: "icon-Plus" }],
    linkBtnText:"Go to Your Favourite Stallions",
    infoIconText:"Create a roster of your favourite stallions and stay updated with frequently updated stats. This curated list of stallions will allow you to conveniently conduct searches whenever needed.",
    buttonFunctionId:[1],
    childClassName: 'common-dashboard-box',
    path: "favourite-stallions-list",
    
}

export const recentSearchProps = {
    title: "Your Recent Searches",
    childClassName: 'common-dashboard-box recent-search-box',
    buttons: [],
    linkBtnText:"",
    // options:["Search"],
}

export const favFarmProps = {
    title: "Your Favourite Farms",
    buttons: [{ buttonText: "Add", buttonStyles: {},className: "icon-Plus" }],
    linkBtnText:"Go to Your Favourite Farms",
    infoIconText:"Maintain a list of your preferred farms for quick access to their roster with just two clicks. Stay informed with the latest news and updates related to these farms, all in one convenient location.",
    buttonFunctionId:[3],
    path: "favourite-farms-list",
    childClassName: 'common-dashboard-box',
    options:["View Farm Profile", "Remove"],
}

export const favDamSireProps = {
    title: "Your Favourite Damsires",
    buttons: [
        { buttonText: "Add", buttonStyles: { marginLeft: "10px" },className: "icon-Plus" }],
    linkBtnText:"Go to Your Favourite Dam Sires",
    infoIconText:"Stay abreast of the latest global runners data by curating a list of dam sires. The significance of dam sires as a key factor in the success of pedigrees is increasingly recognised, and keeping track of them will keep you well-informed.",
    path: "favourite-damsires-list",
    buttonFunctionId:[2],
    options:["Remove"],
    childClassName: 'common-dashboard-box',
}

//==========================================Table Props=============================================


export const yourMareTableProps = {
    name: "Favourite Mares",
    columns: ["", ""],
    displayColumns: ["name", "n"],
    tableIdentifier: "EMPTY-COLUMN-NAMES-DASHBOARD",
    // data: [{ id: "0", src:"", name:"Tyranny", n:"" },
    //        { id: "1", src:"", name:"Tyranny", n:"" },
    //        { id: "2", src:"", name:"Tyranny", n:"" },
    //        { id: "3", src:"", name:"Tyranny", n:"" },
    //        { id: "4", src:"", name:"Tyranny", n:"" },],
    hasAvatar: true,
    options:["Search", "Remove"],
    optionFunctionIndex: [0,5]
}

export const favStallionTableProps = {
    name: "Favourite Stallions",
    columns: ["Horse","RNRS", "SW", "SW/RNRS%", ""],
    displayColumns: ["name", "RNRS", "SW", "swByRnrs", "n"],
    hascolumnDivider: true,
    tableIdentifier: "STALLION_SIRE DASHBOARD",
    // data: [{ id: "0", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },
    //        { id: "1", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },
    //        { id: "2", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },
    //        { id: "3", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },
    //        { id: "4", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },
    //        { id: "5", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },],
    hasAvatar: true,
    options:["Search", "Remove", "View Profile"],
    optionFunctionIndex: [0,5,1],
    childClassName: 'common-dashboard-box',
}

export const favFarmTableProps = {
    name: "Favourite Farms",
    columns: ["", ""],
    displayColumns:["name", "n"],
    tableIdentifier: "EMPTY-COLUMN-NAMES-DASHBOARD",
    // data: [{ id:"1", farm:"Coolmore", n:"" },
    //        { id:"2", farm:"Coolmore", n:"" },
    //        { id:"3", farm:"Coolmore", n:"" },],
    hasAvatar: true,
    options: ["View Farm Profile", "Remove"],
    optionFunctionIndex: [2,5],
    childClassName: 'common-dashboard-box',
}

export const recentSearchesTableProps = {
    name: "Recent Searches",
    columns: ["Search","Time", "Rating"],
    displayColumns:["searchName", "searchDate", "Rating"],
    hascolumnDivider: true,
    tableIdentifier: "RECENT-SEARCHES-DASHBOARD",
    // data: [{ id: "0", src:"", searchName:"Tyranny", "searchDate": "04/05/2022", PM: "4" },
    //        { id: "1", src:"", searchName:"Tyranny", "searchDate": "12/04/2022", PM: "4" },
    //        { id: "2", src:"", searchName:"Tyranny", "searchDate": "05/11/2021", PM: "4" },
    //        { id: "3", src:"", searchName:"Tyranny", "searchDate": "22/07/2021", PM: "4" },],
    hasAvatar: false,
    // options: ["Search"],
    // optionFunctionIndex: [0],
    // childClassName: 'myfav',    
}

export const favDamsireTableProps = {
    name: "Favourite Damsires",
    columns: ["Horse","RNRS", "SW", "SW/RNRS%", ""],
    displayColumns:["name", "RNRS", "SW", "swByRnrs", "n"],
    hascolumnDivider: true,
    tableIdentifier: "STALLION_SIRE DASHBOARD",
    // data: [{ id: "0", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },
    //        { id: "1", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },
    //        { id: "2", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },
    //        { id: "3", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },
    //        { id: "4", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },
    //        { id: "5", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },
    //        { id: "6", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },
    //        { id: "7", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },
    //        { id: "8", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },],
    hasAvatar: true,
    options:["Remove"],
    optionFunctionIndex: [5],
    childClassName:'myfav'  
}

export const caroselWrapperProps = {
    title: "Farm Media Feed",
    childClassName:"dashboardSlider",
    infoIconText:"After adding farms to Your Favourite Farms list, a personally tailored news feed related to these farms will be featured here."
}
const { Whiteruning, HomepageHeader } = Images;
const inputArr = [
    { id:"2", type:"img", src: Whiteruning, date: JSON.stringify(new Date()), name: "Black Thunder", description:"bla bla bla..." },
    { id:"3", type:"img", src: HomepageHeader, date: JSON.stringify(new Date()), name: "Aku K", description:"bla bla bla..." },
    { id:"4", type:"img", src: Whiteruning, date: JSON.stringify(new Date()), name: "Black Thunder", description:"bla bla bla..." },
    { id:"5", type:"img", src: HomepageHeader, date: JSON.stringify(new Date()), name: "Aku K", description:"bla bla bla..." },
    { id:"6", type:"img", src: Whiteruning, date: JSON.stringify(new Date()), name: "Black Thunder", description:"bla bla bla..." },
    { id:"7", type:"img", src: HomepageHeader, date: JSON.stringify(new Date()), name: "Aku K", description:"bla bla bla..." },
  ]

  export const caroselProps = {
    items: inputArr,
    slider: true,
    dots: true,
    arrows: true,
    mediaClassName: "show",
    noOfVisibleItems: 1,
    autoScroll: false,
    sliderOnItemClick: true,
    styles:{
      item:{},
      arrows:{
        top: "40%",
        width: "100%",
        display: "flex",
      },
      arrowLeft:{
          left: 0
      },
      arrowRight:{
          right: 0,
          marginLeft: 'auto'
      },
      cardContent:{}
    }
  }