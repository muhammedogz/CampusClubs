import { Menu, MenuItem, Stack } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CCButton from 'src/components/common/CCButton';
import { generateRedirectUrl } from 'src/utils/authUtils';
import { isUserLoggedIn } from 'src/utils/utils';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [loadingSigninButton, setLoadingSigninButton] = useState(false);

  const navigate = useNavigate();

  const handleSignin = useCallback(() => {
    setLoadingSigninButton(true);
    const { url } = generateRedirectUrl();
    window.location.href = url;

    setLoadingSigninButton(false);
  }, []);

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const userLoggedIn = isUserLoggedIn();

  const LoggedUserContent = () => {
    return (
      <Menu
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
      </Menu>
    );
  };

  const NotLoggedUserContent = () => {
    return (
      <Tooltip title="Giriş Yap">
        <CCButton
          loading={loadingSigninButton}
          onClick={handleSignin}
          variant="contained"
        >
          <Typography textAlign="center">Giriş Yap</Typography>
        </CCButton>
      </Tooltip>
    );
  };

  console.log('userLoggedIn', userLoggedIn);

  return (
    <Stack
      sx={{
        position: 'fixed',
        top: 10,
        right: 10,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      {userLoggedIn ? <LoggedUserContent /> : <NotLoggedUserContent />}
    </Stack>
  );
}
export default ResponsiveAppBar;
