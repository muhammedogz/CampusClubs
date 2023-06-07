import { Backdrop, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
      client_id: '88AD669CED46431AB77DAD88309327F5',
      client_secret: 'BD35E1A4DBE84B7EA9D618B9E341C190',
      code_verifier,
      code,
    };
    const response = await axios.post(
      'https://kampus.gtu.edu.tr/oauth/dogrulama',
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
