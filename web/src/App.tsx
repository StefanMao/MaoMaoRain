import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { FacebookSDK } from './utils/faceBookSdk';
import FaceBookLoginBtn from './components/IgLottery/FaceBookLoginBtn';

function App() {
  useEffect(() => {
    const initializeFacebookSDK = async () => {
      await FacebookSDK.getInstance();
    };
    initializeFacebookSDK();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <FaceBookLoginBtn onClick={faceBookLoginBtnClick} />
        <FaceBookLoginBtn onClick={logoutBtnClick} />
        <FaceBookLoginBtn onClick={me} />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

const faceBookLoginBtnClick = async () => {
  const fbSdkInstance = await FacebookSDK.getInstance();
  await fbSdkInstance.login();
  const loginStatus = await fbSdkInstance.getLoginStatus();
  console.log('Facebook Login Status:', loginStatus);
};

const logoutBtnClick = async () => {
  const fbSdkInstance = await FacebookSDK.getInstance();
  await fbSdkInstance.logout();
};

const me = async () => {
  const fbSdkInstance = await FacebookSDK.getInstance();
  const me = await fbSdkInstance.me();
  console.log(me);
}

export default App;
