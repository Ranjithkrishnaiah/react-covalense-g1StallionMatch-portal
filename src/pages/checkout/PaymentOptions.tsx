
import React, { useState } from "react";
import { Box, Container, Stack, Divider, Grid, Button, Typography } from "@mui/material"
import axios from "axios";
import { api } from "src/api/apiPaths";
import { Images } from "src/assets/images";
import useAuth from "src/hooks/useAuth";

function PaymentOptions(props: any) {

    const { authentication } = useAuth();
    const [isPaypalEnabled, setIsPaypalEnabled] = useState(false);
    const [isfetchting, setIsfetchting] = useState(false);

    React.useEffect(() => {
        if (authentication) {
            setIsfetchting(true);
            GetPatmentInfo();
        }
    }, [])

    // Get payment info like saved card details
    let GetPatmentInfo = async () => {
        var config: any = {
            method: 'get',
            url: `${api.baseUrl}/member-paytype-access`,
            headers: {
                'Authorization': `Bearer ${localStorage.accessToken}`
            }
        };
        await axios(config)
            .then(function (response) {
                setIsfetchting(false);
                if (response.data.length) {
                    let ispaypal: any = {};
                    ispaypal = response.data.find((val: any) => val.paymentMethod === "PayPal")
                    if (ispaypal?.customerId) {
                        setIsPaypalEnabled(true);
                    }
                }
            })
            .catch(function (error) {
                setIsfetchting(false);
            })
    }

    // const invalidZip = localStorage.getItem('invalidZipcode') ? JSON.parse(localStorage.getItem('invalidZipcode') || '') : false;

    return (
        <Container>
            <Box className="checkout-payment-options">
                <Stack direction="row" spacing={3}>
                    <Box>
                        <Button disableRipple disabled={authentication ? isPaypalEnabled === true ? false : true : false} onClick={() => props.handlePaypalOpen(true)}>
                            <img src={Images.PayPalCheckout} alt='Paypal' />
                        </Button>
                        {/* <Button disableRipple disabled={authentication ? isPaypalEnabled === true ? invalidZip == true ? true :  false : true : false} onClick={() => props.handlePaypalOpen(true)}>
                            <img src={Images.PayPalCheckout} alt='Paypal' />
                        </Button> */}
                    </Box>

                    {/* <Box>
                <Button disableRipple className="paybtn">
                        <img src={Images.ApplePay} alt='Apple Pay'/>
                    </Button>
                </Box>
                <Box>
                <Button disableRipple className="paybtn">
                        <img src={Images.GooglePay} alt='Google Pay'/>
                    </Button>
                </Box> */}
                </Stack>
            </Box>
            {(isfetchting === false && authentication == true && isPaypalEnabled == false) && <Box>
                <Typography variant="h5" align='center' color={'#C75227'}>
                    To enable PayPal payment, Please add the details to your profile Payment settings.
                </Typography>
            </Box>}

        </Container>
    )
}

export default PaymentOptions;