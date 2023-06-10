import { Backdrop, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Endpoints, getApiEndpoint } from 'src/data/endpoints';
import { Routes } from 'src/data/routes';
import { ApiResponseType } from 'src/types/types';
import {
  StorageKeyEnum,
  getLocalStorageItem,
  updateLocalStorageItem,
} from 'src/utils/storageUtils';
import { generateRoute } from 'src/utils/urlUtils';

export type AuthResponse = {
  kullanici_adi: string;
  kurumsal_email_adresi: string;
  auth_token?: string;
};

const Auth = () => {
  const [urlParams] = useSearchParams();
  const navigate = useNavigate();

  const handleAuth = async () => {
    const authorizeStorage = getLocalStorageItem(
      StorageKeyEnum.AUTHORIZE_STORAGE
    );
    if (!authorizeStorage) return;
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const { code_verifier, state: storedState } = authorizeStorage;

    // Check with stored state
    if (state !== storedState) return;

    // post request to https://kampus.gtu.edu.tr/oauth/dogrulama
    const body = {
      codeVerifier: code_verifier,
      code,
    };
    const response = await axios.post<ApiResponseType<AuthResponse>>(
      getApiEndpoint(Endpoints.AUTH),
      body
    );

    console.log('response', response);
    const auth = response.data.data;
    if (!auth) return;
    updateLocalStorageItem(StorageKeyEnum.SignupStorage, {
      auth,
    });
    navigate(generateRoute(Routes.SIGN_UP));
  };

  useEffect(() => {
    handleAuth();
  }, []);

  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Auth;
