type FacebookAuthResponse = {
  accessToken: string;
  userID: string;
  expiresIn: number;
  signedRequest: string;
  graphDomain: string;
  data_access_expiration_time: number;
};

type FacebookLoginStatus = {
  authResponse: FacebookAuthResponse | null;
  status: 'connected' | 'not_authorized' | 'unknown';
};

export class FacebookSDK {
  private static instance: FacebookSDK | null = null;

  private constructor() {}

  private async loadSDK(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (document.getElementById('facebook-jssdk')) {
        console.log('SDK script already loaded');
        return;
      }
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';

      // script onload event
      script.onload = async () => {
        console.log('SDK script loaded');
        // after script load, start init sdk
        await this.initializeSDK();
        resolve();
      };

      // insert script to page
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode?.insertBefore(script, firstScript);
    });
  }

  private async initializeSDK(): Promise<void> {
    return new Promise<void>((resolve) => {
      window.fbAsyncInit = () => {
        window.FB.init({
          appId: process.env.REACT_APP_FB_APP_ID || '',
          cookie: true,
          xfbml: true,
          version: process.env.REACT_APP_FB_APP_VERSION || '',
        });

        console.log('[fbAsyncInit] after window.FB.init');
        resolve();
      };
    });
  }

  private async ensureSDKInitialized(): Promise<void> {
    if (!window.FB) {
      console.error('Facebook SDK is not properly initialized');
      throw new Error('Facebook SDK not initialized');
    }
  }

  public static async getInstance(): Promise<FacebookSDK> {
    if (!FacebookSDK.instance) {
      const sdk = new FacebookSDK();
      await sdk.loadSDK();
      FacebookSDK.instance = sdk;
    }
    return FacebookSDK.instance!;
  }

  public async getLoginStatus(): Promise<FacebookLoginStatus> {
    await this.ensureSDKInitialized();
    return new Promise((resolve) => {
      window.FB.getLoginStatus((response: FacebookLoginStatus) => {
        FacebookSDK.instance?.logPageView();
        resolve(response);
      });
    });
  }

  public logPageView(): void {
    if (window.FB && window.FB.AppEvents && typeof window.FB.AppEvents.logPageView === 'function') {
      window.FB.AppEvents.logPageView();
    } else {
      console.error('Facebook AppEvents or logPageView function is not available.');
    }
  }

  public login(): Promise<FacebookLoginStatus> {
    return new Promise((resolve) => {
      window.FB.login(
        (response: FacebookLoginStatus) => {
          console.log('Login response', response);
          resolve(response);
        },
        { scope: 'public_profile,email' },
      );
    });
  }

  public logout(): Promise<FacebookLoginStatus> {
    return new Promise((resolve) => {
      window.FB.logout((response: FacebookLoginStatus) => {
        console.log('handleFBLogout', response);
        resolve(response);
      });
    });
  }

  public me(): Promise<any> {
    return new Promise((resolve) => {
      window.FB.api(
        '/me/',
        'GET',
        { fields: 'id,name,email,accounts{name,instagram_business_account}' },
        (response: any) => {
          console.log('me', response);
          resolve(response);
        },
      );
    });
  }
}
