import { Images } from '../assets/images'
const { Whiteruning, HomepageHeader, Report, reportimage } = Images
  const inputArr = [
    { id:"2", type:"img", src: Whiteruning, date: JSON.stringify(new Date()), name: "Black Thunder", description:"bla bla bla..." },
    { id:"3", type:"img", src: HomepageHeader, date: JSON.stringify(new Date()), name: "Aku K", description:"bla bla bla..." },
    { id:"4", type:"img", src: Whiteruning, date: JSON.stringify(new Date()), name: "Black Thunder", description:"bla bla bla..." },
    { id:"5", type:"img", src: HomepageHeader, date: JSON.stringify(new Date()), name: "Aku K", description:"bla bla bla..." },
    { id:"6", type:"img", src: Whiteruning, date: JSON.stringify(new Date()), name: "Black Thunder", description:"bla bla bla..." },
    { id:"7", type:"img", src: HomepageHeader, date: JSON.stringify(new Date()), name: "Aku K", description:"bla bla bla..." },
    { id:"8", type:"img", src: HomepageHeader, date: JSON.stringify(new Date()), name: "Aku K", description:"bla bla bla..." },
    { id:"9", type:"img", src: Whiteruning, date: JSON.stringify(new Date()), name: "Black Thunder", description:"bla bla bla..." },
    { id:"10", type:"img", src: HomepageHeader, date: JSON.stringify(new Date()), name: "Aku K", description:"bla bla bla..." },
  ]

  const reportImgArr = [
    { id:"0", type:"img", src: Report },
    { id:"1", type:"img", src: reportimage },
    { id:"2", type:"img", src: Report },
    { id:"3", type:"img", src: reportimage },
    { id:"4", type:"img", src: Report },
  ]
  export const multiCardCaroselProps = {
    items: inputArr,
    slider: true,
    dots: false,
    arrows: true,
    mediaClassName: "show",
    noOfVisibleItems: window.innerWidth < 600? 1 : window.innerWidth > 600 && window.innerWidth < 1024? 3 : 4,
    autoScroll: false,
    sliderOnItemClick: true,
    styles:{
      item:{},
      arrows:{
        top: "45%",
        width: "100%",
        display: "flex"
        
      },
      arrowLeft: {
        left: 0,
        marginLeft: '-5% !important'

    },
    arrowRight:{
      marginRight: '-5%',
        marginLeft: 'auto'
        
    },
      cardContent:{}
    }
  }

  export const singleCardCaroselProps = {
    items: reportImgArr,
    slider: true,
    dots: false,
    arrows: true,
    mediaClassName: "show",
    noOfVisibleItems: 1,
    autoScroll: false,
    sliderOnItemClick: false,
    styles:{
      item:{
        maxWidth: '100%'
      },
      arrows:{
        top: "50%",
        width: "100%",
        display: "flex"
      },
      arrowLeft: {
        left: 0,
        marginLeft: '-4%'

    },
    arrowRight:{
        right: '0',
        marginLeft: '30%'
        
    },
      cardContent:{}
    },
    hideTitle: true,
    sx: { width: window.innerWidth, height: window.innerHeight }
  }