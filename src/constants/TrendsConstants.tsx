export const topPerformingProps = {
    title: "Top Performing Stallion",
    datePicker: true
}
export const topPerformingWrapperProps = {
    id: "",
    src:"",
    name: "Zafonny",
    fee: "$170,000",
    options:["View Profile", "Search", "Add To My List"],
    optionFunctionIndex:[1,9,10]
}

export const popularStallionProps = {
    title: "Most Popular Stallion",
    datePicker: true
}

export const popularStallionWrapperProps = {
    id: "",
    src:"",
    name: "Magic Realm",
    fee: "$150,000",
    options:["View Profile", "Search", "Add To My List"],
    optionFunctionIndex:[1,9,10]
}

export const popularDamsireProps = {
    title: "Most Popular Dam Sire",
    datePicker: true
}

export const popularDamsireWrapperProps = {
    id: "",
    src:"",
    name: "Galileo (IRE)",
    isMostPopularDamsire: true,
    options:["Add To My List"],
    optionFunctionIndex:[11]
}

export const farmActivityProps = {
    title: "Farm Activity",
    datePicker: true
}

export const hottestCrossWrapperProps = {
    title: "Hottest Cross",
    description:`Based on the last 30 days, this sire x broodmare sire 
    cross has resulted in the highest number of stakes winners.`,
    descriptionClassName:"hottest-para",
    linkBtnText : "View in G1 Goldmine",
    descriptionSx:{ paddingX:'2rem', paddingY:'0px !important'}
}

export const hottestCrossProps = {
    sireId: "",
    sire: "Sebi Halo",
    broodmareSireId:"",
    broodmareSire:"Hopespringeternal",
    runners: "10",
    sw: "5",
    "rnrs%": "50%",
}

export const searchedStallions = {
    title: "Most Searched Stallions",
    tableTitleClass: 'searched-stallions',
    datePicker: true,
}

export const matchedDamsire = {
    title: "Most Matched Dam Sire",
    tableTitleClass: 'searched-stallions',
    datePicker: true,
}

export const top20By20Sires = {
    title: "Top 20/20 Matched Sires",
    dropdown: true,
    dropdownOptions:["Name", "Runners", "Stakes Winners", "SW/Rnrs %"],
    defaultSelected: "Name"
}

export const top10PerfectMatchSire = {
    tableHeaderClass: 'matched-broodmare-header',
    title: "Top Perfect Match Matched Sires",
    dropdown: true,
    dropdownOptions:["Name", "Runners", "Stakes Winners", "SW/Rnrs %"],
    defaultSelected: "Name"
}

export const top20By20Damsires = {
    tableHeaderClass: 'matched-broodmare-header',
    title: "Top 20/20 Matched Broodmare Sires",
    tableTitleClass: 'broodmare-sires',
    dropdown: true,
    dropdownOptions:["Name", "Runners", "Stakes Winners", "SW/Rnrs %"],
    defaultSelected: "Name",
}

export const top10PerfectMatchBroodmareSire = {
    tableHeaderClass: 'matched-broodmare-header',
    title: "Top Perfect Match Matched Broodmare Sires",
    tableTitleClass: 'broodmare-sires',
    dropdown: true,
    dropdownOptions:["Name", "Runners", "Stakes Winners", "SW/Rnrs %"],
    defaultSelected: "Name",
}

export const stallionMatchActivity = {
    title: "Stallion Match Activity",
    dropdown: true,
    dropdownOptions:["Name", "Runners", "Stake Winners", "SW/RNRS%"],
    defaultSelected: "Name"
}

//============================================Sample Table Props =======================================

export const searchedStallionTableProps = {
    columns: ["", ""],
    displayColumns: ["name", "n"],
    name:"Most Searched Stallions",
    tableIdentifier: "EMPTY-COLUMN-NAMES-DASHBOARD",
    data: [{ id: "0", src:"", name:"Tyranny", n:"" },
           { id: "1", src:"", name:"Zafonny", n:"" },
           { id: "2", src:"", name:"Bojack", n:"" },
           { id: "3", src:"", name:"Magic Realm", n:"" },
           { id: "4", src:"", name:"Diamond Park", n:"" },
           { id: "5", src:"", name:"Tyranny", n:"" },
           { id: "6", src:"", name:"Zafonny", n:"" },
           { id: "7", src:"", name:"Bojack", n:"" },
           { id: "8", src:"", name:"Magic Realm", n:"" },
           { id: "9", src:"", name:"Diamond Park", n:"" },],
    hasAvatar: true,
    options:["View Profile", "Search", "Add To My List"],
    optionFunctionIndex:[1,10,11]
}

export const matchedDamsireTableProps = {
    columns: ["", ""],
    displayColumns: ["name", "n"],
    name:"Most Matched Damsire",
    tableIdentifier: "EMPTY-COLUMN-NAMES-DASHBOARD",
    data: [{ id: "0", src:"", name:"Tyranny", n:"" },
           { id: "1", src:"", name:"Zafonny", n:"" },
           { id: "2", src:"", name:"Bojack", n:"" },
           { id: "3", src:"", name:"Magic Realm", n:"" },
           { id: "4", src:"", name:"Diamond Park", n:"" },
           { id: "5", src:"", name:"Tyranny", n:"" },
           { id: "6", src:"", name:"Zafonny", n:"" },
           { id: "7", src:"", name:"Bojack", n:"" },
           { id: "8", src:"", name:"Magic Realm", n:"" },
           { id: "9", src:"", name:"Diamond Park", n:"" },],
    hasAvatar: true,
    options:["Add To My List"],
    optionFunctionIndex:[12]
}

