import { Box } from '@mui/material';
import FarmCard from 'src/components/cards/FarmCard';
import PaginationSettings from '../../utils/pagination/PaginationFunction';
import SkeletonCard from 'src/components/skeletonCard/skeletonCard';

function FarmList(props: any) {
  const finalData = props.farmsListProps.result ? props.farmsListProps.result : [];
  if (props.isLoading) {
    return <SkeletonCard />;
  }
  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(3, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
        }}
      >
        {finalData.map((res: any) => (
          <FarmCard key={res.name} farms={res} />
        ))}
      </Box>

      <PaginationSettings data={props.farmsListProps} />
    </>
  );
}

export default FarmList;
