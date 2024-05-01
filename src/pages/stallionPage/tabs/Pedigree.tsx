import { Container, StyledEngineProvider, Typography } from '@mui/material';
import HypoMatingStallionPagePedigree from 'src/components/HypomatingStallionPagePedigree';
import { useParams } from 'react-router-dom';
import { useGetFarmByIdQuery } from 'src/redux/splitEndpoints/getFarmsByIdSplit';

type PedigreeProps = {
   id: string;
   name: string;
   farmId: string;
   colorCode?: string;
   tag?: string;
}

function Pedigree({ id, name, farmId }: PedigreeProps) {     
   const paramData  = useParams();
   const stallionId:any = (paramData.id != '') ? paramData.id : '';   
   const { data: farmDetailsById, isSuccess, isLoading } = useGetFarmByIdQuery(farmId);
    return (
        <>
    <StyledEngineProvider injectFirst>
    <Container>
        <Typography pb={3} variant='h3' sx={ { color: '#1D472E' } }>Pedigree</Typography>
        <HypoMatingStallionPagePedigree stallionId={stallionId} isStallionParam={true} 
        mareId={''} isMareParam={false} farmImg = { farmDetailsById?.image } horseNameProp={name}/>
      </Container>
    </StyledEngineProvider>  
      </>
    );
}

export default Pedigree;