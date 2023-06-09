import { Backdrop, CircularProgress, Stack } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Endpoints, getApiEndpoint } from 'src/data/endpoints';
import { ApiResponseType } from 'src/types/types';
import { StorageKeyEnum, getLocalStorageItem } from 'src/utils/storageUtils';

type AuthResponse = {
  kullanici_adi: string;
  kurumsal_email_adresi: string;
  auth_token?: string;
};

const Auth = () => {
  const [auth, setAuth] = useState<AuthResponse | null>(null);
  const [urlParams] = useSearchParams();

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

    setAuth(response.data.data);
  };

  useEffect(() => {
    handleAuth();
  }, []);

  console.log(auth);

  if (auth?.auth_token) {
    return <Stack>Giriş Yapıldı</Stack>;
  } else if (auth?.kullanici_adi && auth?.kurumsal_email_adresi) {
    return <Stack>Üye ol modalı</Stack>;
  }

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
