// React、第三方套件、其他相關 import
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { FacebookSDK } from './utils/facebook/faceBookSdk';

// Material-UI 相關 import
import { Container } from '@mui/material';

// 自定義樣式 import
import './App.css';
import { containerStyle, appStyle } from './AppStyle';

// 專案內部頁面和組件 相關 import
import HomePage from './pages/home-page/HomePage';
import IgLotteryPage from './pages/ig-lottery-page/IgLotteryPage';
import NavBar from './components/layout/nav-bar/NavBar';
import Footer from './components/layout/footer/Footer';

const App: React.FC = () => {
  useEffect(() => {
    const initializeFacebookSDK = async () => {
      await FacebookSDK.getInstance();
    };
    initializeFacebookSDK();
  }, []);

  return (
    <div style={appStyle}>
      <HashRouter>
        <NavBar />
        <Container style={containerStyle}>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/ig-lottery' element={<IgLotteryPage />} />
          </Routes>
        </Container>
        <Footer />
      </HashRouter>
    </div>
  );
};

export default App;
