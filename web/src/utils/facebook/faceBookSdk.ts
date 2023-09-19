import { FacebookLoginStatus } from './faceBookSdkTypes';
import { FaceBookFanAccount, MeApiResponse } from './faceBookSdkTypes';

import { IInstagramMediaApi } from '../../utils/Instagram/instagramInterface';

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

  /**
   * Filter Facebook fan accounts to include only those linked to Instagram.
   *
   * @param {FaceBookFanAccount[]} datas - An array of Facebook fan accounts to filter.
   * @returns {FaceBookFanAccount[]} An array of filtered Facebook fan accounts with Instagram links.
   */
  private filterIgAccounts(datas: FaceBookFanAccount[]): FaceBookFanAccount[] {
    return datas.filter((account: FaceBookFanAccount) => account.instagram_business_account);
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
        { scope: 'public_profile,email,pages_show_list,instagram_basic,business_management' },
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
        (response: MeApiResponse) => {
          if (response.accounts) {
            response.accounts.data = this.filterIgAccounts(response.accounts.data);
          }
          console.log('window.FB.api / me', response);
          resolve(response);
        },
      );
    });
  }

  public getMediaPosts(businessAccountId: string): Promise<IInstagramMediaApi> {
    return new Promise((resolve) => {
      window.FB.api(
        `${process.env.REACT_APP_FB_APP_VERSION}/${businessAccountId}/media`,
        'GET',
        { fields: 'media_type,media_url,comments{id,text,username},caption,timestamp,shortcode' },
        (response: IInstagramMediaApi) => {
          console.log('window.FB.api / media', response);
          resolve(response);
        },
      );
    });
  }
}
