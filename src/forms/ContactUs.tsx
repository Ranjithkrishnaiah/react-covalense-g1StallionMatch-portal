import React from 'react'
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGetInterestsQuery } from 'src/redux/splitEndpoints/getInterests';
import '../pages/ContactUs.css';
import { ValidationConstants } from '../constants/ValidationConstants';
import { Box, Button, InputLabel, TextareaAutosize, TextField } from '@mui/material';
import { CustomButton } from 'src/components/CustomButton';
import { usePostRequestMutation } from 'src/redux/splitEndpoints/postInterest';
import { getQueryParameterByName } from 'src/utils/customFunctions';

type Interest = {
  id: number;
  name: string;
}
type ContactSchema = {
    contactName: string;
    contactEmail: string;
    contactDescription: string;

}
function ContactUs() {
  const interestedSelected  = getQueryParameterByName('type') || "";
  const [chosenInterests, setChosenInterests ] = React.useState<string[]>([]);
  const [submissionMessage, setSubmissionMessage ] = React.useState<string | null>(null);
  const { data: interests } = useGetInterestsQuery();
  const [ sendInformation, response] = usePostRequestMutation();
  
  // Validation for contact form
  const contactSchema = Yup.object().shape({
      contactName: Yup.string().required(ValidationConstants.name),
      contactEmail: Yup.string().email().required(ValidationConstants.emailValidation),
      contactDescription: Yup.string().required(ValidationConstants.contactDetailsRequired)
  })

  const methods = useForm<ContactSchema>({
    resolver: yupResolver(contactSchema),
    mode: "onTouched",
    criteriaMode: "all"  
  })

  React.useEffect(() => {
    if(interestedSelected === 'other') {
      setChosenInterests([...chosenInterests, 'Other'])
    }
  }, [interestedSelected])

  // Once interest option is choosen, assigned it to state variable
  const handleOptionClick = (e: any) => {
    if(chosenInterests.includes(e.target.value)){
      let newChosenInterests = chosenInterests.filter(interest => interest !== e.target.value)
      setChosenInterests(newChosenInterests)
    }else{
      setChosenInterests([...chosenInterests, e.target.value])
    }      
  }
  
  const {
      register,
      reset,
      handleSubmit,
      formState: { errors }
    } = methods;

    // Based on post contact api, render the message from response
    React.useEffect(() => {
      if(response.isSuccess){
        reset();
        setSubmissionMessage("Information has been submitted successfully")
      }
      else if(response.isError){
        setSubmissionMessage("Error occured")
      }
    },[response.isSuccess, response.isError])

  // Post api call  
  const sendRequest = (data: any) => {
    const countryName = window.localStorage.getItem("geoCountryName");
    let finalData = {...data, countryName: countryName ? countryName : "", interestedIn: chosenInterests };    
    sendInformation(finalData);
  }

  return (
    <Box>
      <Box className='intrested-button-group'>
      {interests?.map((interest: Interest) => (
        <Button variant="outlined" 
        value = { interest.name }
        // className={`outLineGold ${chosenInterests.includes(interest.name)?"contact-active":""}`}
        className={`outLineGold ${chosenInterests.includes(interest.name) ? "contact-active" : (interestedSelected === "other" && interest.name === "Other" ? "contact-active" : "")}`}
        key = {interest.id} 
        onClick={interest.name === "Other" && interestedSelected === "other" ? undefined : handleOptionClick}>
          {interest.name}
        </Button>
      ))}
      </Box>
      <form onSubmit={handleSubmit(sendRequest)} className='contact-form'>    
      <Box mb={2}>
        <InputLabel>Name</InputLabel>
        <TextField 
           error = {errors.contactName?.message? true: false}
            fullWidth
            type='text' 
            placeholder='Enter Name'
            {...register('contactName', { required:true })}
        />
        {errors?.contactName && <p className='error-text' style = { { color : '#C75227'} }> { errors.contactName.message }</p>}
        </Box>
        <Box mb={2}>
        <InputLabel>Email</InputLabel>
        <TextField 
            error = {errors.contactEmail?.message? true: false}
            fullWidth
            type='text' 
            placeholder='Enter Email Address'
            {...register("contactEmail", { required:true })}
        />
        {errors?.contactEmail && <p className='error-text' style = { { color : '#C75227'} }> { errors.contactEmail.message }</p>}
        </Box>
        <Box>
        <InputLabel>Details</InputLabel>
        <TextareaAutosize 
        minRows={6} 
        placeholder="Tell us a little more..." 
        className='con-form-control'
        {...register('contactDescription', { required:true })}
         />
         {errors?.contactDescription && <p className='error-text' style = { { color : '#C75227'} }> { errors.contactDescription.message }</p>}
         </Box>

        <CustomButton type="submit"  className="lr-btn">
          Submit
        </CustomButton>
        <p style = { { color : response.isSuccess ? '#2EFFB4' : '#C75227'} }>{submissionMessage}</p>      
    </form>
    </Box>
  )
}
export default ContactUs