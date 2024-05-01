import { Container, Grid, Typography, MenuItem, SelectChangeEvent } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { CustomSelect } from 'src/components/CustomSelect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import '../layouts/main/layout.css';
// MetaTags
import useMetaTags from 'react-metatags-hook';

function PrivacyPolicy() {
  const BaseAPI = process.env.REACT_APP_PUBLIC_URL;  
  const privacyPolicysUrl = `${BaseAPI}about/privacy-policy`;
  const supportEmail = process.env.REACT_APP_SUPPORT_EMAIL;
  
  // Generate meta information
  useMetaTags({
    title: `Stallion Match Privacy Policy`,
    description: ``,
    openGraph: {
      title: `Stallion Match Privacy Policy`,
      site_name: 'Stallion Match',
      url: privacyPolicysUrl,
      type: 'business.business',
    },
  }, [])

  // Policy dropdown option list
  const policyList =
    [
      {
        title: '1. Introduction',
        id: 'introduction'
      },
      {
        title: '2. Types of Personal Information We Collect',
        id: 'personal-info'
      },
      {
        title: '3. How We Collect Personal Information',
        id: 'collect-personal-info'
      },
      {
        title: '4. Use of Your Personal Information',
        id: 'your-personal-info'
      },
      {
        title: '5. Sharing Your Data',
        id: 'sharing-your-data'
      },
      {
        title: '6. Security',
        id: 'security'
      },
      {
        title: '7. Links',
        id: 'links'
      },
      {
        title: '8. Your Rights',
        id: 'your-rights'
      },
      {
        title: '9. How Long We Keep Data',
        id: 'how-long'
      },
      {
        title: '10. Transfers Outside The European Economic Area (‘EEA’)',
        id: 'transfers-outside'
      },
      {
        title: '11. Contact Us',
        id: 'contact-us'
      }
    ];

  const [selectedPolicy, setSelectedPolicy] = useState('introduction');

  // Load the page from top while loading
  useEffect(()=> {
    window.scrollTo({ top: 0, behavior: "smooth" })
  },[])

  // On Selecting the options, scroll to corresponding section 
  const handlePolicyChange = (event: SelectChangeEvent<any>) => {
    setSelectedPolicy(event?.target?.value)
    var myElement: any = document.getElementById(event?.target?.value);
    if (event?.target?.value === 'introduction') {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      if(window.matchMedia("(max-width: 600px)")) {
        window.scrollTo({ top: myElement?.offsetTop - 200, behavior: "smooth" })
      }else {
        window.scrollTo({ top: myElement?.offsetTop - 160, behavior: "smooth" })
      }
    }
  }

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuPropss = {
    PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          marginRight: '0px',
          marginTop: '-1px',
          boxShadow: 'none',
      border: 'solid 1px #161716',
      borderTopLeftRadius: '0',
      borderTopRightRadius: '0',
      boxSizing: 'border-box',
        },
      },
}

  return (
    <>
      <Container className='policy'>
        <Box className='policy-sticky'>
          <Grid container>
            <Grid item lg={6} sm={6} xs={12}>
              <Typography variant='h2'>Privacy Policy</Typography>
            </Grid>
            <Grid item lg={6} sm={6} xs={12} className='policy-head'>
              <CustomSelect
              disablePortal
                fullWidth
                IconComponent={KeyboardArrowDownRoundedIcon}
                className="selectDropDownBox select-dropdown policy-dropdown"
                value={selectedPolicy}
                onChange={handlePolicyChange}
                MenuProps={MenuPropss}
              >
                {policyList?.map((v, index) => {
                  return (
                    <MenuItem className='selectDropDownList policy-coutry-list' value={v.id} key={index}>
                      {v.title}
                    </MenuItem>
                  )
                })}
              </CustomSelect>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Box mb={3} id="introduction">
            <Typography variant='h4'>1. Introduction</Typography>
            <Typography variant='h6'>This document sets out the privacy policy of G1 Racesoft Pty Ltd ABN 93 110 444 007 trading as “Stallion Match” (referred to in this privacy policy as ‘we’, ‘us’, or ‘our’). For the purposes of applicable data protection law, (in particular, the General Data Protection Regulation (EU) 2016/679 (the “GDPR”) and the UK Data Protection Act 2018), your data will be controlled by us.</Typography>
            <Typography variant='h6'>
              This privacy policy applies whenever we collect your personal information and/or personal data (your personal data). This includes between you, the visitor to this website (whether directly as our customer or as personnel of our customer), and us, the owner and provider of this website and also where we are directed by a third party to process your personal data. This privacy policy applies to our use of any and all data collected by us or provided by you in relation to your use of the website and the provision of our services to you.
            </Typography>
            <Typography variant='h6'>
              We take our privacy obligations seriously. Please read this privacy policy carefully as it contains important information on who we are and how and why we collect, store, use and share your personal data in connection with your use of our website. It also explains your rights in relation to your personal data and how to contact us or a relevant regulator in the event you have a complaint.
            </Typography>
          </Box>
          <Box mb={3} id="personal-info">
            <Typography variant='h4'>2. Types of Personal Information We Collect</Typography>
            <Typography variant='h6'>The personal data we collect may include the following:</Typography>
            <Typography variant='h6'>
              (a)	name;<br />
              (b)	mailing or street address;<br />
              (c)	email address;<br />
              (d)	social media information;<br />
              (e)	telephone number and other contact details;<br />
              (f)	age;<br />
              (g)	date of birth;<br />
              (h)	credit card or other payment information;<br />
              (i)	information about your business or personal circumstances;<br />
              (j)	information in connection with any client surveys, questionnaires and promotions you participate in;<br />
              (k)	when we use analytical cookies, your device identity and type, I.P. address, geo-location information, page view statistics, advertising data and standard web log information;<br />
              (l)	information about third parties; and<br />
              (m)	any other information provided by you to us via this website, in the course of us providing services to you, or otherwise required by us or provided by you.
            </Typography>
          </Box>
          <Box mb={3} id="collect-personal-info">
            <Typography variant='h4'>3. How We Collect Personal Information</Typography>
            <Typography variant='h6'>We endeavour to ensure that information we collect is complete, accurate, accessible and not subject to unauthorised access.</Typography>
            <Typography variant='h6'>We may collect personal data either directly from you, or from third parties, including where you:</Typography>
            <Typography variant='h6'>
              (a)	contact us through on our website;<br />
              (b)	communicate with us via email, telephone, SMS, social applications (such as LinkedIn, Facebook or Twitter) or otherwise;<br />
              (c)	engage us to perform services to you;<br />
              (d)	when you or your organisation offer to provide, or provides, services to us;<br />
              (e)	interact with our website, social applications, services, content and advertising; and<br />
              (f)	invest in our business or enquire as to a potential purchase in our business.
            </Typography>
            <Typography variant='h6'>We may also collect personal data from you when you use or access our website or our social media pages. This may be done through use of web analytics tools, ‘cookies’ or other similar tracking technologies that allow us to track and analyse your website usage. For more information, please see our Cookie Policy.:</Typography>
          </Box>
          <Box mb={3} id="your-personal-info">
            <Typography variant='h4'>4. Use of Your Personal Information</Typography>
            <Typography variant='h6'>We collect and use personal data for the following purposes:</Typography>
            <Typography variant='h6'>
              (a)	to provide services or information to you;<br />
              (b)	for record-keeping and administrative purposes;<br />
              (c)	to comply with our legal obligations, resolve disputes or enforce our agreements with third parties;<br />
              (d)	where we have your consent, including to send you marketing and promotional messages and other information that may be of interest to you. In this regard, we may use email, SMS, social media or mail to send you direct marketing communications. You can opt-out of receiving marketing materials from us by using the opt-out facility provided (e.g. an unsubscribe link);<br />
              (e)	for our legitimate interests including:<br />
              <p>(i)	to develop and carry out marketing activities and to conduct market research and analysis and develop statistics;<br />
                (ii)	to improve and optimise our service offering and customer experience;<br />
                (iii)	to send you administrative messages, reminders, notices, updates and other information requested by you;<br />
                (iv)	to consider an application of employment from you; and<br />
                (v)	the delivery of our services.
              </p>

            </Typography>
          </Box>
          <Box mb={3} id="sharing-your-data">
            <Typography variant='h4'>5. Sharing Your Data</Typography>
            <Typography variant='h6'>We may share your personal data in certain circumstances, as follows:</Typography>
            <Typography variant='h6'>(a)	where there is a change of control in our business or a sale or transfer of business assets, we reserve the right to transfer to the extent permissible at law our user databases, together with any personal data and non-personal data contained in those databases. This information may be disclosed to a potential purchaser under an agreement to maintain confidentiality. We would seek to only disclose information in good faith and where required by any of the above circumstances;</Typography>
            <Typography variant='h6'>(b)	credit-checking agencies for credit control reasons;</Typography>
            <Typography variant='h6'>(c)	disclosures required by law or regulation; and</Typography>
            <Typography variant='h6'>(d)	service providers and other affiliated third parties to enable us to provide our services to you including other professional advisers such as accountants, disaster recovery service providers or auditors and/or overseas counsel.</Typography>
          </Box>
          <Box mb={3} id="security">
            <Typography variant='h4'>6. Security</Typography>
            <Typography variant='h6'>We take reasonable steps to ensure your personal data is secure and protected from misuse or unauthorised access. Our information technology systems are password protected, and we use a range of administrative and technical measures to protect these systems. However, we cannot guarantee the security of your personal data.</Typography>
          </Box>
          <Box mb={3} id="links">
            <Typography variant='h4'>7. Links</Typography>
            <Typography variant='h6'>Our website may contain links to other websites. Those links are provided for convenience and may not remain current or be maintained. We are not responsible for the privacy practices of those linked websites and we suggest you review the privacy policies of those websites before using them.</Typography>
          </Box>
          <Box mb={3} id="your-rights">
            <Typography variant='h4'>8. Your Rights</Typography>
            <Typography variant='h6'>You have various rights with respect to our use of your personal data:</Typography>
            <Typography variant='h6'>(a) <strong>Access:</strong> You have the right to obtain access to your information (if we’re processing it) and certain other information (similar to that provided in this privacy notice). This is so that you’re aware and can check that we’re using your information in accordance with data protection law.</Typography>
            <Typography variant='h6'>(b) <strong>Be informed:</strong> You have the right to be provided with clear, transparent and easily understandable information about how we use your information and your rights. This is why we’re providing you with the information in this privacy policy.</Typography>
            <Typography variant='h6'>(c) <strong>Rectification:</strong> We aim to keep your personal data accurate, current, and complete. We encourage you to contact us using our contact form to let us know if any of your personal data is not accurate or changes, so that we can keep your personal data up-to-date.</Typography>
            <Typography variant='h6'>(d) <strong>Objecting:</strong> You also have the right to object to processing of your personal data in certain circumstances, including processing for direct marketing.</Typography>
            <Typography variant='h6'>(e) <strong>Restricting:</strong> You have the right to ‘block’ or suppress further use of your information. When processing is restricted, we can still store your information, but may not use it further.</Typography>
            <Typography variant='h6'>(f) <strong>Erasure:</strong> You have the right to ask us to erase your personal data when the personal data is no longer necessary for the purposes for which it was collected, or when, among other things, your personal data have been unlawfully processed.</Typography>
            <Typography variant='h6'>(g) <strong>Portability:</strong> You have the right to request that some of your personal data is provided to you, or to another data controller, in a commonly used, machine-readable format.</Typography>
            <Typography variant='h6'>(h) <strong>Complaints:</strong> If you believe that your data protection rights may have been breached, you have the right to lodge a complaint with the applicable supervisory authority. In the UK, the supervisory authority is the Information Commissioner’s Office.</Typography>
            <Typography variant='h6'>(i) <strong>Withdraw consent:</strong> If you have given your consent to anything we do with your personal data, you have the right to withdraw your consent at any time. This includes your right to withdraw consent to us using your personal data for marketing purposes.</Typography>
            <Typography variant='h6'>You may, at any time, exercise any of the above rights, by contacting our email address provided below.</Typography>
          </Box>
          <Box mb={3} id="how-long">
            <Typography variant='h4'>9. How Long We Keep Data</Typography>
            <Typography variant='h6'>We will only retain your personal data for as long as necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements. We will securely destroy your personal data in accordance with applicable laws and regulations.</Typography>
            <Typography variant='h6'>If you would like further information about our specific retention periods for your personal data, please contact us using our email address provided below.</Typography>
          </Box>
          <Box mb={3} id="transfers-outside">
            <Typography variant='h4'>10. Transfers Outside The European Economic Area (‘EEA’)</Typography>
            <Typography variant='h6'>To provide our services, we may transfer the personal data we collect to countries outside of the UK or EEA which do not provide the same level of data protection as the country in which you reside and are not recognised by the European Commission as providing an adequate level of data protection.</Typography>
            <Typography variant='h6'>
              When we do this, we will make sure that it is protected to the same extent as in the EEA and UK as we will put in place appropriate safeguards to protect your personal data, which may include standard contractual clauses.</Typography>
            <Typography variant='h6'>
              For more information, please contact us at our email address provided below.</Typography>
          </Box>
          <Box mb={3} id="contact-us">
            <Typography variant='h4'>11. Contact Us</Typography>
            <Typography variant='h6'>For further information about our privacy policy or practices, or to access or correct your personal data, or make a complaint, please contact us using the details set out below:</Typography>
            <Typography variant='h6'>
              <strong>Email:</strong> <a href={`mailto:${supportEmail}`} target='_blank'>{supportEmail}</a></Typography>
            <Typography variant='h6'>
              We may change this privacy policy from time to time by posting an updated copy on our website and we encourage you to check our website regularly to ensure that you are aware of our most current privacy policy. Where we make any significant changes, we will endeavour to notify you by email.</Typography>
          </Box>
        </Box>
      </Container>
    </>
  )
}
export default PrivacyPolicy