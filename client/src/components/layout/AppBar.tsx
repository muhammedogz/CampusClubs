import { Button, Stack } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Link } from 'src/components/common/Link';
import { Routes } from 'src/data/routes';

// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar() {
  // const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  // const handleCloseUserMenu = () => {
  //   setAnchorElUser(null);
  // };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    // setAnchorElUser(event.currentTarget);
  };
  return (
    <Stack
      sx={{
        position: 'fixed',
        top: 10,
        right: 10,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Tooltip title="Giriş Yap">
        <Button onClick={handleOpenUserMenu} variant="contained">
          <Link to={Routes.SIGN_IN}>
            <Typography textAlign="center">Giriş Yap</Typography>
          </Link>
        </Button>
      </Tooltip>
      {/* <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting) => (
          <MenuItem key={setting} onClick={handleCloseUserMenu}>
            <Typography textAlign="center">{setting}</Typography>
          </MenuItem>
        ))}
      </Menu> */}
    </Stack>
  );
}
export default ResponsiveAppBar;
