import { Button, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import Image from 'src/components/common/Image';
import { Link } from 'src/components/common/Link';
import { Layout } from 'src/components/layout/Layout';
import { Routes } from 'src/data/routes';
import { generateRedirectUrl } from 'src/utils/authUtils';
import { getLocalImage } from 'src/utils/imageUtils';

const Home = () => {
  useEffect(() => {
    const redirect = generateRedirectUrl();
    console.log('redirect', redirect);
  }, []);

  return (
    <Layout>
      <Stack
        p="20px 20px"
        textAlign="center"
        justifyContent="center"
        alignItems="center"
        gap="20px"
      >
        <Stack>
          <Stack justifyContent="center" alignItems="center">
            <Image
              src={getLocalImage('/icons/logo-white.svg')}
              alt="logo"
              width="300px"
            />
          </Stack>
          <Stack maxWidth="550px">
            <Typography variant="h4" component="h1" gutterBottom>
              CampusClubs'a hoş geldiniz
            </Typography>
            <Typography variant="body1">
              CampusClubs ile kulüpleri inceleybilir, etkinliklere katılabilir
              ve üniversite hayatınızı daha keyifli hale getirebilirsiniz.
            </Typography>
          </Stack>
        </Stack>
        <Stack id="butonlar" flexDirection="row" gap="20px">
          <Link to={Routes.KULUP}>
            <Button variant="contained" color="secondary">
              <Typography component="h2" gutterBottom>
                Tüm kulüpler
              </Typography>
            </Button>
          </Link>
          <Link to={Routes.KULUP}>
            <Button variant="contained" color="secondary">
              <Typography component="h2" gutterBottom>
                Tüm Etkinlikler
              </Typography>
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Layout>
  );
};

export default Home;
