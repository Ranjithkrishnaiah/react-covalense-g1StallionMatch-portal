import { Box, Container, Divider, Grid } from "@mui/material"
import { Images } from "src/assets/images"
import useAuth from "src/hooks/useAuth";

function Design() {
  const { authentication } = useAuth();
//   console.log(authentication,'authentication')

    return (
        <Container>
            <Box className="checkout-divider" sx={{ display: 'flex' }} >
                <Grid item lg={5} xs={4} className={`${(window.location.pathname === '/checkout' || window.location.pathname === '/payment') ? 'step-completed' : 'step-uncompleted'} account`}>
                    Account
                </Grid>
                <Grid item lg={2} sm={2} xs={4} className={`${window.location.pathname === '/payment' ?  'step-completed': authentication ? 'step-completed': 'step-uncompleted'  }`}>
                    <Divider>
                        {(window.location.pathname === '/payment') && <img src={Images.accounticon} style={{ width: '60px', height: '60px' }} alt="Account" />}
                        {(window.location.pathname === '/checkout' && authentication === false) && <img src={Images.paymentTick} style={{ width: '60px', height: '60px' }} alt="Account" />}
                        {(window.location.pathname === '/checkout' && authentication === true) && <img src={Images.accounticon} style={{ width: '60px', height: '60px' }} alt="Account" />}
                    </Divider>
                </Grid>
                <Grid item lg={5} xs={4} className={`${window.location.pathname === '/payment' ? 'step-completed' : 'step-uncompleted'} ${(window.location.pathname === '/checkout' &&  authentication === true) ? 'auth-user-payment': ''} payment`}>
                    Payment
                </Grid>
            </Box>
        </Container>
    )
}

export default Design