import React from 'react'
import { Link, useParams } from 'react-router-dom';
import './EmailTemplate.css'



export default function ReportEmail() {

  
//   const  { id } = useParams();
//   const unsubscribe = `/unsubscribe/${id}`;
//   const downloadURL = `${api}/insights-report-download/${id}`;
  return (
    <body style={ { background: '#E5E5E5' } }>
     <div className='container-fluid'>
      <div className='row'>
        <div className='mx-auto m-1 p-1' style={ { width: '680px', background: '#ffffff' } }>
        <div className='col-lg-12 template'>
           <div className='row'>
             <div className='col-lg-12 col-sm-12 col-xs-12 pt-3 px-5'>
               <table width='100%'>
               <tr>
                 <td width='50%' className='SMlogo'><a href={""}><img src={""} alt="Stallion Match" /></a></td>
                 <td width='50%' align='right'><Link to='./' className='report-visit'>Visit website <i className='icon-Chevron-right'/></Link></td>
               </tr> 
               </table>
              </div>
            </div>
           <div className='w-75 mx-auto unsub-content' style={ { paddingBottom:'4rem' } }>
              <h1>
                   Powerful insights drive success
              </h1>
              <p>
              Thank you for requesting our Inbreeding insights report where you will find a host of valuable information. Register your interest now and start backing your decisions with data.
              </p>
              
              <a href={""}> <button className='download-btn'>Download Report <i className='icon-Download'/></button></a>
          </div>
          <div className='w-75 mx-auto' style={ { borderTop: 'solid 1px #DFE1E4' } }>&nbsp;</div>
          </div>
        <div className='col-lg-12 col-xs-12 report-content'>
           <div className='col-lg-8 col-sm-8 col-xs-6 mx-auto pt-5 pb-4'>
            <table>
              <tr>
                <td><img src={""} alt="Stallion Match" /></td>
                <td className='pe-4'> 
                  <h3>Stallion Directory</h3>
                  <p>World-wide stallion directory with direct access to many farms</p>
                  </td>
                <td><i className='icon-Arrow-circle-right'/></td>
              </tr>
              <tr>
                <td><img src={""} alt="Stallion Match" /></td>
                <td className='pe-4'> 
                  <h3>Access Data</h3>
                  <p>Rich data delivered simply in real-time related to all bredding aspects</p>
                  </td>
                <td><i className='icon-Arrow-circle-right'/></td>
              </tr>
              <tr>
                <td><img src={""} alt="Stallion Match" /></td>
                <td className='pe-3'> 
                  <h3>Analysis</h3>
                  <p>Use the efficiencies of machine learning to determine the effectiveness of any hypothetical mating</p>
                  </td>
                <td><i className='icon-Arrow-circle-right'/></td>
              </tr>
              <tr>
                <td><img src={""} alt="Stallion Match" /></td>
                <td className='pe-4'> 
                  <h3>Value</h3>
                  <p>Become a registered user FREE and promote your stallion for a small fee.</p>
                  </td>
                <td><i className='icon-Arrow-circle-right'/></td>
              </tr>
            </table>
             </div>
             <div className='pb-2'>
             <a href={""} style={ { textDecoration:'none' } }><button className='rigister-btn mx-auto'>Register Your Interest in Stallion Match</button></a> 
             </div>
          </div>
          <div className='w-75 mx-auto mt-5' style={ { borderTop: 'solid 1px #DFE1E4' } }>&nbsp;</div>
          {/* <div className='col-lg-12 col-xs-12 template-footer'>
              <p className='text-center'>If you prefer not to receive emails like this, you may  
              <Link to={unsubscribe}>unsubscribe</Link><br/>Copyright ©2021 G1 Racesoft Pty Ltd. All rights reserved.</p>
              <div className='text-center pt-3'>
              <a href={facebook_url} target="_blank" rel='noreferrer'><img src={facebook} alt="Facebook" style={ {marginRight: '30px'} }/></a>
              <a href={twitter_url} target="_blank" rel='noreferrer'><img src={twitter} alt="Twitter"/></a>
              </div>
          </div> */}
        </div>
      </div>
    </div>
    </body>
  )
}

