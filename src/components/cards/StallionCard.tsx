import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Avatar, IconButton, StyledEngineProvider, Box, Stack } from '@mui/material';
import Imgix from 'react-imgix';
import { Images } from '../../assets/images';
import { CustomButton } from '../CustomButton';
import './card.css';
import { StallionList } from 'src/@types/stallionList';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import {
  useAddStallionShortlistMutation,
  useDeleteStallionShortlistMutation,
} from 'src/redux/splitEndpoints/stallionShortListSplit';
import { toPascalCase } from '../../utils/customFunctions';

type Props = {
  stallion: StallionList;
  shortlistedIds: any;
  stallionListProps?: any;
};

export default function MediaCard({ stallion, shortlistedIds, stallionListProps }: Props) {
  const {
    stallionId,
    isPromoted,
    horseName,
    yearToStud,
    farmName,
    currencyCode,
    currencySymbol,
    fee,
    feeYear,
    image,
    isPrivateFee,
    countryCode,
    yob,
    stateName,
    galleryImage,
    profilePic,
  } = stallion;
  const navigate = useNavigate();
  const sendToProfile = () => {
    window.localStorage.setItem('comeFromDirectory', 'true');
    navigate(`/stallions/${toPascalCase(horseName)}/${stallionId}/View`);
  };

  const { pathname } = useLocation();
  const isShortlist = pathname.match('shortlist');
  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = accessToken ? true : false;
  const [addShortlist] = useAddStallionShortlistMutation();
  const [deleteShortlist] = useDeleteStallionShortlistMutation();
  let bookmarkStallionIds = isLoggedIn
    ? shortlistedIds
    : window.sessionStorage.getItem('stallionIds')
    ? window.sessionStorage.getItem('stallionIds')?.split('|')
    : [];
  const isBookmarked = bookmarkStallionIds.includes(stallionId);
  let bookmark_visited = isBookmarked ? 'visited' : '';
  const [isShortlistClicked, setIsShortlistClicked] = useState(isBookmarked);
  //api call for shortlisting the stallion
  const createLoggedinShortlist = async (stallionId: any) => {
    await addShortlist({ stallionId: stallionId });
  };
  // api call for removing the shorlist stallion
  const deleteLoggedinShortlist = async (stallionId: any) => {
    await deleteShortlist(stallionId);
  };

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [anchorE2, setAnchorE2] = useState<HTMLButtonElement | null>(null);
  const [clickedBookmarkStallion, setClickedBookmarkStallion] = useState('');
  const [tobeDeletedBookmarkStallion, setTobeDeletedBookmarkStallion] = useState('');

  //removes the stallion from bookmark list
  const handleRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const stallionID = event.currentTarget.id;
    setAnchorE2(event.currentTarget);
    setTobeDeletedBookmarkStallion(stallionID);
  };
  useEffect(() => {
    setClickedBookmarkStallion('');
  }, [stallionId]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const stallionID = event.currentTarget.id;
    localStorage.setItem('isStallionShortListPage', 'active');
    if (isShortlist !== null) {
      setAnchorE2(event.currentTarget);
      setTobeDeletedBookmarkStallion(stallionID);
    } else {
      setAnchorEl(event.currentTarget);
      setClickedBookmarkStallion('visited');
      if (isLoggedIn) {
        if (!isBookmarked) {
          createLoggedinShortlist(stallionID);
        }
      } else {
        let savedShortlistIds: any = window.sessionStorage.getItem('stallionIds')
          ? window.sessionStorage.getItem('stallionIds')
          : '';
        let isIdExists = savedShortlistIds.includes(stallionID);
        if (isIdExists && isShortlist !== null) {
          setAnchorE2(event.currentTarget);
          handleClose();
        } else {
          setAnchorEl(event.currentTarget);
          setClickedBookmarkStallion('visited');
        }
        if (savedShortlistIds.length > 0) {
          if (isIdExists == false) {
            savedShortlistIds += '|' + stallionID;
          }
        } else {
          savedShortlistIds = stallionID;
        }
        window.sessionStorage.setItem('stallionIds', savedShortlistIds);
      }
    }
    setIsShortlistClicked(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDeleteBookmarkClose = () => {
    setAnchorE2(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const openDel = Boolean(anchorE2);
  const idDel = openDel ? 'simple-popover' : undefined;
  //navigate to shortlist page
  const handleShortlist = () => {
    navigate(`/my-shortlist`);
    stallionListProps.setPage(1);
  };
  //remove the stallion from shortList
  const removeShortlist = (event: React.MouseEvent<HTMLButtonElement>) => {
    const stallionID = stallionId;
    setClickedBookmarkStallion('');
    if (isLoggedIn) {
      deleteLoggedinShortlist(stallionID);
    } else {
      let savedShortlistIds: any = window.sessionStorage.getItem('stallionIds');
      let savedShortlistIdsArr = savedShortlistIds.split('|');
      let afterDeleteShortlistIdsArr = removeItemOnce(savedShortlistIdsArr, stallionID);
      if (afterDeleteShortlistIdsArr.length > 1) {
        savedShortlistIds = afterDeleteShortlistIdsArr.join('|');
      } else {
        savedShortlistIds = afterDeleteShortlistIdsArr[0];
      }
      window.localStorage.removeItem('stallionIds');
      window.sessionStorage.setItem('stallionIds', savedShortlistIds);
      if (!savedShortlistIds) {
        window.sessionStorage.removeItem('stallionIds');
      }
    }
    setAnchorE2(null);
    setIsShortlistClicked(false);
    if (!isLoggedIn && isShortlist) {
      navigate(`/my-shortlist`);
    }
  };

  function removeItemOnce(arr: any, value: string) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  const keepShortlist = (type: string) => {
    if (type === 'keep-type') {
      setAnchorE2(null);
    } else {
      setAnchorEl(null);
    }
  };

  return (
    <StyledEngineProvider injectFirst>
      <Card className="SDcard">
        <Stack className="SDcardMedia">
          <div>
            {(galleryImage && isPromoted) || profilePic ? (
              <>
                {galleryImage ? (
                  <Stack className="SDcardMediaImg">
                    <Imgix
                      src={galleryImage || Images.HorseProfile}
                      imgixParams={{ w: 270, h: 180, ar: '3:2', fit: 'crop' }}
                      disableQualityByDPR
                      htmlAttributes={{ alt: `${toPascalCase(horseName)} Stallion` }}
                    />
                  </Stack>
                ) : (
                  <Avatar
                    alt={horseName + ' Stallion'}
                    src={
                      profilePic
                        ? profilePic + '?h=40&w=40&ar=1:1&fit=crop&mask=ellipse&nr=-100&nrs=100'
                        : Images.HorseProfile
                    }
                    className="SDavatar"
                  />
                )}
              </>
            ) : (
              <Avatar
                alt={horseName + ' Stallion'}
                src={
                  profilePic
                    ? profilePic + '?h=40&w=40&ar=1:1&fit=crop&mask=ellipse&nr=-100&nrs=100'
                    : Images.HorseProfile
                }
                className="SDavatar"
              />
            )}
          </div>
        </Stack>
        <CardContent sx={{ flexGrow: '1' }} className="SDcardBody">
          <Typography gutterBottom variant="h4" component="div" className="SDcardTitle">
            {toPascalCase(horseName)} {countryCode && `(${countryCode})`}
          </Typography>
          <Typography component="span" className="year">
            {yob}
          </Typography>
          <Typography variant="body2" mt={2} className="breed">
            {toPascalCase(farmName)} {stateName}
          </Typography>
          {isPrivateFee ? (
            <Typography variant="body2" className="year">
              Private Fee {feeYear && `(${feeYear})`}
            </Typography>
          ) : (
            <Box pb={1}>
              <Typography variant="body2" className="year">
                {currencyCode?.substring(0, 2)} {currencySymbol}
                {fee?.toLocaleString()} {feeYear && `(${feeYear})`}
              </Typography>
            </Box>
          )}
        </CardContent>
        <CardActions className="SDcardBottom" sx={{ display: 'flex', marginTop: 'auto' }}>
          <Box flexGrow={1}>
            <CustomButton className="viewButton" onClick={sendToProfile} disabled={!isPromoted}>
              View Profile <i className="icon-Arrow-right" />
            </CustomButton>
          </Box>
          <Box>
            <IconButton className="bookmark">
              <i
                className={`icon-Bookmark ${bookmark_visited} ${clickedBookmarkStallion}`}
                aria-describedby={stallionId}
                id={stallionId}
                onClick={
                  !isBookmarked && !isShortlistClicked
                    ? handleClick
                    : isBookmarked === false
                    ? handleClick
                    : handleRemove
                }
              />
            </IconButton>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              className="view-shortlist"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Box>
                <i className="icon-Cross" onClick={handleClose} />
                <Box className="shortlistBox">
                  <Typography variant="h6" mb={3}>
                    We've added this stallion to your shortlist.
                  </Typography>
                  <Button
                    className="viewButton remove-shortlist continue-btn"
                    onClick={() => keepShortlist('add-type')}
                  >
                    Continue
                  </Button>
                  <Button className="viewButton" onClick={handleShortlist}>
                    View Shortlist
                  </Button>
                </Box>
              </Box>
            </Popover>
            <Popover
              id={idDel}
              open={openDel}
              anchorEl={anchorE2}
              className="view-shortlist"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Box>
                <i className="icon-Cross" onClick={handleDeleteBookmarkClose} />
                <Box className="shortlistBox removesShortlistBox">
                  <Typography variant="h6" mb={3}>
                    Are you sure you want to remove this stallion from your shortlist?
                  </Typography>
                  <Button className="viewButton remove-shortlist" onClick={removeShortlist}>
                    Remove Stallion
                  </Button>
                  <Button className="viewButton" onClick={() => keepShortlist('keep-type')}>
                    Keep Stallion
                  </Button>
                </Box>
              </Box>
            </Popover>
          </Box>
        </CardActions>
      </Card>
    </StyledEngineProvider>
  );
}
