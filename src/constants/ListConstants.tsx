export const maresListHeaderProps = {
    title: 'My Mares',
    buttons: [{ buttonText: "Order Stallion Match PRO Report", buttonStyles: {},className: "icon-Document-text" },
              { buttonText: "Add a Mare", buttonStyles: { marginLeft: "10px" },className: "icon-Plus" }],
    buttonFunctionId:[4, 0],
    dropdownList:["Name", "Date Added", "Age", "Country"]
}

export const stallionsListHeaderProps = {
    title: 'Favourite Stallions',
    buttons: [{ buttonText: "Order Stallion Affinity Report", buttonStyles: {},className: "icon-Document-text" },
    { buttonText: "Add a Stallion", buttonStyles: { marginLeft: "10px" },className: "icon-Plus" }],
    buttonFunctionId:[5, 1],
    dropdownList:["Name", "Date Added", "Age", "Runners", "Stakes Winners"]
}

export const damsiresListHeaderProps = {
    title: 'Favourite Broodmare Sires',
    buttons: [{ buttonText: "Order Broodmare Sire Report", buttonStyles: {},className: "icon-Document-text" },
    { buttonText: "Add a Damsire", buttonStyles: { marginLeft: "10px" }, className: "icon-Plus" }],
    buttonFunctionId:[6, 2],
    dropdownList:["Name", "Date Added", "Age", "Runners", "Stakes Winners"]
}

export const farmsListHeaderProps = {
    title: 'Favourite Farms',
    buttons: [{ buttonText: "Add a Farm", buttonStyles: {},className: "icon-Plus" }],
    buttonFunctionId:[3],
    dropdownList:["Name", "Recently Updated", "Date Added"]
}

export const mareListsHeaderProps = {
    title: "Mare Lists",
    buttons:[{ buttonText: "Download Template", buttonStyles:{}, 
    className: 'icon-Download', type: "download",
    downloadClassName:"download-mare-list", downloadBtnLink:"/downloads/Maretemplate.xlsx"},
             { buttonText: "Add a new Mare List", buttonStyles:{ marginLeft: "10px" }, className: 'icon-Plus' }],
    buttonFunctionId:[10, 7],
    dropdownList:["Name", "Mares", "Date Uploaded"],
}

export const myStallionsListHeaderProps = {
    title: "My Stallions",
    buttons:[{ buttonText: "Order Stallion Affinity Report", buttonStyles:{}, className: 'icon-Document-text' },
        { buttonText: "Add a Stallion", buttonStyles:{ marginLeft: "10px" }, className: 'icon-Plus' }],
    buttonFunctionId:[5, 8],
    dropdownList:["Name", "Stud Fee", "Status", "Expiry"]
}

export const usersListHeaderProps = {
    title: "Users List",
    buttons:[{ buttonText: "Invite a User", buttonStyles:{}, className: 'icon-Plus' }],
    buttonFunctionId:[9],
    dropdownList:["Name", "Email", "Status", "Access Level"]
}
//==========================================Table================================================

export const yourMareListTableProps = {
    name: "Favourite Mares",
    columns: ["", ""],
    displayColumns: ["name", "n"],
    tableIdentifier: "EMPTY-COLUMN-NAME-LIST",
    // data: [{ id: "0", src:"", name:"Tyranny", n:"" },
    //        { id: "1", src:"", name:"Tyranny", n:"" },
    //        { id: "2", src:"", name:"Tyranny", n:"" },
    //        { id: "3", src:"", name:"Tyranny", n:"" },
    //        { id: "4", src:"", name:"Tyranny", n:"" },],
    hasAvatar: true,
    options:["New Search", "Remove"],
    optionFunctionIndex:[0,5],
    isBreederDashboardTable: true,
    noColumns: true,
    // childClassName: 'yourmares'
}

export const favStallionTableProps = {
    name: "Favourite Stallions",
    columns: ["Horse","RNRS", "SW", "SW/RNRS%", ""],
    displayColumns: ["name", "RNRS", "SW", "swByRnrs", "n"],
    hascolumnDivider: true,
    tableIdentifier: "LIST",
    data: [{ id: "0", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },
           { id: "1", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },
           { id: "2", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },
           { id: "3", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },
           { id: "4", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },
           { id: "5", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },],
    hasAvatar: true,
    options:["View Profile", "New Search", "Remove"],
    optionFunctionIndex:[1,0,5],
    isBreederDashboardTable: true,
    noColumns: false,
}

