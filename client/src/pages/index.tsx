import { Button, Stack, Typography } from '@mui/material';
import Image from 'src/components/common/Image';
import { Link } from 'src/components/common/Link';
import { Layout } from 'src/components/layout/Layout';
import { Routes } from 'src/data/routes';

const Home = () => {
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
            <Image src="/icons/logo-white.svg" alt="logo" width="200px" />
          </Stack>
          <Stack maxWidth="550px">
            <Typography variant="h4" component="h1" gutterBottom>
              CampusClubs'a hoş geldiniz
            </Typography>
            <Typography variant="body1">
              CampusClubs, üniversite öğrencilerinin birbirleriyle etkileşim
              kurmalarını sağlayan bir platformdur.
            </Typography>
          </Stack>
        </Stack>
        <Stack id="butonlar" flexDirection="row" gap="20px">
          <Link to={Routes.KULUP}>
            <Button variant="contained" color="secondary">
              <Typography variant="h6" component="h2" gutterBottom>
                Tüm kulüpler
              </Typography>
            </Button>
          </Link>
          <Link to={Routes.KULUP}>
            <Button variant="contained" color="secondary">
              <Typography variant="h6" component="h2" gutterBottom>
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
