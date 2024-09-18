import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'primereact/resources/themes/lara-light-cyan/theme.css';  
import 'primereact/resources/primereact.min.css';   
import 'primeicons/primeicons.css';

import App from '~/App';
import GlobalStyles from '~/components/GlobalStyles/GlobalStyles';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <GlobalStyles>
      <App />
    </GlobalStyles>
  </React.StrictMode>
);


reportWebVitals();
