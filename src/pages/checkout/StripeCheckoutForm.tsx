import React from 'react'
import '../checkout/checkout.css'
import {
    useStripe,
    useElements,
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement
  } from "@stripe/react-stripe-js";
  
  const useOptions = () => {
    const options = {
        style: {
          base: {
            color: "#424770",
            letterSpacing: "0.025em",
            fontFamily: "Source Code Pro, monospace",
            "::placeholder": {
              color: "#aab7c4"
            }
          },
          invalid: {
            color: "#9e2146"
          },
         
        }
      }
  
    return options;
  };
  
  const StripeCheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const options = useOptions();
    const card : any = elements?.getElement(CardNumberElement)
  
    const handleSubmit = async (event : any )=> {
      event.preventDefault();
  
      if (!stripe || !elements) {
        // console.log("Stripe and elements", stripe, elements)
        return;
      }
  
      const payload = card && await stripe.createPaymentMethod({
        type: "card",
        card: card
      });
      // console.log("[PaymentMethod]", payload);
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <label>
          Card number
          <CardNumberElement
            options={options}
            onReady={() => {
              // console.log("CardNumberElement [ready]");
            } }
            onChange={event => {
              // console.log("CardNumberElement [change]", event);
            } }
            onBlur={() => {
              // console.log("CardNumberElement [blur]");
            } }
            onFocus={() => {
              // console.log("CardNumberElement [focus]");
            } }
          />
        </label>
        <label>
          Expiration date
          <CardExpiryElement
            options={options}
            onReady={() => {
              // console.log("CardNumberElement [ready]");
            } }
            onChange={event => {
              // console.log("CardNumberElement [change]", event);
            } }
            onBlur={() => {
              // console.log("CardNumberElement [blur]");
            } }
            onFocus={() => {
              // console.log("CardNumberElement [focus]");
            } }
          />
        </label>
        <label>
          CVC
          <CardCvcElement
            options={options}
            onReady={() => {
              // console.log("CardNumberElement [ready]");
            } }
            onChange={event => {
              // console.log("CardNumberElement [change]", event);
            } }
            onBlur={() => {
              // console.log("CardNumberElement [blur]");
            } }
            onFocus={() => {
              // console.log("CardNumberElement [focus]");
            } }
          />
        </label>
        <button type="submit" disabled={!!stripe}>
          Checkout
        </button>
      </form>
    );
  };

export default StripeCheckoutForm