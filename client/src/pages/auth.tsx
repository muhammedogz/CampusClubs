import { Backdrop, CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Routes } from 'src/data/routes';
import { AuthExistingResponseType, authFetcher } from 'src/fetch/authFetchers';
import {
  StorageKeyEnum,
  getLocalStorageItem,
  removeLocalStorageItem,
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
    if (state !== storedState || !code_verifier || !code) return;

    // post request to https://kampus.gtu.edu.tr/oauth/dogrulama
    const authResponse = await authFetcher({
      codeVerifier: code_verifier,
      code,
    });

    if (authResponse.message === 'kullanici-bulundu') {
      const data = authResponse.data as AuthExistingResponseType;
      updateLocalStorageItem(StorageKeyEnum.USER_STORAGE, {
        token: data.token as string,
        user: data.user,
      });
      removeLocalStorageItem(StorageKeyEnum.AUTHORIZE_STORAGE);
      navigate(generateRoute(Routes.HOME));
    } else {
      const auth = authResponse.data as AuthResponse;
      if (!auth) return;
      updateLocalStorageItem(StorageKeyEnum.SIGNUP_STORAGE, {
        auth,
      });
      removeLocalStorageItem(StorageKeyEnum.AUTHORIZE_STORAGE);
      navigate(generateRoute(Routes.SIGN_UP));
    }
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
