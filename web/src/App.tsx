import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { FacebookSDK } from './utils/faceBookSdk';
import HomePage from './pages/HomePage/HomePage';
import IgLotteryPage from './pages/IgLotteryPage/IgLotteryPage';

const App: React.FC = () => {
  useEffect(() => {
    const initializeFacebookSDK = async () => {
      await FacebookSDK.getInstance();
    };
    initializeFacebookSDK();
  }, []);
  return (
    <div className='App'>
      <BrowserRouter>
        <div>Nav Bar</div>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/ig-lottery' element={<IgLotteryPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
