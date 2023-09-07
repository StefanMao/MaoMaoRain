export type FacebookAuthResponse = {
  accessToken: string;
  userID: string;
  expiresIn?: number;
  signedRequest?: string;
  graphDomain?: string;
  data_access_expiration_time?: number;
};

export type FacebookLoginStatus = {
  authResponse: FacebookAuthResponse | null;
  status: 'connected' | 'not_authorized' | 'unknown';
};

export type MeApiResponse = {
  id?: string;
  name?: string;
  email?: string;
  accounts?: object;
};
