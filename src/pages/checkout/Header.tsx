import { Container, Grid, Typography , StyledEngineProvider } from '@mui/material';



function Header() {
    return (
    <>
    <StyledEngineProvider injectFirst>
        <Container maxWidth="lg">
            <Grid container  mt={5} mb={2}>
                <Grid item lg={12} sm={12} xs={12}>
                    <Typography variant='h2'>
                        {
                            localStorage.getItem('accessToken')?`Checkout - ${JSON.parse(localStorage.user).fullName}`: `Guest Checkout`
                        }
            
                    </Typography>
                </Grid>
        </Grid>
        </Container>
        </StyledEngineProvider>
    </>
    );
}

export default Header;
