import React from 'react';
import {
  Button,
  StyledEngineProvider,
  ClickAwayListener,
} from '@mui/material';
import { Popper, Fade, Box } from '@mui/material';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  EmailIcon,
} from 'react-share';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useFarmPageShareAuthMutation } from 'src/redux/splitEndpoints/farmsSplit';
import { useStallionPageShareAuthMutation } from 'src/redux/splitEndpoints/stallionSplit';
import { useAuthMeQuery } from 'src/redux/splitEndpoints/getAuthMeSplit';
import { toPascalCase } from 'src/utils/customFunctions';
import useAuth from 'src/hooks/useAuth';
import { ShareMailWrapperDialog } from './ShareMailWrapper';

type Props = {
  shareUrl: string;
  title: string;
  mediaUrl?: string;
  pageId?: any;
  pageType?: any;
  sectionDisabled?:any
};

interface EmailButtonProps {
  subject: string;
  body: string;
}

export default function SocialShare({ shareUrl, title, mediaUrl, pageId, pageType, sectionDisabled }: Props) {
  const { authentication, setLogout } = useAuth();  
  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = accessToken ? true : false;
  const [userName, setUserName] = React.useState<string | undefined>('');
  const [shareMailOpen, setShareMailOpen] = React.useState(false);

  // close shareEmail wrapper handler
  const handleCloseShareMailWrapper = () => {
    setShareMailOpen(false);
  };

  // Get auth user list api call  
  const { data: MyDetails, isSuccess: isMyDetailsSuccess,isFetching:MyDetailsFetching } = useAuthMeQuery(null, {
    skip: !authentication, refetchOnMountOrArgChange: true
  });  

  let emailUserName = ''; 
  // Once auth user data is fetched, set the full name in state variable 
  React.useEffect(() => {
    if (isMyDetailsSuccess) {
      setUserName(MyDetails?.fullName);
      emailUserName = `Hi ${MyDetails?.fullName},`;
    } else {
      emailUserName = 'Hi,';
    }
  }, [isMyDetailsSuccess,MyDetailsFetching]);

  // include HTML content in the body of the email  
  const [emailSubject, setEmailSubject] = React.useState('');
  const [emailBody, setEmailBody] = React.useState('');  

  React.useEffect(() => { 
    // if(title !== 'undefined') { 
      switch(pageType) {
        case 'stallionReport':
          setEmailBody(`Hi ${userName},\n\nPlease find the Stallion Report for ${title +':'}\n\n${shareUrl}\n\nKind Regards\nSM Support`);
          setEmailSubject(`${title} Report`);
          break;
        case 'breederReport':
          setEmailBody(`Hi ${userName},\n\nPlease find the Breeder Report for ${title +':' }\n\n${shareUrl}\n\nKind Regards\nSM Support`);
          setEmailSubject(`${title} Report`);
          break;  
        case 'stallions':
          setEmailBody(`Hi ${userName},\n\nPlease find the Stallion Details for ${title +':'} \n\n${shareUrl}\n\nKind Regards\nSM Support`);
          setEmailSubject(`${title} Details`);
          break;
        case 'farms':
          setEmailBody(`Hi ${userName},\n\nPlease find the Farm Details for ${title +':'}\n\n${shareUrl}\n\nKind Regards\nSM Support`);
          setEmailSubject(`${title} Details`);
          break;
        // case 'search':
        //   setEmailBody(`Hi ${userName},\n\nPlease find the Search Report for ${title +':'}\n\n${shareUrl}\n\nKind Regards\nSM Support`);
        //   setEmailSubject(`${title} Details`);
        //   break;  
      }   
    // }
  }, [pageType, title]);    

  const [openPopper, setOpenPopper] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isFarmShare, setIsFarmShare] = React.useState(false);
  const [isStallionShare, setIsStallionShare] = React.useState(false);
  const [SharePayload, setSharePayload] =  React.useState<any>({});
  const [addFarmMemberToShare] = useFarmPageShareAuthMutation();
  const [addStallionMemberToShare] = useStallionPageShareAuthMutation();
  const handleSocialShareActivity = async(type: string) => {
    
    if(pageType === 'farms') {
      setIsFarmShare(true);
      setSharePayload(
        {farmId: pageId, referrer: type}
      )
      let res: any = await addFarmMemberToShare({farmId: pageId, referrer: type});
    } else if(pageType === 'stallions') {
      setIsStallionShare(true);
      setSharePayload(
        {stallionId: pageId, referrer: type}
      )
      let res: any = await addStallionMemberToShare({stallionId: pageId, referrer: type});
    }     
  }

  //opens popper
  const handleShare = (event: any) => {
    setAnchorEl(event.currentTarget);
    setOpenPopper(true);
  };
  //closes the popper
  const handleShareClose = (event: any) => {
    setAnchorEl(null);
    setOpenPopper(false);
  };

  const handleClickAway = () => {
    setAnchorEl(null);
    setOpenPopper((previousOpen) => !previousOpen);
  };

  const canBeOpen = openPopper && Boolean(anchorEl);
  const id = canBeOpen ? 'transition-popper' : undefined;

  const [copied, setCopied] = React.useState(false);
  let pageUrl: string = window.location.href;
  const onSuccessfulCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const CustomEmailShareButton : React.FC<EmailButtonProps> = ({ subject, body }) => {
    const handleClick = () => {
      const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;
    };
    return (
      <button onClick={handleClick}>
        <EmailIcon size={32} round />Email
      </button>
    );
  };  

  return (
    <StyledEngineProvider injectFirst>
      <Button onMouseLeave={handleShareClose} className='stallionsearchButtonOuter' disableRipple>
        <Button
          className="stallionsearchButton"
          disableRipple
          variant="text"
          onMouseOver={handleShare}
          disabled={sectionDisabled !== undefined ? !sectionDisabled : false}
        >
          <i className="icon-Share" /> <span>Share</span>
        </Button>
        <ClickAwayListener onClickAway={handleClickAway}>
          <Popper
            className="tooltipPopover shareBoxwrapper"
            placement="bottom-start"
            id={id}
            open={openPopper}
            anchorEl={anchorEl}
            transition
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={200}>
                <Box className="tooltipPopoverBody">
                  <Box className="Demo__container">
                    <Box className="Demo__some-network">
                      <CopyToClipboard text={pageUrl} onCopy={onSuccessfulCopy}>
                        <Box sx={{ paddingX: 0.7 }} className={'pointerOnHover'}>
                          <i className="icon-Link" /> {!copied ? 'Copy Link' : 'Copied!'}
                        </Box>
                      </CopyToClipboard>
                    </Box>
                    <Box className="Demo__some-network" onClick={() => handleSocialShareActivity('Facebook')}>
                      <FacebookShareButton
                        url={shareUrl}
                        quote={title}
                        className="Demo__some-network__share-button"
                      >
                        <FacebookIcon size={32} round /> Facebook
                      </FacebookShareButton>
                    </Box>
                    <Box className="Demo__some-network" onClick={() => handleSocialShareActivity('Twitter')}>
                      <TwitterShareButton
                        url={shareUrl}
                        title={title}
                        className="Demo__some-network__share-button"
                      >
                        <TwitterIcon size={32} round />
                        Twitter
                      </TwitterShareButton>
                    </Box>
                    <Box className="Demo__some-network" onClick={() => handleSocialShareActivity('LinkedIn')}>
                      <LinkedinShareButton
                        url={shareUrl}
                        className="Demo__some-network__share-button"
                      >
                        <LinkedinIcon size={32} round />
                        Linkedin
                      </LinkedinShareButton>
                    </Box>
                    {isMyDetailsSuccess && pageType !== 'search' && <Box className="Demo__some-network" onClick={() => handleSocialShareActivity('Email')}>
                      <CustomEmailShareButton subject={emailSubject} body={emailBody} />
                    </Box>}
                    {pageType === 'search' && <Box className="Demo__some-network">
                      <button onClick={(event: any) => {setShareMailOpen(true); handleClickAway()}}>
                        <EmailIcon size={32} round />Email
                      </button>
                    </Box>}
                  </Box>
                </Box>
              </Fade>
            )}
          </Popper>
        </ClickAwayListener>
      </Button>
      {/* share email Wrapper Dialog */}
      <ShareMailWrapperDialog
        title="Share Email"
        open={shareMailOpen}        
        searchUrl={shareUrl}
        close={handleCloseShareMailWrapper}
      />
    </StyledEngineProvider>
  );
}
