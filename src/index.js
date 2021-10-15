import React from 'react';
import ReactDOM from 'react-dom';
import { SpeechProvider } from '@speechly/react-client'
import { Provider } from './context/context'
import './index.css';
import App from './App';

ReactDOM.render(
  <SpeechProvider appId="3548a47f-4c4c-4830-a4df-4c2cd98e4d16" language="en-US">
  <Provider>
    <App />
  </Provider>
  </SpeechProvider>,
  document.getElementById('root')
);

