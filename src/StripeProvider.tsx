import { loadStripe } from '@stripe/stripe-js';

let stripePromise : any = null;

if(process.env.REACT_APP_STRIPE_PUBLIC_KEY)
    stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)
    const StripePromise = stripePromise && stripePromise

export default StripePromise;