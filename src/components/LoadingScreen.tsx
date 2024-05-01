import { Container } from '@mui/material';
import SkeletonPreLoading from './skeletonPreLoading/skeletonPreLoading';

function LoadingScreen() {
  const url = window.location.pathname;
  const location = url.replace('/', '')
  return (
    <Container>   
    {location === "stallion-directory" || location === 'farm-directory' ? ''
    : <SkeletonPreLoading/> }</Container>
  )
}

export default LoadingScreen