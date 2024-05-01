import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Typography, Avatar } from '@mui/material';
import { Images } from 'src/assets/images';
import { FavoriteStallion } from 'src/@types/FavoriteStallion';
import { toPascalCase } from 'src/utils/customFunctions';

type Props = {
    key: number;
    data: FavoriteStallion;
    meta: FavoriteStallion;
    horseType: string;
    handleSetId: any;
    isDisable: boolean;
    setIsDisable: React.Dispatch<React.SetStateAction<any>>;
  };
  
function FavouriteStallionList({
    key,
    data,
    meta,
    horseType,
    handleSetId,isDisable,setIsDisable
  }: Props) { 
    // If user clicks on either Stallion or Mare, set the corresponding Id
    const handleFavStallionOrMare = () => {
    handleSetId((horseType == 'Mare') ? data.horseId: data.stallionId);
    setIsDisable(false);
    }
    return (
    // Render the favourite Stallion or Mare list    
    <ListItemButton onClick={handleFavStallionOrMare}>
        <ListItemIcon>
            <Avatar className='fav-stallion-img' alt={data.horseName} src={data.image ?  `${data.image}?h=48&w=48&fit=crop&ar=1:1&mask=ellipse&nr=-100&nrs=100`: Images.HorseProfile} style={ { marginRight: '12px' } }/>
        </ListItemIcon>
            <ListItemText primary={`${toPascalCase(data.horseName)} (${data.yob}, ${data.countryCode})`}
            secondary={
            <React.Fragment>
            <Typography
                sx={ { display: 'inline' } }
                component="span"
                variant="body2"
                color="#007142;"
            >
                X 
            </Typography>
            {`  ${toPascalCase(data.sireName)} (${data.sireYob}, ${data.sireCountryCode})`}, {`${toPascalCase(data.damName)} (${data.damYob}, ${data.damCountryCode})`}
            </React.Fragment>
        }
            />                     
    </ListItemButton>
    );
}
export default FavouriteStallionList
