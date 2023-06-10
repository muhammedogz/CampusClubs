import { Button, Grid, TextField, Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from 'src/components/common/Image';
import FileUpload from 'src/components/form/FileUpload';
import { Layout } from 'src/components/layout/Layout';
import { Endpoints, getApiEndpoint } from 'src/data/endpoints';
import { Routes } from 'src/data/routes';
import { getLocalImage } from 'src/utils/imageUtils';
import { StorageKeyEnum, getLocalStorageItem } from 'src/utils/storageUtils';
import { generateRoute } from 'src/utils/urlUtils';

type UserSignUpType = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  file: File | null;
};

const SignUp = () => {
  const naviagte = useNavigate();
  const auth = getLocalStorageItem(StorageKeyEnum.SignupStorage)?.auth;

  if (!auth) {
    naviagte(generateRoute(Routes.HOME));
    return null;
  }

  const [user, setUser] = useState<UserSignUpType>({
    username: auth.kullanici_adi,
    email: auth.kurumsal_email_adresi,
    firstName: '',
    lastName: '',
    file: null,
  });

  const handleSubmit = async () => {
    console.log({ user });

    if (user.file) {
      try {
        const formData = new FormData();
        formData.append('file', user.file);

        const { data } = await axios.post(
          getApiEndpoint(Endpoints.FILEUPLOAD),
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );

        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

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

export default SignUp;
