import { Images } from '../assets/images'
//=====================================Table Wrapper Props ====================================

export const userListProps = {
    title: "User List",
    dropdown : true,
    dropdownOptions:["Name", "Active","Pending", "Access Level"],
    //linkBtnText:"View all Users",
    userBtnText: "View all Users",
    userBtnClassName:"viewallUsersButton",
    userBtnLink:"users-list",
    bottomButtonClassName: "buttonBottommwrp",
    InviteBtnClassName:"buttonGlobal",
    InviteBtnText:"Invite a New User",
    InviteBtnIcon: "icon-Plus",
    path: "users-list",
    defaultSelected:"Active",
    childClassName: 'common-dashboard-box userlist-dashboard-box',
}
export const breederActivityProps = {
    title: "Breeder Activity",
    dropdown : true,
    dropdownOptions:["Name", "Searches", "Views", "Location"],
    linkBtnText:"Go to Breeder Report",
    path: "breeder-report",
    defaultSelected:"Name",
    childClassName: 'common-dashboard-box breederactivity-dashboard-box',
}
export const stallionActivityProps = {
    title: "Stallion Activity",
    dropdown : true,
    dropdownOptions:["Name", "Searches", "Page Views", "20/20 Matches", "Perfect Matches"],
    linkBtnText:"My Stallions",
    path: "stallions",
    defaultSelected:"Name",
    childClassName: 'common-dashboard-box stallionactivity-dashboard-box',
    
}

export const stallionMatchActivityProps = {
    title: "Stallion Match Activity",
    childClassName: 'stallionMatchActvityBox',
    buttons: [
        { buttonText: "Full Screen", buttonStyles: {},className: "icon-Arrows-expand" }],
        buttonFunctionId:[7],
}
export const reportsOrderedProps = {
    title: "Reports Ordered",
    childClassName: 'report-order-box',
    linkBtnText:"Go to Reports",
    linkBtnClassName:'GotoReports',
    path: "/reports",
    description : `View/download previous reports ordered for your farm. 
    Individual reports ordered are accessible via your profile page.`,
    descriptionSx:{ paddingX:'1.5rem' },
    descriptionClassName:"report-order-description"
}

export const mareListProps = {
    title: "Mare List",
    dropdown : true,
    dropdownOptions:["Name", "Date", "Number of Mares"],
    downloadBtnText: "Download Template",
    downloadBtnClassName: "downLoadTemplateButton",
    downloadBtnLink:"https://dev-stallionmatch.imgix.net/media/files/marelist/template.csv",
    viewAllMarelistsBtnClassName: "viewallUsersButton",
    mareListsBtnText:"Add a new Mare List",
    viewAllMareListsBtnText:"View all Lists",
    linkBtnClassName:'buttonGlobalOutline',
    path: "my-mares-list",
    bottomButtonClassName: "",
    downloadBtnIcon: "icon-Download",
    mareListsBtnIcon: "icon-Plus",
    defaultSelected:"Date",
    childClassName: 'common-dashboard-box marelist-dashboard-box',
}


//==========================================Table Props=============================================
/**
 *  optionFunctions = [ goToSearch, goToStallionPage, goToFarmPage, editMareList, 
 * downloadMareList, Remove, sendMessageToBreeder, goToStallionReport ];

 */
export const userListTableProps = {
    tableIdentifier:"FD-USERLIST",
    columns: ["Name","Status", "Access Level",""],
    displayColumns:["name", "status", "accessLevel", "n"],
    name: 'User List',
    hascolumnDivider: true,
    data: [{ id: "0", src:"", name:"Tyranny", status: "Active ", accessLevel:"Full Access", n:"" },
           { id: "1", src:"", name:"Tyranny", status: "Active ", accessLevel:"Full Access", n:"" },
           { id: "2", src:"", name:"Tyranny", status: "Active ", accessLevel:"3rd Party", n:"" },
           { id: "3", src:"", name:"Tyranny", status: "Active ", accessLevel:"View Only", n:"" },
           { id: "4", src:"", name:"Tyranny", status: "Active ", accessLevel:"View Only", n:"" },
          ],
    hasAvatar: true,
    options:["Remove","Resend"],
    optionFunctionIndex:[5,8]
}

