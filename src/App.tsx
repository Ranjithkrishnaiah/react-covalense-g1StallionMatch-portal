import Router from './routes'
import { theme } from './theme'
import { ThemeProvider } from '@mui/material/styles';
import { DummyAuthProvider } from './contexts/DummyAuth';
import { CommunicationProvider } from 'src/contexts/ComponentCommunication'
import { NavProvider } from 'src/contexts/NavContext';
// import { BrowserRouter } from 'react-router-dom';
// import { loadStripe } from "@stripe/stripe-js";
// import StripeCheckoutForm  from './pages/checkout/StripeCheckoutForm';
// const stripePromise = loadStripe("k_test_51KyDD6SBTC6ia7ZuseSWFUrgG6r6j4Pgz8bUAE2ksg5I5mAqjlkZA14OTy6wI8IKc9OitfWIzyrdpBaqpI8XmG2M00Qq2U6tdQ");

function App() {
  return (
    <ThemeProvider theme={theme}>
      <DummyAuthProvider>
        <CommunicationProvider>
          <NavProvider>
            <Router/>
          </NavProvider>
        </CommunicationProvider>
      </DummyAuthProvider>
    </ThemeProvider>
  )
}

// const App = () => {
//   return (
//     <BrowserRouter>
//       <Elements stripe={stripePromise}>
//         <StripeCheckoutForm/>
//       </Elements>
//     </BrowserRouter>
//   );
// };

export default App