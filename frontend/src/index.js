import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Chat from './screens/Chat/Chat';
import { Provider } from 'react-redux';
import store from './store/store';
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import app, { saveSettings } from './utils/firebase';


let persist = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById('root'));
// addData()
root.render(
  <Provider store={store}>
    {/* <PersistGate loading={null} persistor={persist}> */}
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/chat' element={<Chat />} />
        </Routes>
      </BrowserRouter>
    {/* </PersistGate> */}
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

console.log('env===>', process.env)