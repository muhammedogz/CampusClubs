import { Backdrop, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Endpoints, getApiEndpoint } from 'src/data/endpoints';
import { StorageKeyEnum, getLocalStorageItem } from 'src/utils/storageUtils';

const Auth = () => {
  const [urlParams] = useSearchParams();

  const handleAuth = async () => {
    const authorizeStorage = getLocalStorageItem(
      StorageKeyEnum.AUTHORIZE_STORAGE
    );
    if (!authorizeStorage) return;
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    console.log('code', code);
    console.log('state', state);
    const {
      code_verifier,
      state: storedState,
      code_challenge,
    } = authorizeStorage;
    console.log('code_verifier', code_verifier);
    console.log('code_challenge', code_challenge);
    console.log('storedState', storedState);

    // Check with stored state
    if (state !== storedState) return;

    // post request to https://kampus.gtu.edu.tr/oauth/dogrulama
    const body = {
      codeVerifier: code_verifier,
      code,
    };
    const response = await axios.post(
      getApiEndpoint(Endpoints.AUTH),
      body
    );

    const data = await response;
    console.log('data', data);

    console.log("I'm here");
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
