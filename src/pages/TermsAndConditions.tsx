import { Container, Grid, Typography, Link, MenuItem, SelectChangeEvent } from '@mui/material'
import { Link as LinkTo } from 'react-router-dom';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { CustomSelect } from 'src/components/CustomSelect';
import { MenuProps } from '../constants/MenuProps';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import '../layouts/main/layout.css';
// MetaTags
import useMetaTags from 'react-metatags-hook';
import { useGetNominationRequestQuery } from 'src/redux/splitEndpoints/postNominationRequestSplit';
import useAuth from 'src/hooks/useAuth';
import { useGetCurrenciesQuery } from 'src/redux/splitEndpoints/getCurrenciesSplit';
import { useCountriesQuery } from 'src/redux/splitEndpoints/countrySplit';
import { InsertCommas } from 'src/utils/FunctionHeap';

function TermsAndConditions() {
  const BaseAPI = process.env.REACT_APP_PUBLIC_URL;
  const aboutusUrl = `${BaseAPI}about/terms`;
  const { authentication } = useAuth();
  const { data: currencies, isSuccess: isCurrencySuccess } = useGetCurrenciesQuery();
  const { data: countriesList } = useCountriesQuery();

  // Generate meta information
  useMetaTags({
    title: `Stallion Match Terms & Conditions`,
    description: ``,
    openGraph: {
      title: `Stallion Match Terms & Conditions`,
      site_name: 'Stallion Match',
      url: aboutusUrl,
      type: 'business.business',
    },
  }, [])

  // Terms dropdown option list
  const termsAndConditionsList =
    [
      {
        title: 'Welcome to Stallion Match',
        id: 'welcome-to-stallion-match'
      },
      {
        title: 'Part A - All Users',
        id: 'part-A-all-users'
      },
      {
        title: 'Part B - Farm Users',
        id: 'part-B-farm-users'
      },
      {
        title: 'Part C - Registered Users',
        id: 'part-C-registered-users'
      },
      {
        title: 'Introduction - Fee',
        id: 'introduction-fee'
      },
      {
        title: 'Nomination Request',
        id: 'nomination-request'
      },
      {
        title: 'Stallion Listing',
        id: 'stallion-listing'
      },
      {
        title: 'Disputes',
        id: 'disputes'
      },
      {
        title: 'Invoice - Introduction - Fee',
        id: 'invoice-introduction-fee'
      },
      {
        title: 'Communications Platform',
        id: 'communications-platform'
      },
      {
        title: 'Communications',
        id: 'communications'
      },
      {
        title: 'Broodmare - Nomination - Request',
        id: 'broodmare-nomination-request'
      },
    ];

  const callConversionCurrencyId = () => {
    const user = authentication ? JSON.parse(window.localStorage.getItem("user") || '{}') : window.localStorage.getItem("geoCountryName");
    let userCountryCode = authentication ? user?.memberaddress[0]?.currencyCode : user;

    let userCurrencyId: any = null;
    if (authentication) {
      for (let index = 0; index < currencies?.length; index++) {
        const element = currencies[index];
        if (element?.label === userCountryCode) {
          userCurrencyId = element?.id;
          break;
        }
      }
    } else {
      if (countriesList) {
        for (let index = 0; index < countriesList?.length; index++) {
          const element: any = countriesList[index];
          if (element?.countryName === user) {
            userCurrencyId = element?.preferredCurrencyId;
            break;
          }

        }
      }
    }
    return userCurrencyId ? userCurrencyId : 1;
  }


  const { data: nominationTierData, isSuccess: isnominationTierDataSuccess, isFetching } =
    useGetNominationRequestQuery(callConversionCurrencyId(), { skip: (!callConversionCurrencyId()) });

  // console.log(nominationTierData, 'nominationTierData')

  const [selectedtermsAndConditions, settermsAndConditions] = useState('welcome-to-stallion-match');

  // Load the page from top while loading
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // On Selecting the options, scroll to corresponding section 
  const handlePolicyChange = (event: SelectChangeEvent<any>) => {
    settermsAndConditions(event?.target?.value)
    var myElement: any = document.getElementById(event?.target?.value);
    if (event?.target?.value === 'welcome-to-stallion-match') {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      if (window.matchMedia("(max-width: 600px)")) {
        window.scrollTo({ top: myElement?.offsetTop - 200, behavior: "smooth" })
      } else {
        window.scrollTo({ top: myElement?.offsetTop - 160, behavior: "smooth" })
      }
    }
  }

  // Scroll to corresponding section if user choose any link from page
  const handleScroll = (str: string) => {
    var myElement: any = document.getElementById(str);
    settermsAndConditions(str);
    if (window.matchMedia("(max-width: 600px)")) {
      window.scrollTo({ top: myElement?.offsetTop - 200, behavior: "smooth" })
    } else {
      window.scrollTo({ top: myElement?.offsetTop - 160, behavior: "smooth" })
    }
  }

  const callDynamicIntroFeeForNomination = () => {

    if (isnominationTierDataSuccess) {
      return (
        <>
          <Typography variant='h6'>(i)	for a Nomination Request of less than {nominationTierData?.currencySymbol}{InsertCommas(nominationTierData?.min)}, <strong>{nominationTierData?.currencySymbol}{nominationTierData?.tier1}</strong>;</Typography>
          <Typography variant='h6'>(ii)	for a Nomination Request between {nominationTierData?.currencySymbol}{InsertCommas(nominationTierData?.min)} and {nominationTierData?.currencySymbol}{InsertCommas(nominationTierData?.max)}, <strong>{nominationTierData?.currencySymbol}{nominationTierData?.tier2}</strong>; and</Typography>
          <Typography variant='h6'>(iii)	for a Nomination Request exceeding {nominationTierData?.currencySymbol}{InsertCommas(nominationTierData?.max)}, <strong>{nominationTierData?.currencySymbol}{nominationTierData?.tier3}</strong>.</Typography>
        </>
      )
    }

    return (
      <>
        <Typography variant='h6'>(i)	for a Nomination Request of less than $2,000, <strong>$49</strong>;</Typography>
        <Typography variant='h6'>(ii)	for a Nomination Request between $2,000 and $5,000, <strong>$99</strong>; and</Typography>
        <Typography variant='h6'>(iii)	for a Nomination Request exceeding $5,000, <strong>$149</strong>.</Typography>
      </>
    )
  }


  return (
    <Container className='policy'>
      <Box className='policy-sticky'>
        <Grid container>
          <Grid item lg={6} sm={6} xs={12}>
            <Typography variant='h2'>Terms of Service</Typography>
          </Grid>
          <Grid item lg={6} sm={6} xs={12} className='policy-head'>
            <CustomSelect
              fullWidth
              IconComponent={KeyboardArrowDownRoundedIcon}
              className="selectDropDownBox select-dropdown policy-dropdown"
              MenuProps={MenuProps}
              value={selectedtermsAndConditions}
              onChange={handlePolicyChange}
            >
              {termsAndConditionsList?.map((v, index) => {
                return (
                  <MenuItem className='selectDropDownList' value={v.id} key={index}>
                    {v.title}
                  </MenuItem>
                )
              })}
            </CustomSelect>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Box mb={5} id="welcome-to-stallion-match">
          <Typography variant='h4'>Welcome to Stallion Match</Typography>
          <Typography variant='h6'><strong>WHAT PARTS OF THESE TERMS APPLY TO ME?</strong></Typography>
          <Typography variant='h6'>This agreement governs your use of the Platform and any other services made available through the Platform. By using the Platform, you agree to be bound by this agreement which forms a binding contractual agreement between you, the User, and us, G1 Racesoft Pty Ltd ABN 93 110 444 007 trading as &ldquo;Stallion Match&rdquo; (Stallion Match, we or us).</Typography>
          <Typography variant='h6'>The remainder of this agreement is divided into three parts:</Typography>
          <Typography variant='h6'>
            <p>
              &#x2022; <Link onClick={() => handleScroll('part-A-all-users')}>Part A</Link>, which sets out the terms that apply to all Users;<br />
              &#x2022; <Link onClick={() => handleScroll('part-B-farm-users')}>Part B</Link>, which sets out the terms that apply to all Farm Users; and<br />
              &#x2022; <Link onClick={() => handleScroll('part-C-registered-users')}>Part C</Link>, which sets out the terms that apply to Registered Users.
            </p>
          </Typography>
          <Typography variant='h6'>
            If you intend to use the Platform as a Farm User, only Parts A and B of these terms will apply to you.</Typography>
          <Typography variant='h6'>If you intend to use the Platform as an Anonymous User, only Parts A and C of these terms will apply to you.</Typography>
          <Typography variant='h6'>If you intend to use the Platform as a Registered User, only Parts A and C of these terms will apply to you.&nbsp;</Typography>
          <Typography variant='h6'>When we talk about the &ldquo;Services&rdquo; in this agreement, we are referring to the Services that apply in relation to each User Type which are offered through our website,<br /> <Link underline='none' className='no-underline'>https://stallionmatch.com</Link></Typography>
        </Box>

        <Box mb={3} id="part-A-all-users">
          <Typography variant='h4'>Part A - All Users</Typography>
          <Typography variant='h6'>
            <strong>1. DEFINITIONS</strong>
          </Typography>
          <Typography variant='h6'>
            (a)	To help you read and understand this agreement, we've set out in the table below the definitions of key terms that you need to understand. You need to understand the key terms because we use them throughout this agreement.
          </Typography>
          <Typography variant='h6'>
            (b)	If a key word is only used within a particular clause, the defined term is the words bolded and in brackets, and the meaning of the defined term is the words / sentence that comes before the bolded words.
          </Typography>
          <Typography variant='h6'>
            <strong>Anonymous Users</strong> means a User who is able to:
          </Typography>
          <Typography variant='h6'>
            &#x2022; access all marketing pages (including the home page, farm pages, the Stallion Directory and the Farm Directory);<br />
            &#x2022; contact Farms and Stallion Listings via an online form;<br />
            &#x2022; submit Nomination Requests;<br />
            &#x2022; run Stallion Match searches;<br />
            &#x2022; view basic Stallion Match trends via the trends page; and<br />
            &#x2022; order any available reports.
          </Typography>
          <Typography variant='h6'>
            <strong>Farms</strong> means a profile created to represent a Farm, managed by a Farm User who uses the Platform to advertise and communicate to a global breeder network.
          </Typography>
          <Typography variant='h6'>
            <strong>Farm Mare Lists</strong> means a list created by a Farm User which lists a group of mares, including but not limited to mares currently residing on or connected to the farm in some way.
          </Typography>
          <Typography variant='h6'>
            <strong>Farm User</strong> means a User who has access to all Registered User functionalities, as well as access to the following functionalities (upon payment of the Farm User Fees):
          </Typography>
          <Typography variant='h6'>
            &#x2022; access to the Farm Dashboard with a high level of farm-specific analytics;<br />
            &#x2022; access to Stallion Listing and Farm notifications (messages, notifications, searches, results);<br />
            &#x2022; ability to manage details for existing Stallion Listings (including but not limited to updates to the requested Nomination Fee, listing status [active/not], and responding to and accepting or rejecting Nomination Requests);<br />
            &#x2022; ability to create multiple Stallion Listings;<br />
            &#x2022; ability to remove Stallion Listings;<br />
            &#x2022; ability to add Farm Mare lists; and<br />
            &#x2022; ability to invite new Registered Users and/or Farm Users.
          </Typography>
          <Typography variant='h6'>
            <strong>Fees</strong> <br />
            <span>Stallion Listing Fee:</span> means the fee payable by Farm Users for each Stallion Listing, as set out on the Platform.<br />
            <span>Farm User Fee:</span> means the annual fee(s) payable by Farm Users for their use of the Farm User functionalities. The fee(s) payable for such functionalities are as set out on the Platform or as charged by Stallion Match to the Farm User from time to time.<br />
            <span>Introduction Fee:</span> means the fee payable by the Farm User to Stallion Match, as set out in clause <Link onClick={() => handleScroll('introduction-fee')}>5.1(c)</Link> of Part B.
          </Typography>
          <Typography variant='h6'>
            <strong>Paid Reports</strong> means the reports that are available for purchase by all Users of the Platform. Such reports look at identifying successes and failures of hypothetical matings. Further information regarding Paid Reports can be found on the Platform.
          </Typography>
          <Typography variant='h6'>
            <strong>Platform</strong> means this platform, having the URL <Link>https://www.stallionmatch.com</Link> and any other websites or applications owned or operated by Stallion Match with the same domain name and a different extension or otherwise for the same or similar purposes as this platform.
          </Typography>
          <Typography variant='h6'>
            <strong>Registered User</strong> means a User who has access to all Anonymous User functionalities, as well as:
          </Typography>
          <Typography variant='h6'>
            &#x2022; the ability to add horses to their favourites list (Stallions, Broodmare Sires, and Broodmares) to track information;<br />
            &#x2022; the ability to add Farms to their favourites list to stay updated;<br />
            &#x2022; access to a personalised dashboard which is updated frequently (including suggestions, recent search history, Farm updates, messages and notifications);<br />
            &#x2022; access to the communications platform to chat directly with Farms and their Farm Users;<br />
            &#x2022; ability to view Stallion Match specific trends (# searches, results, etc); and<br />
            &#x2022; ability to manage their profile (including but not limited to updating personal details, payment methods, social account links, order history and notification settings).
          </Typography>
          <Typography variant='h6'>
            <strong>Services</strong> means the services available to each User type through our Platform.
          </Typography>
          <Typography variant='h6'>
            <strong>Nomination Request:</strong> As defined in clause <Link onClick={() => handleScroll('broodmare-nomination-request')}>5.1(d)</Link> of Part B.
          </Typography>
          <Typography variant='h6'>
            <strong>Stallion Listing(s):</strong> As set out in <Link onClick={() => handleScroll('stallion-listing')}>clause 3</Link> of Part B.
          </Typography>
          <Typography variant='h6'>
            <strong>User:</strong> Any person that uses the Platform in any capacity, including Anonymous Users, Registered Users and Farm Users.
          </Typography>
          <Typography variant='h6' pt={5}>
            <strong>2. ELIGIBILITY</strong></Typography>
          <Typography variant='h6'>(a)	This Platform is not intended for unsupervised use by any person under the age of 18 years old or any person who has previously been suspended or prohibited from using the Platform. By using the Platform, you represent and warrant that you are either:</Typography>
          <Typography variant='h6'>(i)	over the age of 18 years and accessing the Platform for personal use; or</Typography>
          <Typography variant='h6'>(ii)	accessing the Platform on behalf of someone under the age of 18 years old and consent to that person’s use of the Platform.</Typography>
          <Typography variant='h6'>(b)	Please do not access the Platform if you are under the age of 18 years old and do not have your parent or guardian’s consent, or if you have previously been suspended or prohibited from using the Platform.</Typography>
          <Typography variant='h6'>(c)	If you use the Platform on behalf of a company or organisation you warrant that you have the necessary authority from that company or organisation to do so. If you are signing up not as an individual but on behalf of your company, your employer, an organisation, government or other legal entity (Represented Entity), then “you” or “User” means the Represented Entity and you are binding the Represented Entity to this agreement. If you are accepting this agreement and using our Services on behalf of a Represented Entity, you represent and warrant that you are authorised to do so.
          </Typography>

          <Typography variant='h6' pt={5}>
            <strong>3. ACCOUNTS</strong></Typography>
          <Typography variant='h6'>(a)	Users have the option, and in order to use most of the functionality of the Platform, may be required to sign-up, register and receive an account through the Platform (an <strong>Account</strong>).</Typography>
          <Typography variant='h6'>(b)	As part of the Account registration process and as part of your continued use of the Platform, you are required to provide personal information and details, such as your email address, first and last name, your country and other information as determined by Stallion Match from time to time.</Typography>
          <Typography variant='h6'>(c)	You warrant that any information you give to Stallion Match in the course of completing the Account registration process will always be accurate, honest, correct and up to date.</Typography>
          <Typography variant='h6'>(d)	You may register for an Account using your Google or Twitter account (<strong>Social Media Account</strong>). If you sign into your Account using your Social Media Account, you authorise us to access certain information on your Social Media Account, including but not limited to your current profile photo and other basic information.</Typography>
          <Typography variant='h6'>(e)	Correspondence between Users must take place on the Platform. You agree to ensure that your Account does not display any of your personal contact information at any time such that it can be viewed by any other User. You agree to not give your contact details to any other User.</Typography>
          <Typography variant='h6'>(f)	Once you complete the Account registration process, Stallion Match may, in its absolute discretion, choose to accept you as a registered user within the Platform and provide you with an Account.</Typography>
          <Typography variant='h6'>(g)	Stallion Match reserves the right to contact you about any concerning behaviour by you, or to seek a resolution with you.</Typography>
          <Typography variant='h6'>(h)	Stallion Match may, in its absolute discretion, suspend or cancel your Account for any reason, including for any failure to comply with this agreement.</Typography>
          <Typography variant='h6'>(i)	You may be required to use a third-party payment platform in making or receiving any payments via the Platform (<strong>Third Party Payment Platform</strong>) and, if so required, you warrant that you have read, understood and agree to be bound by the relevant terms, including but not limited to:</Typography>
          <Typography variant='h6'>
            <p>
              (a)	Stripe’s terms at <a href='https://stripe.com/au/legal/ssa' target='_blank'>https://stripe.com/au/legal;</a><br />
              (b)	Stripe’s privacy policy at <a href='https://stripe.com/en-au/privacy' target='_blank'>https://stripe.com/en-au/privacy;</a><br />
              (c)	PayPal’s terms at <a href='https://www.paypal.com/au/webapps/mpp/ua/useragreement-full' target='_blank'>https://www.paypal.com/au/webapps/mpp/ua/useragreement-full;</a><br />
              (d)	PayPal’s privacy policy at <a href='https://www.paypal.com/au/webapps/mpp/ua/privacy-full' target='_blank'>https://www.paypal.com/au/webapps/mpp/ua/privacy-full;</a> and<br />
              (e)	the terms of use and privacy policies of other Third Party Payment Platforms, as made available on their websites from time to time.
            </p>
          </Typography>
          <Typography variant='h6' pt={5}>
            <strong>4. USER OBLIGATIONS</strong></Typography>
          <Typography variant='h6'>As a User, you agree:</Typography>
          <Typography variant='h6'>(a)	not to intimidate, harass, impersonate, stalk, threaten, bully or endanger any other User or distribute unsolicited commercial content, junk mail, spam, bulk content or harassment;</Typography>
          <Typography variant='h6'>(b)	to not share your Account with any other person and that any use of your Account by any other person is strictly prohibited. You must immediately notify Stallion Match of any unauthorised use of your Account, password or email, or any other breach or potential breach of the Platform’s security;</Typography>
          <Typography variant='h6'>(c)	to not use the Platform for any purpose other than for the purpose of making arrangements to provide or receive services, including by not using the Platform:</Typography>
          <Typography variant='h6'><p>(i)	in a manner that is illegal or fraudulent or facilitates illegal or fraudulent activity (including requesting or accepting a job which includes illegal activities or      purposes); and<br />
            (ii)	in connection with any commercial or money making or other promotional or marketing endeavours except those that are endorsed herein, or as approved in writing by Stallion Match;</p></Typography>
          <Typography variant='h6'>(d)	not to act in any way that may harm the reputation of Stallion Match or associated or interested parties or do anything at all contrary to the interests of Stallion Match or the Platform; </Typography>
          <Typography variant='h6'>(e)	not to make any automated use of the Platform and you must not copy, reproduce, translate, adapt, vary or modify the Platform without the express written consent of Stallion Match; </Typography>
          <Typography variant='h6'>(f)	that Stallion Match may change any features of the Platform or Services offered through the Platform at any time without notice to you;</Typography>
          <Typography variant='h6'>(g)	that information given to you through the Platform, by Stallion Match or another User is general in nature and we take no responsibility for anything caused by any actions you take in reliance on that information; and</Typography>
          <Typography variant='h6'>(h)	that Stallion Match may cancel your account at any time if it considers, in its absolute discretion, that you are in breach or are likely to breach this clause 4.</Typography>

          <Typography variant='h6' pt={5}><strong>5. POSTED MATERIALS</strong></Typography>
          <Typography variant='h6'><strong>5.1	WARRANTIES</strong></Typography>
          <Typography variant='h6'>By providing or posting any information, materials or other content on the Platform (Posted Material), you represent and warrant that:</Typography>
          <Typography variant='h6'>(a)	you are authorised to provide the Posted Material (including by being authorised to provide any services that you represent you provide);</Typography>
          <Typography variant='h6'>(b)	the Posted Material is accurate and true at the time it is provided;</Typography>
          <Typography variant='h6'>(c)	the Posted Material is free from any harmful, discriminatory, defamatory or maliciously false implications and does not contain any offensive or explicit material;</Typography>
          <Typography variant='h6'>(d)	the Posted Material is not “passing off” of any product or service and does not constitute unfair competition;</Typography>
          <Typography variant='h6'>(e)	the Posted Material does not infringe any Intellectual Property Rights, including copyright, trademarks, business names, patents, confidential information or any other similar proprietary rights, whether registered or unregistered, anywhere in the world;</Typography>
          <Typography variant='h6'>(f)	the Posted Material does not contain any viruses or other harmful code, or otherwise compromise the security or integrity of the Platform or any network or system; and</Typography>
          <Typography variant='h6'>(g)	the Posted Material does not breach or infringe any applicable laws.</Typography>
          <Typography variant='h6'><strong>5.2	LICENCE</strong></Typography>
          <Typography variant='h6'>(a)	You grant to Stallion Match a perpetual, irrevocable, transferable, worldwide and royalty-free licence (including the right to sublicense) to use, copy, modify, reproduce and adapt any Intellectual Property Rights in any Posted Material in order for Stallion Match to use, exploit or otherwise enjoy the benefit of such Posted Material.</Typography>
          <Typography variant='h6'>(b)	If it is determined that you retain moral rights (including rights of attribution or integrity) in any Posted Material, you forever release Stallion Match from any and all claims that you could assert against Stallion Match by virtue of any such moral rights.</Typography>
          <Typography variant='h6'>(c)	You indemnify Stallion Match against all damages, losses, costs and expenses incurred by Stallion Match arising out of any third-party claim that your Posted Material infringes any third party’s Intellectual Property Rights.</Typography>
          <Typography variant='h6'><strong>5.3	REMOVAL</strong></Typography>
          <Typography variant='h6'>(a)	Stallion Match acts as a passive conduit for the online distribution of Posted Material and has no obligation to screen Posted Material in advance of it being posted. However, Stallion Match may, in its absolute discretion, review and remove any Posted Material (including links to you, your profile or listings (including Stallion Listings) you have posted on the Platform) at any time without giving any explanation or justification for removing the Posted Material.<br />
            (b)	You agree that you are responsible for keeping and maintaining records of Posted Material.</Typography>

          <Typography variant='h6' pt={5}><strong>6. REFUNDS, SERVICE INTERRUPTIONS AND CANCELLATIONS</strong></Typography>
          <Typography variant='h6'>Stallion Match will have no liability or obligation to you if:</Typography>
          <Typography variant='h6'>(a) a User cancels at any time after the time the Stallion Listing is accepted or agreed; or </Typography>
          <Typography variant='h6'>(b) for whatever reason, including technical faults, or if the services in a Stallion Listing cannot be performed or completed,</Typography>
          <Typography variant='h6'>and you will not be entitled to any compensation from Stallion Match.</Typography>

          <Typography variant='h6' pt={5}><strong>7. IDENTITY VERIFICATION</strong></Typography>
          <Typography variant='h6'>(a)	(<strong>Verification</strong>) We may offer or require Users to verify their details by using our processes or an external identity verification service as applicable (<strong>Verification Service</strong>).</Typography>
          <Typography variant='h6'>(b) (<strong>Your personal information and privacy</strong>) We will collect your personal information in accordance with our Privacy Policy as set out in clause 17. Where a Verification Service is used, you acknowledge and agree that: </Typography>
          <p>
            <Typography variant='h6'>
              (i)	we may contact and share your personal information with a Verification Service to verify your details;</Typography>
            <Typography variant='h6'>
              (ii)	you consent to us receiving, sharing and using this information to enable us to carry out the Verification Service.
            </Typography>
          </p>
          <Typography variant='h6'>(c) (<strong>Warranty and Indemnity</strong>) You acknowledge and agree that:</Typography>
          <p>
            <Typography variant='h6'>(i)	we are reliant on the information provided by the Verification Service to verify your identity and to the extent permitted by law, we disclaim all warranties that the  Verification Service will be accurate or guarantee that the Verification Service will ensure you contract with a suitable User; </Typography>
            <Typography variant='h6'>(ii)	you should make your own inquiries as to other Users’ identities before engaging in contracts with those Users; and</Typography>
            <Typography variant='h6'>(iii)	we do not endorse any User or Verification Service.</Typography>
          </p>
          <Typography variant='h6' pt={5}><strong>8. PAID REPORTS</strong></Typography>
          <Typography variant='h6'>If a User purchases Paid Reports, the following terms and conditions apply unless otherwise specifically agreed in writing:</Typography>
          <Typography variant='h6'>(a)	any information or recommendations provided to the User in relation to the Paid Reports are opinion only, based on:</Typography>
          <Typography variant='h6'>
            <p>
              (i)	the information provided by the User to Stallion Match; and<br />
              (ii)	historical data (since 2011) and predictive algorithms.
            </p>
          </Typography>
          <Typography variant='h6'>(b)	the User must make its own assessments of its requirements and the suitability of the Paid Reports to its particular circumstances and needs; and</Typography>
          <Typography variant='h6'>(c)	Stallion Match does not guarantee any particular outcome, or any particular decision from any third party, on any issue, if the User relies on the Paid Reports.</Typography>

          <Typography variant='h6' pt={5}><strong>9. SERVICE LIMITATIONS</strong></Typography>
          <Typography variant='h6'>The Platform is made available to you strictly on an ‘as is’ basis. Without limitation, you acknowledge and agree that Stallion Match cannot and does not represent, warrant or guarantee that:</Typography>
          <Typography variant='h6'>(a)	the Platform will be free from errors or defects;</Typography>
          <Typography variant='h6'>(b)	the Platform will be accessible at all times;</Typography>
          <Typography variant='h6'>(c)	messages sent through the Platform will be delivered promptly, or delivered at all;</Typography>
          <Typography variant='h6'>(d)	information you receive or supply through the Platform will be secure or confidential; or</Typography>
          <Typography variant='h6'>(e)	any information provided through the Platform is accurate or true.</Typography>
          <Typography variant='h6' pt={5}><strong>10. INTELLECTUAL PROPERTY</strong></Typography>
          <Typography variant='h6'>(a) All Intellectual Property Rights in the Developed IP will immediately vest in Stallion Match as those rights are created. Unless otherwise agreed in writing, the User will not acquire Intellectual Property Rights in any Stallion Match IP or Developed IP under this agreement.</Typography>
          <Typography variant='h6'>(b)	Stallion Match grants to the User a non-exclusive, royalty-free, non-transferable and revocable licence to use Stallion Match IP and any Developed IP to the extent required for the User to use, enjoy the benefit of, or exploit the Services.</Typography>
          <Typography variant='h6'>(c)	The User grants to Stallion Match (and its subcontractors, employees and agents) a non-exclusive, royalty free, non-transferable, worldwide and irrevocable licence to use the User Content to the extent reasonably required to perform any part of the Services.</Typography>
          <Typography variant='h6'>(d)	The User warrants that Stallion Match’s use of User Content will not infringe any third-party Intellectual Property Rights. The User indemnifies Stallion Match from and against all losses, claims, expenses, damages and liabilities or costs which may arise out of such infringement.</Typography>
          <Typography variant='h6'>(e)	(Definitions) In this agreement:</Typography>
          <p>
            <Typography variant='h6'>(i)	“<strong>User Content</strong>” means any Material supplied by the Client to Stallion Match under or in connection with this agreement, including any Intellectual Property Rights attaching to that Material;</Typography>
            <Typography variant='h6'>(ii)	“<strong>Developed IP</strong>” means any Material produced by Stallion Match in the course of providing the Services, either alone or in conjunction with the Unregistered User or others, and any Intellectual Property Rights attaching to that Material;</Typography>
            <Typography variant='h6'>(iii)	“<strong>Intellectual Property Rights</strong>” means any and all present and future intellectual and industrial property rights throughout the world (whether registered or unregistered), including copyright, trademarks, designs, patents, moral rights, semiconductor and circuit layout rights, trade, business, company and domain names, and other proprietary rights, trade secrets, know-how, technical data, confidential information and the right to have information kept confidential, or any rights to registration of such rights (including renewal), whether created before or after the date of this agreement;</Typography>
            <Typography variant='h6'>(iv)	“<strong>Stallion Match IP</strong>” means all Material owned or licensed by Stallion Match that is not Developed IP and any Intellectual Property Rights attaching to that Material; and</Typography>
            <Typography variant='h6'>(v)	“<strong>Material</strong>” means tangible and intangible information, content, guidelines, manuals, documents, reports, drawings, and designs.</Typography>
          </p>
          <Typography variant='h6' pt={5}><strong>11. THIRD PARTY CONTENT</strong></Typography>
          <Typography variant='h6'>The Platform may contain text, images, data and other content provided by a third party and displayed on the Platform (<strong>Third Party Content</strong>). Stallion Match accepts no responsibility for Third Party Content and makes no representation, warranty or guarantee about the quality, suitability, accuracy, reliability, currency or completeness of Third-Party Content.</Typography>
          <Typography variant='h6' pt={5}><strong>12. THIRD PARTY TERMS</strong></Typography>
          <Typography variant='h6'>(a)	Any service that requires Stallion Match to acquire goods and services supplied by a third party on behalf of the User (including a third-party payment service) may be subject to the terms and conditions of that third party (<strong>Third Party Terms</strong>), including ‘no refund’ policies.</Typography>
          <Typography variant='h6'>(b)	Users agree to familiarise themselves with any Third-Party Terms applicable to any such goods and services and, by instructing Stallion Match to acquire the goods or services on the User’s behalf, the User will be taken to have agreed to such Third Party Terms.</Typography>
          <Typography variant='h6' pt={5} id="disputes"><strong>13. DISPUTES BETWEEN USERS</strong></Typography>
          <Typography variant='h6'>(a)	You should direct any complaint relating to another User to that User. Users must take all reasonable steps to resolve any dispute with another User with that User.</Typography>
          <Typography variant='h6'>(b)	If any issue or problem relating to the Platform remains unresolved after directing a complaint to a relevant User, or if the complaint does not relate to another User, you must report it to Stallion Match via <a href='mailto:complaints@stallionmatch.com'>complaints@stallionmatch.com</a> We will assess the complaint and attempt to quickly and satisfactorily resolve it.</Typography>
          <Typography variant='h6'>(c)	Any costs you incur in relation to a complaint or dispute will be your responsibility.</Typography>
          <Typography variant='h6'>(d)	Stallion Match has the option to appoint an independent mediator or arbitrator if needed. The cost of any mediator or arbitrator must be shared equally between each of the parties to the dispute.</Typography>
          <Typography variant='h6'>(e)	Stallion Match reserves the right to hold funds in relation to a dispute until the dispute is resolved by the relevant parties or by a mediator or arbitrator.</Typography>
          <Typography variant='h6'>(f)	If you have a dispute with Stallion Match, you agree to notify us first and enter into discussion, mediation or arbitration with us for a minimum of a 120-day period before pursuing any other proceedings.</Typography>
          <Typography variant='h6'>(g)	Notwithstanding any other provision of this <Link onClick={() => handleScroll('disputes')}>clause 13,</Link> you or Stallion Match may at any time cancel your Account or discontinue your use of the Platform.</Typography>

          <Typography variant='h6' pt={5}><strong>14. SECURITY</strong></Typography>
          <Typography variant='h6'>Stallion Match does not accept responsibility for loss or damage to computer systems, mobile phones or other electronic devices arising in connection with your use of the Platform. You should take your own precautions to ensure that the process you employ to access the Platform does not expose you to the risk of viruses, malicious computer code or other forms of interference.</Typography>
          <Typography variant='h6' pt={5}><strong>15. DISCLAIMER</strong></Typography>
          <Typography variant='h6'>(a)	(<strong>Introduction service</strong>) Stallion Match is a medium that facilitates the introduction of Users (including Anonymous Users, Registered Users and Farm Users) for the purposes of thoroughbred breeding. Stallion Match simply collects the Fees in consideration for providing this introduction service and does not have any obligations or liabilities to, and is not a party to any contract between, Users and Registered Users in relation to such services or otherwise resulting from the introduction.</Typography>
          <Typography variant='h6'>(b)	(<strong>Limitation of liability</strong>) To the maximum extent permitted by applicable law, Stallion Match excludes completely all liability to any person for loss or damage of any kind, however arising whether in contract, tort (including negligence), statute, equity, indemnity or otherwise, arising from or relating in any way to the Platform or its use or any services provided by any Farm User. This includes the transmission of any computer virus.</Typography>
          <Typography variant='h6'>(c)	(<strong>Disclaimer</strong>) All express or implied representations and warranties are, to the maximum extent permitted by applicable law, excluded.</Typography>
          <Typography variant='h6'>(d)	(<strong>Consumer law</strong>) Nothing in this agreement is intended to limit the operation of the Australian Consumer Law contained in the Competition and Consumer Act 2010 (Cth) (ACL). Under the ACL, you may be entitled to certain remedies (like a refund, replacement or repair) if there is a failure with the goods or services we provide.</Typography>
          <Typography variant='h6'>(e)	(<strong>Indemnity</strong>) You agree to indemnify Stallion Match and its employees and agents in respect of all liability for loss, damage or injury which may be suffered by any person arising from you or your representatives’:</Typography>
          <Typography variant='h6'>
            <p>
              (i)	breach of any term of this agreement;<br />
              (ii)	use of the Platform; or<br />
              (iii)	your provision or receipt of Services from another User.
            </p>
          </Typography>
          <Typography variant='h6'>
            (f)	(<strong>Consequential loss</strong>) To the maximum extent permitted by law, under no circumstances will Stallion Match be liable for any incidental, special or consequential loss or damages, or damages for loss of data, business or business opportunity, goodwill, anticipated savings, profits or revenue arising under or in connection with the Platform, this agreement or their subject matter, or any services provided by any Farm User (except to the extent this liability cannot be excluded under the Competition and Consumer Act 2010 (Cth)).</Typography>

          <Typography variant='h6' pt={5}><strong>16. CONFIDENTIALITY</strong></Typography>
          <Typography variant='h6'>You agree that:</Typography>
          <Typography variant='h6'>(a)	no information owned by Stallion Match, including system operations, documents, marketing strategies, staff information and client information, may be disclosed or made available to any third parties; and</Typography>
          <Typography variant='h6'>(b)	all communications involving the details of other Users on this Platform are confidential, and must be kept as such by you and must not be distributed nor disclosed to any third party.</Typography>
          <Typography variant='h6' pt={5}><strong>17. PRIVACY</strong></Typography>
          <Typography variant='h6'>You agree to be bound by the clauses outlined in Stallion Match’s Privacy Policy, which can be accessed here <LinkTo to={`/about/privacy-policy`}>link</LinkTo>.</Typography>
          <Typography variant='h6' pt={5}><strong>18. COLLECTION NOTICE</strong></Typography>
          <Typography variant='h6'>
            (a)	We collect personal information about you in order to enable you to access and use the Platform, to contact and communicate with you, to respond to your enquiries and for other purposes set out in our <LinkTo to={`/about/privacy-policy`}>Privacy Policy.</LinkTo></Typography>
          <Typography variant='h6'>
            (b)	Our <LinkTo to={`/about/privacy-policy`}>Privacy Policy</LinkTo> contains more information about how we use, disclose and store your information and details how you can access and correct your personal information.
          </Typography>
          <Typography variant='h6' pt={5}><strong>19. TERMINATION</strong></Typography>
          <Typography variant='h6'>(a)	Stallion Match reserves the right to terminate a User’s access to any or all of the Platform (including any listings or Accounts) at any time without notice, for any reason.</Typography>
          <Typography variant='h6'>(b)	In the event that a User’s Account is terminated, the User’s access to all posting tools on the Platform will be revoked, and all Stallion Listings previously posted by the User will also be removed from the Platform. </Typography>
          <Typography variant='h6'>(c)	Users may terminate their Account, and any other listings (including Stallion Listings) they hold in connection with the Platform, at any time by using the Platform’s functionality, where such functionality is available. Where such functionality is not available, Stallion Match will effect such termination within a reasonable time after receiving written notice from the User.</Typography>
          <Typography variant='h6'>(d)	Notwithstanding termination or expiry of your Account, the provisions of Part A and any other provision in this agreement which by its nature would reasonably be expected to be complied with after termination or expiry, will continue to apply.</Typography>
          <Typography variant='h6' pt={5}><strong>20. TAX</strong></Typography>
          <Typography variant='h6'>You are responsible for the collection and remission of all taxes associated with the services you provide or receive or any transactions through your use of the Platform, and Stallion Match will not be held accountable in relation to any transactions between Users and Registered Users where tax related misconduct has occurred.</Typography>
          <Typography variant='h6' pt={5}><strong>21. RECORD / AUDIT</strong></Typography>
          <Typography variant='h6'>To the extent permitted by law, Stallion Match reserves the right to keep all records of any and all transactions and communications made through this Platform between you and other Users (including conversations, user posts, Stallion Listings, Nomination Requests, comments, feedback, cookies, and I.P. address information) for administration purposes and also holds the right to produce these records in the event of any legal dispute involving Stallion Match.</Typography>
          <Typography variant='h6' pt={5}><strong>22. NOTICES</strong></Typography>
          <Typography variant='h6'>(a)	A notice or other communication to a party under this agreement must be:</Typography>
          <p>
            <Typography variant='h6'>(i)	in writing and in English; and</Typography>
            <Typography variant='h6'>(ii)	delivered via email to the other party, to the email address specified in this agreement, or if no email address is specified in this agreement, then the email address most regularly used by the parties to correspond regarding the subject matter of this agreement as at the date of this agreement (Email Address). The parties may update their Email Address by notice to the other party.</Typography>
          </p>
          <Typography variant='h6'>(b)	Unless the party sending the notice knows or reasonably ought to suspect that an email was not delivered to the other party’s Email Address, notice will be taken to be given:</Typography>
          <p>
            <Typography variant='h6'>(i)	24 hours after the email was sent, unless that falls on a Saturday, Sunday or a public holiday in the state or territory whose laws govern this agreement, in which case the notice will be taken to be given on the next occurring business day in that state or territory; or</Typography>
            <Typography variant='h6'>(ii)	when replied to by the other party,</Typography>
          </p>
          <Typography variant='h6'>whichever is earlier.</Typography>

          <Typography variant='h6' pt={5}><strong>23. GENERAL</strong></Typography>
          <Typography variant='h3'>23.1	GOVERNING LAW AND JURISDICTION</Typography>
          <Typography variant='h6'>This agreement is governed by the law applying in New South Wales, Australia. Each party irrevocably submits to the exclusive jurisdiction of the courts of New South Wales and courts of appeal from them in respect of any proceedings arising out of or in connection with this agreement. Each party irrevocably waives any objection to the venue of any legal process on the basis that the process has been brought in an inconvenient forum.</Typography>
          <Typography variant='h3'>23.2	WAIVER</Typography>
          <Typography variant='h6'>No party to this agreement may rely on the words or conduct of any other party as a waiver of any right unless the waiver is in writing and signed by the party granting the waiver.</Typography>
          <Typography variant='h3'>23.3	SEVERANCE</Typography>
          <Typography variant='h6'>Any term of this agreement which is wholly or partially void or unenforceable is severed to the extent that it is void or unenforceable. The validity and enforceability of the remainder of this agreement is not limited or otherwise affected.</Typography>
          <Typography variant='h3'>23.4	JOINT AND SEVERAL LIABILITY</Typography>
          <Typography variant='h6'>An obligation or a liability assumed by, or a right conferred on, two or more persons binds or benefits them jointly and severally.</Typography>
          <Typography variant='h3'>23.5	ASSIGNMENT</Typography>
          <Typography variant='h6'>A party cannot assign, novate or otherwise transfer any of its rights or obligations under this agreement without the prior written consent of the other party.</Typography>
          <Typography variant='h3'>23.6	COSTS</Typography>
          <Typography variant='h6'>Except as otherwise provided in this agreement, each party must pay its own costs and expenses in connection with negotiating, preparing, executing and performing this agreement.</Typography>
          <Typography variant='h3'>23.7	ENTIRE AGREEMENT</Typography>
          <Typography variant='h6'>This agreement embodies the entire agreement between the parties and supersedes any prior negotiation, conduct, arrangement, understanding or agreement, express or implied, in relation to the subject matter of this agreement.</Typography>
          <Typography variant='h3'>23.8	INTERPRETATION</Typography>
          <Typography variant='h6'>(a)	(<strong>singular and plural</strong>) words in the singular includes the plural (and vice versa);</Typography>
          <Typography variant='h6'>(b)	(<strong>gender</strong>) words indicating a gender includes the corresponding words of any other gender;</Typography>
          <Typography variant='h6'>(c)	(<strong>defined terms</strong>) if a word or phrase is given a defined meaning, any other part of speech or grammatical form of that word or phrase has a corresponding meaning;</Typography>
          <Typography variant='h6'>(d)	(<strong>person</strong>) a reference to “person” or “you” includes an individual, the estate of an individual, a corporation, an authority, an association, consortium or joint venture (whether incorporated or unincorporated), a partnership, a trust and any other entity;</Typography>
          <Typography variant='h6'>(e)	(<strong>party</strong>) a reference to a party includes that party’s executors, administrators, successors and permitted assigns, including persons taking by way of novation and, in the case of a trustee, includes any substituted or additional trustee;</Typography>
          <Typography variant='h6'>(f)	(<strong>this agreement</strong>) a reference to a party, clause, paragraph, schedule, exhibit, attachment or annexure is a reference to a party, clause, paragraph, schedule, exhibit, attachment or annexure to or of this agreement, and a reference to this agreement includes all schedules, exhibits, attachments and annexures to it;</Typography>
          <Typography variant='h6'>(g)	(<strong>document</strong>) a reference to a document (including this agreement) is to that document as varied, novated, ratified or replaced from time to time;</Typography>
          <Typography variant='h6'>(h)	(<strong>headings</strong>) headings and words in bold type are for convenience only and do not affect interpretation;</Typography>
          <Typography variant='h6'>(i)	(<strong>includes</strong>) the word “includes” and similar words in any form is not a word of limitation; and</Typography>
          <Typography variant='h6'>(j)	(<strong>adverse interpretation</strong>) no provision of this agreement will be interpreted adversely to a party because that party was responsible for the preparation of this agreement or that provision.</Typography>
        </Box>

        <Box mb={3} id="part-B-farm-users">
          <Typography variant='h4'>Part B - Farm Users</Typography>
          <Typography variant='h6'>
            <strong>1. ELIGIBILITY AND QUALIFICATIONS</strong>
          </Typography>
          <Typography variant='h6'>(a)	You must verify that any User is over 18 years old or has their parent or guardian’s consent to use the Platform.</Typography>
          <Typography variant='h6'>(b)	If in any of your Stallion Listings or anywhere on your Account you hold yourself out to possess certain qualifications (Qualifications), you warrant to Stallion Match that you do hold such Qualifications and if requested, will promptly provide Stallion Match with evidence of the Qualifications.</Typography>
          <Typography variant='h6' pt={5}><strong>2. SUBSCRIPTION TERM AND AUTOMATIC RENEWAL</strong></Typography>
          <Typography variant='h6'>(a) Your registration as a Farm User will have a registration term of 12 calendar months from the date that you first register (Registration Term).</Typography>
          <Typography variant='h6'>(b)	Your registration will start on the date you first register and will run for the Registration Term.</Typography>

          <Typography variant='h6' pt={5} id="stallion-listing"><strong>3. STALLION LISTINGS</strong></Typography>
          <Typography variant='h3'>3.1	CREATING A LISTING</Typography>
          <Typography variant='h6'>You acknowledge and agree that:</Typography>
          <Typography variant='h6'>(a)	you must use your best endeavours to provide as much information as possible in and all Stallion Listings and ensure that all information is true and accurate;</Typography>
          <Typography variant='h6'>(b)	each Stallion Listing includes a price guide that is reasonable in the circumstances;</Typography>
          <Typography variant='h6'>(c)	the Stallion Listing Fee applies to each and every Stallion Listing that you create;</Typography>
          <Typography variant='h6'>(d)	Stallion Match may choose not to accept any Stallion Listing you submit to the Platform, and Stallion Match may limit the number of Stallion Listings you can submit to the Platform;</Typography>
          <Typography variant='h6'>(e)	you must deal with any dispute with a User in accordance with <Link onClick={() => handleScroll('disputes')}>clause 13</Link > of <Link onClick={() => handleScroll('part-A-all-users')}>Part A</Link>;</Typography>
          <Typography variant='h6'>(f)	any additional terms and conditions relating to a Stallion Listing provided via the Platform are solely between you and the relevant User and do not involve Stallion Match in any way, except that they must not be inconsistent with your or the User’s obligations under this agreement; and</Typography>
          <Typography variant='h6'>(g)	Stallion Match will have no responsibility for the accuracy, reliability or timeliness of any User’s response to a Stallion Listing.</Typography>
          <Typography variant='h3'>3.2	BOOSTS</Typography>
          <Typography variant='h6'>(a)	Farm Users may leverage the database of Stallion Match and send Registered Users (who have not opted out) a personalised message regarding a stallion or an existing Stallion Listing (<strong>Boost</strong>). The fee for a Boost will vary depending on whether the Boost is local or extended and will be charged in the manner and for the amount set out on the Platform (<strong>Boost Fee</strong>).</Typography>
          <Typography variant='h6'>(b)	The Boost functionality is subject to a “fair usage” policy, under which you must not use the Boost functionality in a way that a reasonable person would consider to be unreasonable. Stallion Match reserves the right to determine whether the fair usage policy has been breached and restrict your ability to use or otherwise access the Boost functionality.</Typography>
          <Typography variant='h3'>3.3	RENEWAL</Typography>
          <Typography variant='h6'>(a)	Each Stallion Listing will have a registration term of 12 calendar months from the date that you first post the Stallion Listing (<strong>Listing Term</strong>) and an option to subscribe for an additional Listing Term of 12 calendar months (<strong>Listing Renewal Period</strong>).</Typography>
          <Typography variant='h6'>(b)	Your Stallion Listing will start on the date you first post the listing and will run for the Listing Term and then continue to automatically renew for the Listing Renewal Period at the end of each Listing Renewal Period unless you cancel your Stallion Listing or opt out of the auto-renewal feature on the Platform.</Typography>
          <Typography variant='h6' pt={5}><strong>4. PROVISIONS OF SERVICES</strong></Typography>
          <Typography variant='h6'>(a)	You must ensure that all specifications outlined in a Stallion Listing are provided:</Typography>
          <p>
            <Typography variant='h6'>(i)	in accordance with all applicable laws, regulations, tax obligations and industry standards;</Typography>
            <Typography variant='h6'>(ii)	with due care and skill and in a professional, punctual and diligent manner; and</Typography>
          </p>
          <Typography variant='h6'>
            (b)	You acknowledge and agree that you will take reasonable steps to ensure that each stallion promoted via a Stallion Listing is fit for its advertised and intended purpose.
          </Typography>
          <Typography variant='h6' pt={5} id="nomination-request"><strong>5. NOMINATION REQUESTS</strong></Typography>
          <Typography variant='h3'>5.1	DEFINITIONS</Typography>
          <Typography variant='h6'>For the purposes of this <Link onClick={() => handleScroll('nomination-request')}>clause 5</Link> and the rest of this agreement, the following capitalised terms have the following meanings:</Typography>
          <Typography variant='h6'>(a)	“<strong>Completed Referral</strong>” means an Introduction between a Farm User and a Registered User, performed by the Platform, which leads to the Registered User submitting a Nomination Request in relation to a Stallion Listing which is accepted by the Farm User, following which Stallion Match receives the Introduction Fee.</Typography>
          <Typography variant='h6'>(b)	“<strong>Introduction</strong>” means an introduction between a Farm User and a Registered User, where the introduction is facilitated by the Platform and results in the Registered User submitting a Nomination Request.</Typography>
          <Typography variant='h6' id="introduction-fee">(c)	“<strong>Introduction Fee</strong>” means:</Typography>
          {callDynamicIntroFeeForNomination()}
          <Typography variant='h6' id="broodmare-nomination-request">(d)	“<strong>Nomination Request</strong>” means a request submitted by a Registered or Anonymous User in response to a Stallion Listing, which sets out a monetary offer to breed the Registered User or Anonymous Users broodmare and the stallion described in the Stallion Listing.</Typography>
          <Typography variant='h3'>5.2	NOMINATION REQUESTS</Typography>
          <Typography variant='h6'>(a)	From time to time, all Registered Users may submit a Nomination Request in response to one of your Stallion Listings.</Typography>
          <Typography variant='h6'>(b)	When the Platform directs you to a Nomination Request, you will be able to view details of the Nomination Request, including the linked Stallion Listing and the details of the Registered User who submitted the request.</Typography>
          <Typography variant='h3'>5.3	INTRODUCTION FEE</Typography>
          <Typography variant='h6'>You acknowledge and agree that:</Typography>
          <Typography variant='h6'>(a)	subject to clause <Link onClick={() => handleScroll('invoice-introduction-fee')}>5.3(b)</Link>, upon accepting a Nomination Request, an invoice for the Introduction Fee will be generated and stored within your shopping cart in anticipation of checkout. Once checkout is completed, the Introduction Fee will be debited from the account linked to your Farm User Account; and</Typography>
          <Typography variant='h6' id="invoice-introduction-fee">(b)	 the Introduction Fee will only be payable in respect of an Introduction, if that Introduction is converted into a Completed Referral.</Typography>
          <Typography variant='h3'>5.4	COMPLETED REFERRALS</Typography>
          <Typography variant='h6'>(e)	An Introduction Fee will only be payable in respect of an Introduction, if it is converted into a Completed Referral.</Typography>
          <Typography variant='h6'>(f)	Where an Introduction converts to a Completed Referral, you will receive an email confirming that the offer has been accepted.</Typography>
          <Typography variant='h6'>(g)	A Farm or Farm User is under no obligation to pursue or respond to an Introduction or a Nomination Request, to convert it into a Completed Referral, or to attempt to do so.</Typography>
          <Typography variant='h6'>(h)	You acknowledge and agree that:</Typography>
          <p>
            <Typography variant='h6'>
              (i)	horse breeding is highly unpredictable and may be unsuccessful in the event of mare slipping and foaling difficulties. Despite providing the Introduction Fee, Stallion Match provides no guarantee regarding the outcome of the Nomination Request; and<br />
              (ii)	notwithstanding the outcome of a Nomination Request, all Introduction Fees are non-refundable.
            </Typography>
          </p>
          <Typography variant='h3'>5.5	RELATIONSHIP</Typography>
          <Typography variant='h6'>
            The relationship between Stallion Match and the Farm User is of a principal and an independent contractor. Nothing in this agreement constitutes or deems the Farm User to be an employee or agent of Stallion Match. Either party must not hold itself out as being entitled to contract or accept payment in the name of or on account of the other party.
          </Typography>
          <Typography variant='h3'>5.6	NO EXCLUSIVITY</Typography>
          <Typography variant='h6'>This agreement is not a commitment by the Farm User or Stallion Match to work exclusively with each other regarding referrals of work.</Typography>
          <Typography variant='h6' pt={5}><strong>6. PAYMENT AND FEES</strong></Typography>
          <Typography variant='h6'>(a) (<strong>Fees</strong>) Farm Users must pay the Fees in the manner and at the times set out under this agreement.</Typography>
          <Typography variant='h6'>(b) (<strong>Changes</strong>) Stallion Match reserves the right to change or waive the Fees at any time by written notice to you. We will provide you with at least 14 days’ written notice if this occurs, and upon receipt of such notice you will have the right to terminate this agreement immediately, on written notice to us. Your continued use of the Services after you receive such written notice will constitute your consent to the change and/or waiver set out in that notice.</Typography>
          <Typography variant='h6'>(c) (<strong>Card surcharges</strong>) The Third-Party Payment Platform may charge credit card surcharges in the event that payments are made using a credit, debit or charge card (including Visa, MasterCard or American Express).</Typography>

          <Typography variant='h6' pt={5}><strong>7. REFUNDS & CANCELLATIONS</strong></Typography>
          <Typography variant='h6'>(a)	Without limiting or otherwise affecting the terms of this agreement, if you wish to cancel a Stallion Listing, you must contact us using the Platform’s functionality, including by providing details as to why you are cancelling. If Stallion Match decides to investigate your request, you must provide assistance and information to Stallion Match as reasonably requested.</Typography>
          <Typography variant='h6'>(b)	If we accept your request to cancel a service set out in an accepted Stallion Listing, the relevant Stallion Listing will be deleted.</Typography>
          <Typography variant='h6'>(c)	The Farm User and Stallion Listing Fees are by default non-refundable for change of mind. However, Stallion Match may, in its absolute discretion, issue refunds of the Registered User or Stallion Listing Fees in extenuating circumstances.</Typography>
          <Typography variant='h6' pt={5} id="communications-platform"><strong>8. COMMUNICATION OUTSIDE THE PLATFORM</strong></Typography>
          <Typography variant='h6'>(a)	You agree that while you are a Farm User on the Platform and following cancellation of your Account (regardless of the reason that your Account was suspended or cancelled) you will not communicate with a Registered User, or request or entice a Registered User to communicate with you outside the Platform except in the course of carrying out or otherwise effecting a Completed Referral. This provision will apply whether or not the Registered User or their representative is still active on the Platform.</Typography>
          <Typography variant='h6'>(b)	Stallion Match, in its absolute discretion, may cancel your Account and suspend you from using the Platform if it finds or suspects that you have breached or are in breach of this <Link onClick={() => handleScroll('communications-platform')}>clause 8.</Link></Typography>

          <Typography variant='h6' pt={5}><strong>9. WARRANTIES</strong></Typography>
          <Typography variant='h6'>By posting a Stallion Listing or responding to a Nomination Request, you represent and warrant that:</Typography>
          <Typography variant='h6'>(a)	your Stallion Listing is a true representation of your stallion;</Typography>
          <Typography variant='h6'>(b)	you will provide access to the stallion specified in the Stallion Listing and otherwise in accordance with the Stallion Listing; and</Typography>
          <Typography variant='h6'>(c)	you will provide the stallion identified in the Stallion Listing to the relevant Registered User in compliance with all applicable laws.</Typography>



        </Box>

        <Box mb={3} id="part-C-registered-users">
          <Typography variant='h4'>Part C - Registered Users</Typography>
          <Typography variant='h6'><strong>1. ENGAGING WITH FARM USERS</strong></Typography>
          <Typography variant='h3'>1.1	STALLION LISTINGS AND REQUESTS</Typography>
          <Typography variant='h6'>(a) You acknowledge and agree that:</Typography>
          <p>
            <Typography variant='h6'>(i)	if you submit a Nomination Request, that will constitute your offer and intention to enter into a contract with the Farm or a Farm User (as the case may be);</Typography>
            <Typography variant='h6'>(ii)	for each Completed Referral, Stallion Match will take an Introduction Fee which will not be an additional charge to you; and</Typography>
            <Typography variant='h6'>(iii)	any terms and conditions relating to a Stallion Listing or Nomination Request provided via the Platform are solely between you and the relevant Farm User and do not involve Stallion Match in any way, except that such terms and conditions must not be inconsistent with your or the Farm User’s obligations under this agreement.</Typography>
          </p>
          <Typography variant='h6'>(b)	When you submit a Nomination Request on the Platform, you must: </Typography>
          <p>
            <Typography variant='h6'>(i)	only submit requests that are bona fide and accurate;</Typography>
            <Typography variant='h6'>(ii)	ensure that the Nomination Request is fair and reasonable within the context of the price guide advertised within the relevant Stallion Listing; and</Typography>
            <Typography variant='h6'>(iii)	truthfully fill out all the information requested by the Platform in relation to the Nomination Request.</Typography>
          </p>
          <Typography variant='h6'>(c)	You acknowledge that a Farm User is under no obligation to pursue or respond to an Introduction or a Nomination Request, or to convert it into a Completed Referral, or to attempt to do so.</Typography>
          <Typography variant='h3'>1.2	COMPLETED REFERRALS</Typography>
          <Typography variant='h6'>(a)	Where an Introduction converts to a Completed Referral, you will receive an email confirming that the offer has been accepted.</Typography>
          <Typography variant='h6'>(b)	A Farm or Farm User is under no obligation to pursue or respond to your Nomination Request, to convert it into a Completed Referral, or to attempt to do so.</Typography>
          <Typography variant='h6'>(c)	You acknowledge and agree that:</Typography>
          <p>
            <Typography variant='h6'>(i)	horse breeding is highly unpredictable and may be unsuccessful in the event of mare slipping and foaling difficulties. Stallion Match provides no guarantee regarding the outcome of the Nomination Request; and</Typography>
            <Typography variant='h6'>(ii) notwithstanding the outcome of a Nomination Request, you will be bound to any obligations placed upon you by virtue of the Breeding Terms.</Typography>
          </p>
          <Typography variant='h6' pt={5}><strong>2. LINKED BUSINESSES</strong></Typography>
          <Typography variant='h6'>You acknowledge and agree that:</Typography>
          <Typography variant='h6'>(a)	the Platform provides links and introductions to Anonymous and Registered Users owned and operated by third parties that are not under the control of Stallion Match;</Typography>
          <Typography variant='h6'>(b)	the provision by Stallion Match of introductions to Anonymous and Registered Users does not imply any endorsement or recommendation by Stallion Match of any Farm and/or Farm User.</Typography>
          <Typography variant='h6'>(c)	Stallion Match does not examine, determine or warrant the certification and/or licensing, competence, solvency or information of any Farm and/or Farm User who uses or is listed on the Platform; and</Typography>
          <Typography variant='h6'>(d)	any terms and conditions relating to a Stallion Listing provided via the Platform constitutes a contract between you and the Farm and/or Farm User once converted to a Completed Referral and do not involve Stallion Match in any way.</Typography>
          <Typography variant='h6' pt={5} id="communications"><strong>3. COMMUNICATIONS OUTSIDE THE PLATFORM</strong></Typography>
          <Typography variant='h6'>(a)	You agree that you will not communicate with a Farm User, or request or entice a Farm User to communicate with you outside the Platform except in the course of carrying out or otherwise effecting a Completed Referral. This provision will apply whether or not the Farm or Farm User is still active on the Platform.</Typography>
          <Typography variant='h6'>(b)	Stallion Match, in its absolute discretion, may:</Typography>
          <p>
            <Typography variant='h6'>(i)	cancel your Account; and/or</Typography>
            <Typography variant='h6'>(ii)	suspend you from using the Platform; and/or</Typography>
            <Typography variant='h6'>(iii)	take away certain functionalities</Typography>
          </p>
          <Typography variant='h6'>if it finds or suspects that you have breached or are in breach of this <Link onClick={() => handleScroll('communications')}>clause 3</Link>.</Typography>
        </Box>

      </Box>
    </Container>
  )
}

export default TermsAndConditions