import React from 'react'
// import stallionLogo from "../../assets/Vectors/StallionEmailLogo.svg";
// import fb from "../../assets/Images/facebook.png";
// import tw from "../../assets/Images/twitter.png";
import './EmailTemplate.css'

export default function UnsubscribeEmail() {
//   const site_url = process.env.REACT_APP_SITE_URI;
//   const facebook_url = process.env.REACT_APP_FACEBOOK_URI;
//   const twitter_url = process.env.REACT_APP_TWITTER_URI;
  
  return (
    <body style={ { background: '#E5E5E5' } }>
     <div className='container-fluid'>
      <div className='row'>
        <div className=' mx-auto p-1' style={ { width: '680px' } }>
        <div className='col-lg-12 unsubscribe'>
          <div className='logo pt-4'>
          <a href={""}><img src={""} alt="Stallion Match" style={ { width: '45%' } }/></a>
          </div>
          <div className='w-75 mx-auto unsub-content'>
              <h1>
                 You’ll be missed
              </h1>
              <p>
              We’re sorry that we’re no longer your perfect match and hope to have you back soon.
              </p>
              <p>Was this a mistake? Re-subscribe below.</p>
              <button className='Resub-btn'>Re-subscribe</button> 
          </div>
         
        </div>
          <div className='col-lg-12 col-xs-12 unsub-footer'>
            {/* <div className='w-75 mx-auto pb-2'>
            <div className='pt-4'>
            <a href={facebook_url} target="_blank" rel='noreferrer'> <img src={fb} alt="Facebook" style={ {marginRight: '30px'} }/></a>
            <a href={twitter_url} target="_blank" rel='noreferrer'> <img src={tw} alt="Twitter"/></a>
              </div>
              <p className='pt-3'>Copyright ©2021 G1 Racesoft Pty Ltd. All rights reserved.</p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  </body>
  )
}

