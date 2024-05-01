import { useState, useEffect, useRef, forwardRef, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { Images } from 'src/assets/images';
import { Box, IconButton } from '@mui/material';
import useAuth from 'src/hooks/useAuth';
import { useGetProfileImageQuery, usePostUserProfileImageUploadMutation
   } from 'src/redux/splitEndpoints/addUserProfileImage';
import CropImageDialog from './CropImageDialog';

type UploadImageProps = {
  picture: any;
  setPicture: React.Dispatch<React.SetStateAction<any>>;
}
export default function ProfileAvatar(props:any) {
  const { authentication } = useAuth();

  const { data : userProfileData, isSuccess: getProfileSuccess } = useGetProfileImageQuery(null,{skip: !authentication,refetchOnMountOrArgChange: true});
  const avatarRef = useRef<HTMLInputElement | null>(null);
  const [picture, setPicture ] = useState<any>();
  const changeImage = () => avatarRef?.current?.click();
  useEffect(() => {
    if(getProfileSuccess){
      setPicture(userProfileData.memberprofileimages)
    }
  },[userProfileData])

  const onLoad = useCallback(img => {
    avatarRef.current = img;
  }, []);
  return (
    <Stack direction="row" spacing={2}>
      <UploadImage ref = {avatarRef} picture setPicture={ setPicture }/>
      <Badge
        overlap="circular"
        anchorOrigin={ { vertical: 'bottom', horizontal: 'right' } }
        badgeContent={
          <IconButton>
            <Avatar alt="Edit" src={Images.Edit} style={ { width: '30px', height: '30px' } }
            onClick = { changeImage }/>
          </IconButton>
        }
      >
        {!picture && <Avatar alt={props?.user?.fullName} style={ { width: '144px', height: '144px' } } /> }
        { picture && <img src = { picture } alt={props?.user?.fullName}
        style={ { width: '144px', height: '144px', borderRadius: '50%' } }/>}        
      </Badge>
    </Stack>
  );
}

const UploadImage = forwardRef<HTMLInputElement | null, UploadImageProps>(({picture, setPicture}, ref) => {
  const [ updateProfilePicture, postRequestResponse ] = usePostUserProfileImageUploadMutation();
  const [ imageFile, setImageFile ] = useState<File>();
  const [ awsUrl, setAWSUrl ] = useState<any>();
  const [ uniqueUuid, setUuid ] = useState<any>("");
  const [ cropPrevImg, setCropPrevImg ] = useState<any>();
  const [ openEditImageDialog, setOpenEditImageDialog ] = useState(imageFile != undefined);
  let details = { fileName: "", fileuuid: "", fileSize: 0 }

  useEffect(() => {
    if(postRequestResponse.isSuccess){
      setAWSUrl(postRequestResponse.data.url);
    }
    else if(postRequestResponse.isError){
      console.log("IMAGE UPLOAD ERROR: ", postRequestResponse.error)
    }
  },[postRequestResponse])

  const handleImageChange = async (e:any) => {
    e.stopPropagation();
    e.preventDefault();
    let localUuid = uuid();
    setUuid(localUuid);
    var file = e.target.files[0];
    setImageFile(file);
    let obj = { fileuuid :localUuid, fileName: file.name, fileSize : file.size}
    updateProfilePicture(obj)
  }
  useEffect(() => {
    if(imageFile != undefined) {
      setOpenEditImageDialog(true)
    };
  },[imageFile])
  return (
    <Box>
      <input 
      type = 'file' 
      className='hide' 
      ref = { ref }  
      onChange = { handleImageChange }
      onClick={(event: any) => {
        event.target.value = null
      }}
      accept = "image/*"
      />
      <CropImageDialog
       open = {openEditImageDialog}
       title = {"Profile Image"}
       onClose = {() => setOpenEditImageDialog(false)}
       imgSrc = {imageFile? URL.createObjectURL(imageFile): ""}
       imgName = { imageFile?.name || "" }
       imgFile = { imageFile }
       awsUrl = {awsUrl}
      //  setCropPrevImg = {setCropPrevImg}
       uniqueUuid = {uniqueUuid}
    />
    </Box>
  )
})
