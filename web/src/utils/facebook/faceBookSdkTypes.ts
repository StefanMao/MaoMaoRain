export type FaceBookFanAccount = {
  name: string;
  instagram_business_account?: {
    id: string;
  };
  id: string;
};

export type FacebookFanAccountsData = {
  data: FaceBookFanAccount[];
  paging?: object;
}

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
  accounts?: FacebookFanAccountsData;
};

