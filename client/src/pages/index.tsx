import { Box, Stack, Typography } from '@mui/material';
import { Menu, MenuItem, Sidebar, SubMenu } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Stack flexDirection="row">
      <Sidebar>
        <Menu>
          <SubMenu label="Charts">
            <MenuItem> Pie charts </MenuItem>
            <MenuItem> Line charts </MenuItem>
          </SubMenu>
          <MenuItem> Documentation </MenuItem>
          <MenuItem> Calendar </MenuItem>
        </Menu>
      </Sidebar>
      <Stack
        p="20px 20px"
        sx={{
          border: '2px solid red',
        }}
      >
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
    </Stack>
  );
};

export default Home;
