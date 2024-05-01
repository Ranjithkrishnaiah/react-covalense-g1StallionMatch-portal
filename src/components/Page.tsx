import { Helmet } from 'react-helmet-async';
import { forwardRef, ReactNode } from 'react';
// @mui
import { Box, BoxProps } from '@mui/material';
// ----------------------------------------------------------------------
interface Props extends BoxProps {
  children: ReactNode;
  meta?: ReactNode;
  title: string;
  customTitle?: string;
  urlpath?:string;
  gallaryImage?:string;
}
const Page = forwardRef<HTMLDivElement, Props>(({ children, title = '', customTitle = '' ,urlpath,gallaryImage, meta, ...other }, ref) => (  
  <>  
    <Helmet>
      <title>{`${title} | Stallion Match`}</title>
      <meta name="description" content={customTitle} />
      <meta property="twitter:site" content="Stallion Match Portal" />
      <meta property="twitter:site:id" content="43550536" />
      <meta property="twitter:creator" content="Stallion Match Portal" />
      <meta property="twitter:creator:id" content="43550536" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={`${title} | Stallion Match`} />
      <meta property="twitter:description" content={`${title} | Stallion Match`} />
      <meta property="twitter:image" content={gallaryImage} />
      <meta property="twitter:image:width" content="1200" />
      <meta property="twitter:image:height" content="1200" />      
      <meta property="og:title" content={`${title} | Stallion Match Portal`}/>
      <meta property="og:url" content={`https://dev.stallionmatch.com${urlpath ?urlpath : ''}`}/>
      <meta property="og:image" content={gallaryImage}/>
      <meta property="og:description" content={`${title} | Stallion Match`}/>      
    </Helmet>
    <Box ref={ref} {...other}>
      {children}
    </Box>
  </>
));

export default Page;