export const Top10SireTableProps = {
    columns: ["Name","RNRS", "SW", "SW/RNRS%", ""],
    displayColumns: ["name", "RNRS", "SW", "Perc", "n"],
    name:"Top 10 20/20 Matched Sires",
    hascolumnDivider: true,
    tableIdentifier: "DASHBOARD",
    data: [{ id: "0", src:"", name:"Tyranny", RNRS: "8", SW: "4", "SW/RNRS%":"100", n:"" },
           { id: "1", src:"", name:"Tyranny", RNRS: "8", SW: "4", "SW/RNRS%":"100", n:"" },
           { id: "2", src:"", name:"Tyranny", RNRS: "8", SW: "4", "SW/RNRS%":"100", n:"" },
           { id: "3", src:"", name:"Tyranny", RNRS: "8", SW: "4", "SW/RNRS%":"100", n:"" },
           { id: "4", src:"", name:"Tyranny", RNRS: "8", SW: "4", "SW/RNRS%":"100", n:"" },
           { id: "5", src:"", name:"Tyranny", RNRS: "8", SW: "4", "SW/RNRS%":"100", n:"" },],
    hasAvatar: true,
    options:["View Profile", "Search", "Add To My List"],
    optionFunctionIndex:[1,0,3]
}

export const Top10PerfectMatchedSireTableProps = {
    columns: ["Name","RNRS", "SW", "SW/RNRS%", ""],
    displayColumns: ["name", "RNRS", "SW", "Perc", "n"],
    name:"Top 10 Perfect Match Matched Sires",
    hascolumnDivider: true,
    tableIdentifier: "DASHBOARD",
    data: [{ id: "0", src:"", name:"Tyranny", RNRS: "8", SW: "4", "SW/RNRS%":"100", n:"" },
           { id: "1", src:"", name:"Tyranny", RNRS: "8", SW: "4", "SW/RNRS%":"100", n:"" },
           { id: "2", src:"", name:"Tyranny", RNRS: "8", SW: "4", "SW/RNRS%":"100", n:"" },
           { id: "3", src:"", name:"Tyranny", RNRS: "8", SW: "4", "SW/RNRS%":"100", n:"" },
           { id: "4", src:"", name:"Tyranny", RNRS: "8", SW: "4", "SW/RNRS%":"100", n:"" },
           { id: "5", src:"", name:"Tyranny", RNRS: "8", SW: "4", "SW/RNRS%":"100", n:"" },],
    hasAvatar: true,
    options:["View Profile", "Search", "Add To My List"],
    optionFunctionIndex:[1,0,3]
}

export const Top10BroodmareSireTableProps = {
    columns: ["Name","RNRS", "SW", "SW/RNRS%", ""],
    displayColumns: ["name", "RNRS", "SW", "Perc", "n"],
    name:"Top 10 20/20 Matched Broodmare Sires",
    hascolumnDivider: true,
    tableTitleClass: '',
    tableIdentifier: "DASHBOARD",
    data: [{ id: "0", src:"", name:"Tyranny", RNRS: "8", SW: "4", "SW/RNRS%":"100", n:"" },
           { id: "1", src:"", name:"Tyranny", RNRS: "8", SW: "4", "SW/RNRS%":"100", n:"" },
           { id: "2", src:"", name:"Tyranny", RNRS: "8", SW: "4", "SW/RNRS%":"100", n:"" },
           { id: "3", src:"", name:"Tyranny", RNRS: "8", SW: "4", "SW/RNRS%":"100", n:"" },
           { id: "4", src:"", name:"Tyranny", RNRS: "8", SW: "4", "SW/RNRS%":"100", n:"" },
           { id: "5", src:"", name:"Tyranny", RNRS: "8", SW: "4", "SW/RNRS%":"100", n:"" },],
    hasAvatar: true,
    options:["Add To My List"],
    optionFunctionIndex:[12]
}

export const Top10PerfectMatchedBroodmareSireTableProps = {
    columns: ["Name","RNRS", "SW", "SW/RNRS%", ""],
    displayColumns: ["name", "RNRS", "SW", "Perc", "n"],
    name:"Top 10 Perfect Match Matched Broodmare Sires",
    hascolumnDivider: true,
    tableTitleClass: '',
    tableIdentifier: "DASHBOARD",
    data: [{ id: "0", src:"", name:"Tyranny", RNRS: "8", SW: "4", "SW/RNRS%":"100", n:"" },
           { id: "1", src:"", name:"Tyranny", RNRS: "8", SW: "4", "SW/RNRS%":"100", n:"" },
           { id: "2", src:"", name:"Tyranny", RNRS: "8", SW: "4", "SW/RNRS%":"100", n:"" },
           { id: "3", src:"", name:"Tyranny", RNRS: "8", SW: "4", "SW/RNRS%":"100", n:"" },
           { id: "4", src:"", name:"Tyranny", RNRS: "8", SW: "4", "SW/RNRS%":"100", n:"" },
           { id: "5", src:"", name:"Tyranny", RNRS: "8", SW: "4", "SW/RNRS%":"100", n:"" },],
    hasAvatar: true,
    options:["Add To My List"],
    optionFunctionIndex:[12]
}

export const activities = [
    { src: "", farmName:'Coolmore', information: 'uploaded a new stallion Pride of Dubai', timeStamp: Date.now() - Math.random()*60*60*1000*100 },
    { src: "", farmName:'Yarraman Park', information: 'uploaded a new stallion Pride of Dubai', timeStamp: Date.now()- Math.random()*60*60*1000*100 },
    { src: "", farmName:'Coolmore', information: 'uploaded a new stallion Pride of Dubai', timeStamp: Date.now()- Math.random()*60*60*1000*100 },
    { src: "", farmName:'Darley', information: 'uploaded a new stallion Pride of Dubai', timeStamp: Date.now()- Math.random()*60*60*1000*100 },
]