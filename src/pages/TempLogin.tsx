import { Box, Button, Typography } from '@mui/material'
import React,{ useEffect } from 'react'
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Images } from 'src/assets/images';
import './PageNotFound.css'
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { api } from 'src/api/apiPaths';

function TempLogin() {
   
    const [ enteredKey, setEnteredKey ] = React.useState("");
    const [ error, setError ] = React.useState("");
    const { setGuestAuth } = useAuth();
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['secret-key']);

    useEffect(() => {
        if (cookies.hasOwnProperty("secret-key")) {
            setGuestAuth(true);
        }
      }, []);
    
    const handleSubmit = () => {
        setError("");

        async function getLoginStatus() {
            const url = `${api.baseUrl}/auth/basic`;
      
            axios
              .post(url, { secret: enteredKey })
              .then((res) => {
                setGuestAuth(true);                
                let r = (Math.random() + 1).toString(36);
                setCookie("secret-key", r, { path: '/', sameSite: 'none', secure: true });
                navigate('/');
              })
              .catch((err) => {
                if (JSON.stringify(err).match("401")) setError("Unauthorized");
                if (JSON.stringify(err).match("500"))
                  setError("Unauthorized");
              });
          }
          getLoginStatus();
        // if(enteredKey === secretKey){
        //     setGuestAuth(true);
        //     navigate('/')
        // }else{
        //     setError("Sorry, The entered key is incorrect")
        // }
    }
  return (
   <Box className="secretkey">
    <Box className="SK-box" >
    <Box><img src={Images.logo} alt="Stallion Logo"/></Box>
    <Box my={3}>
            <input placeholder='Enter Secret Key' className="SK-field"   value = { enteredKey } onChange = {(e: any) => setEnteredKey(e.target.value)}/>
    </Box>
            <Button className="SK-btn" onClick = {handleSubmit}>Submit</Button>
            <Typography variant='h6'>{error}</Typography>
        </Box>
    </Box>
  )
}

export default TempLogin