export const breederActivityTableProps = {
    tableIdentifier: "DASHBOARD",
    name: "Breeder Activity",
    columns: ["Breeder","Searches", "Views", "Location", ""],
    displayColumns:["name", "searches", "views", "location", "n"],
    hascolumnDivider: true,
    // data: [{ id: "0", src:"", breeder:"Tyranny", searches: "8", views: "4", location:"VIC", n:"" },
    //        { id: "1", src:"", breeder:"Tyranny", searches: "8", views: "4", location:"VIC", n:"" },
    //        { id: "2", src:"", breeder:"Tyranny", searches: "8", views: "4", location:"VIC", n:"" },
    //        { id: "3", src:"", breeder:"Tyranny", searches: "8", views: "4", location:"VIC", n:"" },
    //        { id: "4", src:"", breeder:"Tyranny", searches: "8", views: "4", location:"VIC", n:"" },
    //       ],
    hasAvatar: true,
    options:["Message Breeder"],
    optionFunctionIndex:[6]
}


export const stallionActivityTableProps = { 
     tableIdentifier: "DASHBOARD",
     name: "My Stallions",
     dropdown :  true,
     columns: ["Horse","Searches", "Page views", "20/20/PM", ""],
     hascolumnDivider: true,
     displayColumns:["horseName", "searches", "pageviews", "perfectMatch", "n"],
    //  data: [{ id: "0", src:"", horseName:"Tyranny", searches: "8", pageviews: "4", perfectMatch:"60/5", n:"" },
    //         { id: "1", src:"", horseName:"Tyranny", searches: "8", pageviews: "4", perfectMatch:"60/5", n:"" },
    //         { id: "2", src:"", horseName:"Tyranny", searches: "8", pageviews: "4", perfectMatch:"60/5", n:"" },
    //         { id: "3", src:"", horseName:"Tyranny", searches: "8", pageviews: "4", perfectMatch:"60/5", n:"" },
    //         { id: "4", src:"", horseName:"Tyranny", searches: "8", pageviews: "4", perfectMatch:"60/5", n:"" },
    //        ],
     hasAvatar: true,
     options:["View Report", "View Profile", "Edit"],
     optionFunctionIndex:[7,1,8]
   }
   export const reportsOrderedTableProps = { 
    tableIdentifier: "EMPTY-COLUMN-NAMES-DASHBOARD-REPORTS-ORDERED",
    name: "Ordered Reports",
    columns: ['', ''],
    displayColumns:["reportName", "n"], 
    data: [
      { id: "0", src: '', reportName: 'Stallion Breeding Stock Sale', n: '' },
      { id: "1", src: '', reportName: 'Mare Analysis with Stallion Roster', n: '' },
    ],    
    hasAvatar: false,
   }

   export const mareListTableProps = { 
    tableIdentifier: "EMPTY-COLUMN-NAMES-DASHBOARD-MARELISTS",
    name: "My MaresLists",
    columns: ['', '', '', ''],
    displayColumns:["list", "count", "date", "n"],
    // data: [ { id: "0", src: '', list: 'Mare List 1',count: 'Mares:114 ',date: 'Uploaded: 04/05/2021', n: '' },
    //         { id: "1", src: '', list: 'Mare List 2', count: '8', date: 'Uploaded: 04/05/2021', n: '' },
    // ],
    hasAvatar: false,
    options:["Download List", "Edit Name", "Delete"],
    optionFunctionIndex:[4,3,5]
   }

export const yourMareProps = {
    title: "Your Mares",
    buttons: [{ buttonText: "Order Report", buttonStyles: {},className: "icon-Document-text" },
              { buttonText: "Add a Mare", buttonStyles: { marginLeft: "10px" },className: "icon-Plus" }],
    linkBtnText:"Go to Your Mares",
    path: "mares-list"
}
export const favStallionProps = {
    title: "Your Favourite Stallions",
    buttons: [{ buttonText: "Add", buttonStyles: {},className: "icon-Plus" }],
    linkBtnText:"Go to Your Favourite Stallions",
    path: "favourite-stallions-list"
}

export const recentSearchProps = {
    title: "Your Recent Searches",
    buttons: [],
    linkBtnText:""
}

export const favFarmProps = {
    title: "Your Favourite Farms",
    buttons: [{ buttonText: "Add", buttonStyles: {},className: "icon-Plus" }],
    linkBtnText:"Go to Your Favourite Farms",
    path: "favourite-farms-list"
}

export const favDamSireProps = {
    title: "Your Favourite Damsires",
    buttons: [{ buttonText: "Add", buttonStyles: {},className: "icon-Plus" }],
    linkBtnText:"Go to Your Favourite Dam Sires",
    path: "favourite-damsires-list"
}

//==========================================Table Props=============================================

 