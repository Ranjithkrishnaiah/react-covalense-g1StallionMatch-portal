// i18n
import './locales/i18n';

// highlight
import './utils/highlight';

// scroll bar
import 'simplebar/src/simplebar.css';

// lightbox
import 'react-image-lightbox/style.css';

// map
import 'mapbox-gl/dist/mapbox-gl.css';

// editor
import 'react-quill/dist/quill.snow.css';

// slick-carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';

import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
// @mui
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
// redux
import { store, persistor } from './redux/store';

import { AuthProvider } from './contexts/JWTAuthContext';
import { CookiesProvider } from 'react-cookie';

//
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GA4React from 'ga-4-react';
import * as serviceWorker from './service-worker';

const googleClientId: any = process.env.REACT_APP_GOOGLE_CLIENT_ID;

ReactDOM.render(
  <GoogleOAuthProvider clientId={googleClientId}>
    <AuthProvider>
      <HelmetProvider>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <BrowserRouter>
                <CookiesProvider>
                  <ToastContainer />
                  <App />
                </CookiesProvider>
              </BrowserRouter>
            </LocalizationProvider>
          </PersistGate>
        </ReduxProvider>
      </HelmetProvider>
    </AuthProvider>
   </GoogleOAuthProvider>,
  document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

// try {
//   setTimeout((_: any) => {
//     const ga4react = new GA4React('G-9FH4JR50FY');
//     ga4react.initialize();
//   }, 4000);
// } catch (err) {
//   console.error(err);
// }