// React、第三方套件、其他相關 import
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FacebookSDK } from './utils/facebook/faceBookSdk';

// Material-UI 相關 import
import { Container } from '@mui/material';

// 自定義樣式 import
import './App.css';
import { containerStyle, appStyle } from './AppStyle';

// 專案內部頁面和組件 相關 import
import HomePage from './pages/home-page/HomePage';
import IgLotteryPage from './pages/ig-lottery-page/IgLotteryPage';
import NavBar from './components/app/nav-bar/NavBar';
import Footer from './components/app/footer/Footer';

const App: React.FC = () => {
  useEffect(() => {
    const initializeFacebookSDK = async () => {
      await FacebookSDK.getInstance();
    };
    initializeFacebookSDK();
  }, []);

  return (
    <div style={appStyle}>
      <BrowserRouter>
        <NavBar />
        <Container style={containerStyle}>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/ig-lottery' element={<IgLotteryPage />} />
          </Routes>
        </Container>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
