import {
  Autocomplete,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Box, Container } from '@mui/system';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CCButton from 'src/components/common/CCButton';
import Image from 'src/components/common/Image';
import FileUpload from 'src/components/form/FileUpload';
import { Layout } from 'src/components/layout/Layout';
import { departmentData } from 'src/data/departmentData';
import { Routes } from 'src/data/routes';
import { signUpFetcher } from 'src/fetch/authFetchers';
import { uploadFileFetcher } from 'src/fetch/fetchers';
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
  departmentId: number | null;
};

const SignUp = () => {
  const [loadingSignup, setLoadingSignup] = useState(false);
  const naviagte = useNavigate();
  const auth = getLocalStorageItem(StorageKeyEnum.SIGNUP_STORAGE)?.auth;

  const [user, setUser] = useState<UserSignUpType>({
    username: auth?.kullanici_adi ?? '',
    email: auth?.kurumsal_email_adresi ?? '',
    firstName: '',
    lastName: '',
    file: null,
    departmentId: null,
  });

  const handleSubmit = async () => {
    try {
      setLoadingSignup(true);

      let imageUrl: string | null = null;

      if (user.file) {
        const uploadResponse = await uploadFileFetcher(user.file);

        imageUrl = uploadResponse.data.filePath;
      }

      const signUpUsrResponse = await signUpFetcher({
        ...user,
        departmentId: user.departmentId as number,
        image: imageUrl,
      });

      if (signUpUsrResponse.status) {
        const data = signUpUsrResponse.data;
        const token = data.token as string;
        updateLocalStorageItem(StorageKeyEnum.USER_STORAGE, {
          token,
          user: data.user,
        });
        removeLocalStorageItem(StorageKeyEnum.SIGNUP_STORAGE);
        naviagte(generateRoute(Routes.HOME));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSignup(false);
    }
  };

  useEffect(() => {
    if (!auth) {
      naviagte(generateRoute(Routes.HOME));
    }
  }, [auth, naviagte]);

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
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={departmentData}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Bölüm"
                      name="department"
                      required
                      fullWidth
                    />
                  )}
                  onChange={(e, value) => {
                    setUser({
                      ...user,
                      departmentId: value?.departmentId ?? null,
                    });
                  }}
                  getOptionLabel={(option) => option.name}
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
                  disabled={
                    !user.departmentId || !user.firstName || !user.lastName
                  }
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
                    removeLocalStorageItem(StorageKeyEnum.SIGNUP_STORAGE);
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
