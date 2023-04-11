import { Box, Container, Stack, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="sm">
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
    </Container>
  );
};

export default Home;
