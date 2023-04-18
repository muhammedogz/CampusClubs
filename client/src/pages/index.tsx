import { Box, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';

const Home = () => {
  return (
    <Layout>
      <Stack p="20px 20px">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          {/* <img
          src="public/icons/logo.svg"
          alt="logo"
          style={{
            width: '400px',
          }}
        /> */}
          <Typography variant="h4" component="h1" gutterBottom>
            CampusClubs'a hoş geldiniz
          </Typography>
          <Typography variant="body1">
            CampusClubs, üniversite öğrencilerinin birbirleriyle etkileşim
            kurmalarını sağlayan bir platformdur.
          </Typography>
          <Stack gap="20px">
            <Link to="signup">Kayit ol</Link>
            <Link to="signin">Giriş yap</Link>
          </Stack>
        </Box>
      </Stack>
    </Layout>
  );
};

export default Home;