export const favFarmTableProps = {
    name: "Favourite Farms",
    columns: ["", ""],
    displayColumns:["name", "n"],
    tableIdentifier: "EMPTY-COLUMN-NAME-LIST",
    data: [{ id:"0", name:"Coolmore", n:"" },
           { id:"1", name:"Coolmore", n:"" },
           { id:"2", name:"Coolmore", n:"" },],
    hasAvatar: true,
    options:["View Farm Page", "Remove"],
    optionFunctionIndex:[2,5],
    isBreederDashboardTable: true,
    noColumns: true,
}

export const favDamsireTableProps = {
    name: "Favourite Damsires",
    columns: ["Horse","RNRS", "SW", "SW/RNRS%", ""],
    displayColumns:["name", "RNRS", "SW", "swByRnrs", "n"],
    hascolumnDivider: true,
    tableIdentifier: "LIST",
    data: [{ id: "0", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },
           { id: "1", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },
           { id: "2", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },
           { id: "3", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },
           { id: "4", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },
           { id: "5", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },
           { id: "6", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },
           { id: "7", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },
           { id: "8", src:"", name:"Tyranny", RNRS: "8", SW: "4", "swByRnrs":"100", n:"" },],
    hasAvatar: true,
    options:["Remove"],
    optionFunctionIndex:[5],
    isBreederDashboardTable: true,
    noColumns: false,
}

export const mareListsTableProps = {
    columns:["","","", ""],
    name: "My MareLists",
    displayColumns:["list","count","uploaded", "n"],
    tableIdentifier: "EMPTY-COLUMN-NAMES-MARE-LIST",
    data: [
        { id: "0", list:"Mare List 1", count: "Mares: 144", uploaded:"Uploaded: 04/05/2021", n:"" },
        { id: "1", list:"Mare List 2", count: "Mares: 37", uploaded:"Uploaded: 14/06/2021", n:"" },
        { id: "2", list:"Mare List 3", count: "Mares: 65", uploaded:"Uploaded: 18/07/2021", n:"" },
        { id: "3", list:"Mare List 4", count: "Mares: 42", uploaded:"Uploaded: 13/09/2021", n:"" },
    ],
    options:["Download List", "Edit Name", "Remove"],
    optionFunctionIndex:[4,3,5]
}

export const myStallionsTableProps = {
    name: "My Stallions",
    columns:["Stallion", "Stud Fee", "Status", "Expiry", "Auto Renew", ""],
    displayColumns:[ "name", "studFee", "status", "expiry", "autoRenew", "n" ],
    hascolumnDivider: true,
    tableIdentifier: "MY-STALLIONS",
    data: [
        { id: "0", src:"", name:"Tyranny", studFee:"AUS 22,000", status:"Active", expiry:"23.08.2022", autoRenew:{ disabled: true, checked: true }, n:"" },
        { id: "1", src:"", name:"Tyranny", studFee:"AUS 22,000", status:"Active", expiry:"23.08.2022", autoRenew:{ disabled: false, checked: false }, n:"" },
        { id: "2", src:"", name:"Tyranny", studFee:"AUS 22,000", status:"Active", expiry:"23.08.2022", autoRenew:{ disabled: true, checked: false }, n:"" },
        { id: "3", src:"", name:"Tyranny", studFee:"AUS 22,000", status:"Active", expiry:"23.08.2022", autoRenew:{ disabled: false, checked: true }, n:"" },
    ],
    hasAvatar: true,
    options:["View Profile", "Edit", "Remove"],
    optionFunctionIndex:[1,10,11]
}

export const usersListTableProps = {
    tableIdentifier:"LIST-USERLIST",
    name: "Users",
    columns: ["Name","Email", "Status", "Access Level",""],
    hascolumnDivider: true,
    displayColumns:["name", "email", "status", "accessLevel", "n"],
    data: [{ id: "0", src:"", name:"Tyranny", email:"john@abc.com", status: "Active ", accessLevel:"Full Access", n:"" },
           { id: "1", src:"", name:"Tyranny", email:"john@abc.com", status: "Active ", accessLevel:"Full Access", n:"" },
           { id: "2", src:"", name:"Tyranny", email:"john@abc.com", status: "Active ", accessLevel:"3rd Party", n:"" },
           { id: "3", src:"", name:"Tyranny", email:"john@abc.com", status: "Active ", accessLevel:"View Only", n:"" },
           { id: "4", src:"", name:"Tyranny", email:"john@abc.com", status: "Active ", accessLevel:"View Only", n:"" },
          ],
    hasAvatar: true,
    options:["Resend Invite", "Remove"],
    optionFunctionIndex:[8,5]
}