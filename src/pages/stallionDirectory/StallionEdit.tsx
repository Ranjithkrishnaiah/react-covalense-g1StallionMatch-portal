import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
    Avatar,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Radio,
    TextareaAutosize,
    TextField,
    Stack,
    Select,
    Container,
    StyledEngineProvider
} from '@mui/material';
import { CustomButton } from 'src/components/CustomButton';
import { Images } from 'src/assets/images';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import CustomDropzone from 'src/components/CustomDropzone';
import { styled } from '@mui/material/styles';
import '../../components/WrappedDialog/dialogPopup.css'
import '../../forms/LRpopup.css'
const steps = ['Profile', 'Hero Image Gallery', 'Testimonials'];

function StallionEdit() {

    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set<number>());

    const isStepOptional = (step: number) => {
        return step !=2;
    };

    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const [count, setCount] = React.useState(0);

    const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={ { popper: className } } />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#f5f5f9',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: 220,
            fontSize: theme.typography.pxToRem(12),
            border: '1px solid #dadde9',
        },
    }))

    return (
        <StyledEngineProvider injectFirst>
            <Container>
                <Box my={5}>
                    <Typography variant='h2' className="SDTitle">
                        Edit Stallion Profile
                    </Typography>
                </Box>
                <Box>
                    <Box sx={ { position: 'sticky', top: '92px', height: '100px', display: 'grid', alignItems: 'center', background: '#ffffff', zIndex: '1' } }>
                        <Stepper activeStep={activeStep}>
                            {steps.map((label, index) => {
                                const stepProps: { completed?: boolean } = {};
                                const labelProps: {
                                    optional?: React.ReactNode;
                                } = {};
                                if (isStepOptional(index)) {
                                    labelProps.optional = (
                                        <Typography variant="caption"></Typography>
                                    );
                                }
                                if (isStepSkipped(index)) {
                                    stepProps.completed = false;
                                }
                                return (
                                    <Step key={label} {...stepProps}>
                                        <StepLabel {...labelProps}>{label}</StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>
                    </Box>
                    {activeStep === steps.length ? (
                        <React.Fragment>
                            <Typography variant='h4' sx={ { mt: 2, mb: 1 } }>
                                Successfully saved
                            </Typography>
                            <Box mb={9} sx={ { display: 'flex', flexDirection: 'row', pt: 2 } }>
                                <Box sx={ { flex: '1 1 auto' } } />
                            </Box>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Typography sx={ { mt: 2, mb: 1 } }>
                                {(activeStep == 0) ? (
                                    <Grid container sx={ { justifyContent: 'center' } } className='dialogPopup'>
                                        <Grid item lg={10} xs={12}>
                                        <Box mt={4} className="edit-stallion-profile-modal">
                                            <Grid item lg={12} xs={12} className="profile-picture-wrapper">
                                                <Stack className="profile-picture">
                                                    <InputLabel>Stallion Profile</InputLabel>
                                                    <Avatar
                                                        src={Images.Mediapic}
                                                        alt="profile"
                                                        sx={ { width: '96px', height: '96px',  } }
                                                    />
                                                    <Box mt={1}>
                                                        <Button type="button" className="EditBtn">
                                                            Edit
                                                        </Button>
                                                    </Box>
                                                </Stack>
                                            </Grid>
                                            <Box className="edit-stallion-profile-form" mt={5}>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} sm={6} lg={6} className="edit-st-form-bx">
                                                        <Box>
                                                            <InputLabel>Stallion Name</InputLabel>
                                                            <TextField
                                                                fullWidth
                                                                type="text"
                                                                autoComplete="new-password"
                                                                placeholder="Stallion Name"
                                                            />
                                                        </Box>
                                                    </Grid>

                                                    <Grid item xs={12} sm={6} lg={6} className="edit-st-form-bx">
                                                        <Grid container spacing={3} className="stallion-profile-col-arr">
                                                            <Grid item xs={12} sm={4} lg={3}>
                                                                <InputLabel>Fee Year</InputLabel>
                                                                <Select
                                                                    fullWidth
                                                                    IconComponent={KeyboardArrowDownIcon}
                                                                    sx={ { height: '54px' } }
                                                                >
                                                                    <MenuItem value="none">Select Fee Year</MenuItem>
                                                                </Select>
                                                            </Grid>
                                                            <Grid item xs={12} sm={4} lg={3}>
                                                                <InputLabel>Currency</InputLabel>
                                                                <Select
                                                                    fullWidth
                                                                    IconComponent={KeyboardArrowDownIcon}
                                                                    sx={ { height: '54px' } }
                                                                >
                                                                    <MenuItem value="none" disabled>
                                                                        Select Currency
                                                                    </MenuItem>
                                                                </Select>
                                                            </Grid>

                                                            <Grid item xs={12} sm={4} lg={6}>
                                                                <InputLabel>Stud Fee</InputLabel>
                                                                <TextField
                                                                    fullWidth
                                                                    type="text"
                                                                    autoComplete="new-password"
                                                                    placeholder="Stud Fee"

                                                                />

                                                            </Grid>

                                                            <Grid item xs={12} className="MakeStudFeeLines studfee-stallion-pr">
                                                                <FormControl>
                                                                    <FormControlLabel
                                                                        value={'Make Stud Fee Private'}
                                                                        control={<Radio />}
                                                                        label={'Make Stud Fee Private'}
                                                                        key={'Make Stud Fee Private'}
                                                                    />
                                                                </FormControl>
                                                                <HtmlTooltip
                                                                     enterTouchDelay={0}
                                                                     leaveTouchDelay={6000}
                                                                    className="CommonTooltip studfee-tooltip" 
                                                                    placement="right-start"
                                                                    title={
                                                                        <React.Fragment>
                                                                            {/* <Typography color="inherit">Tooltip with HTML</Typography> */}
                                                                            {'Stud fee is essential within Stallion Match'}{' '}
                                                                            {' If you make your service fee private, then his '}{' '}
                                                                            {
                                                                                'fee will remain confidential within our platform it’s users and will only be used internally for reporting'
                                                                            }
                                                                            .{' '}
                                                                        </React.Fragment>
                                                                    }
                                                                >
                                                                    <i className="icon-Info-circle" />
                                                                </HtmlTooltip>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid item xs={12} sm={6} lg={6} className="edit-st-form-bx">
                                                        <Box>
                                                            <InputLabel>Farm</InputLabel>
                                                            <Select
                                                                fullWidth
                                                                IconComponent={KeyboardArrowDownIcon}
                                                                sx={ { height: '54px' } }

                                                            >
                                                                <MenuItem value="none" disabled>
                                                                    Select Farm
                                                                </MenuItem>

                                                            </Select>

                                                        </Box>
                                                    </Grid>

                                                    <Grid item xs={12} sm={6} lg={6} className="edit-st-form-bx" />

                                                    <Grid item xs={12} sm={6} lg={6} className="edit-st-form-bx">
                                                        <Box>
                                                            <InputLabel>Year of Birth</InputLabel>
                                                            <TextField
                                                                fullWidth
                                                                type="text"
                                                                autoComplete="new-password"
                                                                placeholder="0000"
                                                                disabled

                                                            />
                                                        </Box>

                                                    </Grid>

                                                    <Grid item xs={12} sm={6} lg={6} className="edit-st-form-bx">
                                                        <Box>
                                                            <InputLabel>Height (Hands)</InputLabel>
                                                            <TextField
                                                                fullWidth
                                                                type="text"
                                                                autoComplete="new-password"
                                                                placeholder="Height"

                                                            />
                                                        </Box>

                                                    </Grid>

                                                    <Grid item xs={12} sm={6} lg={6} className="edit-st-form-bx">
                                                        <Box>
                                                            <InputLabel>Colour</InputLabel>
                                                            <Select
                                                                fullWidth
                                                                IconComponent={KeyboardArrowDownIcon}
                                                                sx={ { height: '54px', mb: '1rem' } }

                                                            >
                                                                <MenuItem value="none" disabled>
                                                                    Select Colour
                                                                </MenuItem>

                                                            </Select>

                                                        </Box>
                                                    </Grid>

                                                    <Grid item xs={12} sm={6} lg={6} className="edit-st-form-bx">
                                                        <Box>
                                                            <InputLabel>Year to Stud</InputLabel>
                                                            <TextField
                                                                fullWidth
                                                                type="text"
                                                                autoComplete="new-password"
                                                                placeholder="YYYY"

                                                            />
                                                        </Box>

                                                    </Grid>
                                                </Grid>

                                                <Grid container spacing={3} mt={0}>
                                                    <Grid item xs={12} className="edit-st-form-bx">
                                                        <Box className="wins-textarea">
                                                            <InputLabel>Wins</InputLabel>
                                                            <TextareaAutosize minRows={2} placeholder="Minimum 3 rows" />
                                                        </Box>
                                                    </Grid>

                                                    <Grid item xs={12} className="edit-st-form-bx" mt={2}>
                                                        <Box className="overview-textarea">
                                                            <InputLabel>Overview</InputLabel>
                                                            <TextareaAutosize
                                                                minRows={7}
                                                                placeholder="Minimum 3 rows"
                                                            />
                                                            <p>{count}</p>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Box>
                                        </Grid>
                                    </Grid>
                                ) : ("")}
                                {(activeStep == 1) ? (
                                    <Grid container sx={ { justifyContent: 'center' } } className='dialogPopup'>
                                        <Grid item lg={10} xs={12}>
                                        <Box mt={12} className="edit-stallion-profile-modal">
                                            <Grid item xs={12}>
                                                <Box className="here-image-gallery-box">
                                                    <InputLabel className="hero-img-gallery-text">
                                                        Hero Image Gallery
                                                        <HtmlTooltip
                                                             enterTouchDelay={0}
                                                             leaveTouchDelay={6000}
                                                            className="CommonTooltip studfee-tooltip" 
                                                            placement="right-start"
                                                            title={
                                                                <React.Fragment>

                                                                    {'Stud fee is essential within Stallion Match'}{' '}
                                                                    {' If you make your service fee private, then his '}{' '}
                                                                    {
                                                                        'fee will remain confidential within our platform it’s users and will only be used internally for reporting'
                                                                    }
                                                                    .{' '}
                                                                </React.Fragment>
                                                            }
                                                        >
                                                            <i className="icon-Info-circle" />
                                                        </HtmlTooltip>
                                                    </InputLabel>
                                                    <Grid container spacing={3} mt={1} className="hero-image-box-wrapper">
                                                        <Grid item lg={3} sm={3} xs={6} mt={3} className="hero-image-box">
                                                            <CustomDropzone />
                                                        </Grid>
                                                        <Grid item lg={3} sm={3} xs={6} mt={3} className="hero-image-box">
                                                            <CustomDropzone />
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Grid>
                                        </Box>
                                        </Grid>
                                    </Grid>
                                ) : ("")}
                                {(activeStep == 2) ? (
                                    <Grid container sx={ { justifyContent: 'center' } } className='dialogPopup'>
                                    <Grid item lg={10} xs={12}>
                                    <Box className="testtimonial-forms-box" mt={4}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6} lg={6}>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} sm={12} lg={12}>
                                                        <Box className="testimonilstextarea">
                                                            <InputLabel>Testimonial 1</InputLabel>
                                                            <TextareaAutosize minRows={3} placeholder="Minimum 3 rows" />
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={6} sm={12} lg={12} sx={ { paddingTop: '5px !important' } }>
                                                        <Box>
                                                            <InputLabel>Company</InputLabel>
                                                            <TextField
                                                                fullWidth
                                                                type="text"
                                                                autoComplete="new-password"
                                                                placeholder="I Am Invincible"
                                                            />
                                                        </Box>
                                                    </Grid>

                                                    <Grid item xs={6} sm={12} lg={12} sx={ { paddingTop: '5px !important' } }>
                                                        <Box>
                                                            <InputLabel>Testimonail</InputLabel>
                                                            <TextField
                                                                fullWidth
                                                                type="text"
                                                                autoComplete="new-password"
                                                                placeholder="I Am Invincible"
                                                            />
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item lg={6} sm={6} xs={12} className="upload-testimonials-box">
                                                <Button type="button" className="clear-testimonials">
                                                    Clear Testimonial
                                                </Button>

                                                <Box className="draganddrop" sx={ { padding: '10px', height: '136px' } }>

                                                    <i className="icon-Photograph" />
                                                    <Typography variant="h6">Drag and drop your images here</Typography>
                                                    <span>
                                                        or <a href="#">upload a file </a> from your computer
                                                    </span>
                                                </Box>
                                            </Grid>
                                         </Grid>

                                        <Grid item xs={12} className="add-testimonials-wrp">
                                            <CustomButton type="Button" className="add-testimonials">
                                                {' '}
                                                Add Testimonial
                                            </CustomButton>
                                        </Grid>
                                    </Box>
                                    </Grid>
                                    </Grid>
                                ) : ("")}
                            </Typography>

                            <Box mb={8} sx={ { display: 'flex', flexDirection: 'row', pt: 2 } }>
                                <CustomButton
                                    color="inherit"
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    className="buttonGlobal"
                                    sx={ { mr: 1 } }
                     z           >
                                    Back
                                </CustomButton>
                                <Box sx={ { flex: '1 1 auto' } } />
                                {isStepOptional(activeStep) && (
                                    <Button color="inherit" onClick={handleSkip} sx={ { marginRight: '1rem !important' } } className="buttonGlobal">
                                        Skip
                                    </Button>
                                )}
                                <CustomButton onClick={handleNext} className="buttonGlobal">
                                    {activeStep === steps.length - 1 ? 'Save' : 'Save & Next'}
                                </CustomButton>
                            </Box>
                        </React.Fragment>
                    )}
                </Box>
            </Container>
        </StyledEngineProvider>
    );
}




export default StallionEdit;