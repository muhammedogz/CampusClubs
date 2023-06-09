import {
  Backdrop,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Box, Container } from '@mui/system';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Image from 'src/components/common/Image';
import { Layout } from 'src/components/layout/Layout';
import { Endpoints, getApiEndpoint } from 'src/data/endpoints';
import { ApiResponseType } from 'src/types/types';
import { getLocalImage } from 'src/utils/imageUtils';
import { StorageKeyEnum, getLocalStorageItem } from 'src/utils/storageUtils';

type SignUpContentProps = {
  auth: AuthResponse;
};

type UserSignUpType = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  file: File | null;
};

const SignUpContent = ({ auth }: SignUpContentProps) => {
  const [user, setUser] = useState<UserSignUpType>({
    username: auth.kullanici_adi,
    email: auth.kurumsal_email_adresi,
    firstName: '',
    lastName: '',
    file: null,
  });

  const handleSubmit = () => {
    console.log({ user });
  };

  return (
    <Layout>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Image
            src={getLocalImage('/icons/logo-white.svg')}
            alt="logo"
            width="250px"
          />
          <Typography component="h1" variant="h5">
            Kayıt Ol
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="Kullanıcı Adı"
                  label="Kullanıcı Adı"
                  onChange={(e) => {
                    setUser({ ...user, username: e.target.value });
                  }}
                  required
                  disabled
                  fullWidth
                  value={auth.kullanici_adi}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="Email"
                  label="Email"
                  name="email"
                  onChange={(e) => {
                    setUser({ ...user, email: e.target.value });
                  }}
                  required
                  disabled
                  fullWidth
                  value={auth.kurumsal_email_adresi}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="firstName"
                  onChange={(e) => {
                    setUser({ ...user, firstName: e.target.value });
                  }}
                  required
                  fullWidth
                  id="firstName"
                  label="İsim"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="lastName"
                  label="Soyisim"
                  name="lastName"
                  onChange={(e) => {
                    setUser({ ...user, lastName: e.target.value });
                  }}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" component="label">
                  Resim Yükle
                  <input
                    hidden
                    type="file"
                    name="file"
                    onChange={(e) => {
                      setUser({ ...user, file: e.target.files?.[0] ?? null });
                    }}
                  />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              onClick={handleSubmit}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

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
  } else if (auth) {
    return <SignUpContent auth={auth} />;
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
