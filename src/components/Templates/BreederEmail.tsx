import React from 'react'

import './EmailTemplate.css'

 const BreederEmail = () =>(
            <body style={ { background: '#E5E5E5' } }>
             <div className='container-fluid'>
              <div className='row'>
                <div className=' mx-auto p-1' style={ { width: '680px' } }>
                <div className='col-lg-12 template'>
                  <div className='col-lg-12 breeder-template'>
                   <div className='col-lg-6 col-sm-6 col-xs-12 template-banner'>
                      <div className='pt-3'>
                        <a href={""}><img src={""} alt="Stallion Match" style={ { width: '45%' } }/></a>
                      </div>
                      <div className='pt-3'>
                        <h1>Registration Successful</h1>
                        <p>Hello {"test"}, you have successfully
                           registered your interest in the new Stallion
                           Match and will be the first to experience
                           the next generation finding your Perfect
                           Match! You will receive a pre-launch
                           invitation soon.</p>
                      </div>
                   </div>
                  </div>
                </div>
                <div className='col-lg-12 col-xs-12 template-content'>
                   <div className='col-lg-7 col-sm-7 col-xs-6 mx-auto py-4'>
                    <div className='content-clmn'>
                      <h3>Find your most compatible stallion with ease.</h3>
                    </div>
                    <div className='content-clmn'>
                      <h3>Extensive worldwide stallion database.</h3>
                    </div>
                    <div className='content-clmn'>
                      <h3>Track analytics with customisable favourite lists.</h3>
                    </div>
                    <div className='content-clmn'>
                      <h3>Contact farms directly using a simple messenger platform.</h3>
                    </div>
        
                     </div>
                  </div>
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

export default BreederEmail;