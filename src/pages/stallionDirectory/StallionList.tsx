import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomStallionCard from 'src/components/cards/StallionCard';
import { setGuestBookMarkedStallion } from 'src/redux/actionReducers/reportSlice';
import PaginationSettings from '../../utils/pagination/PaginationFunction';



function StallionList({ stallionListProps }: any) {
  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = accessToken ? true : false;
  const dispatch = useDispatch()
  const guestStallionList: any = useSelector((state: any) => state.reportSlices.guestBookMarkedStallion);

  useEffect(() => {
      const stallionGuest :any = localStorage.getItem('guestStallionShortList');
      const guestlist:any = stallionGuest && JSON.parse(stallionGuest);
      dispatch(setGuestBookMarkedStallion(guestlist))
  }, [])
  
  
  const guestBookMarklist:any = guestStallionList?.length ? guestStallionList?.map((item:any) => item?.stallionId) : [];
  return (
    <>
       
      <Box
        sx={ {
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(3, 1fr)',
          },
        } }
      >
        {stallionListProps.result.map((res: any) => (
          <CustomStallionCard key={res.name} stallion={res} stallionListProps={stallionListProps} shortlistedIds={isLoggedIn  ? stallionListProps.selectedBookmarks : guestBookMarklist} />
        ))}
      </Box>
      <PaginationSettings data={stallionListProps} />
    </>
  );
}

export default StallionList;
