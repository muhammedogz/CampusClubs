import { Grid, Stack, TextField, Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CCButton from 'src/components/common/CCButton';
import Image from 'src/components/common/Image';
import FileUpload from 'src/components/form/FileUpload';
import { Layout } from 'src/components/layout/Layout';
import { Routes } from 'src/data/routes';
import { signUpFetcher, uploadFileFetcher } from 'src/fetch/fetchers';
import { getLocalImage } from 'src/utils/imageUtils';
import {
  StorageKeyEnum,
  getLocalStorageItem,
  removeLocalStorageItem,
  updateLocalStorageItem,
} from 'src/utils/storageUtils';
import { generateRoute } from 'src/utils/urlUtils';

type UserSignUpType = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  file: File | null;
};

const SignUp = () => {
  const [loadingSignup, setLoadingSignup] = useState(false);
  const naviagte = useNavigate();
  const auth = getLocalStorageItem(StorageKeyEnum.SignupStorage)?.auth;

  const [user, setUser] = useState<UserSignUpType>({
    username: auth?.kullanici_adi ?? '',
    email: auth?.kurumsal_email_adresi ?? '',
    firstName: '',
    lastName: '',
    file: null,
  });

  const handleSubmit = async () => {
    try {
      setLoadingSignup(true);
      console.log({ user });

      let imageUrl: string | null = null;

      if (user.file) {
        const uploadResponse = await uploadFileFetcher(user.file);

        console.log(uploadResponse);
        imageUrl = uploadResponse.data.filePath;
      }

      console.log(imageUrl);

      const signUpUsrResponse = await signUpFetcher({
        ...user,
        image: imageUrl,
      });

      if (signUpUsrResponse.status) {
        const data = signUpUsrResponse.data;
        const token = signUpUsrResponse.token as string;
        updateLocalStorageItem(StorageKeyEnum.USER_STORAGE, {
          token,
          user: data,
        });
        removeLocalStorageItem(StorageKeyEnum.SignupStorage);
        naviagte(generateRoute(Routes.HOME));
      }

      console.log(signUpUsrResponse);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSignup(false);
    }
  };

  useEffect(() => {
    console.log('auth', auth);
    if (!auth) {
      console.log('here');
      naviagte(generateRoute(Routes.HOME));
    }
  }, []);

  if (!auth) {
    return null;
  }

  return (
    <Layout>
      <Container component="main" maxWidth="md">
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
                <FileUpload
                  onSelectComplete={(file) => setUser({ ...user, file })}
                />
              </Grid>
            </Grid>
            <Stack>
              <Stack justifyContent="center" alignItems="center">
                <CCButton
                  loading={loadingSignup}
                  disabled={!user.firstName || !user.lastName}
                  onClick={handleSubmit}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, width: '50%' }}
                >
                  Üye Ol
                </CCButton>
              </Stack>
              <Stack justifyContent="center" alignItems="center">
                <CCButton
                  onClick={() => {
                    removeLocalStorageItem(StorageKeyEnum.SignupStorage);
                    naviagte(generateRoute(Routes.HOME));
                  }}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, width: '50%' }}
                >
                  İptal Et
                </CCButton>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default SignUp;
