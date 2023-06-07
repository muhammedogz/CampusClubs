import { Menu, MenuItem, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useCallback, useState } from 'react';
import CCButton from 'src/components/common/CCButton';
import { generateRedirectUrl } from 'src/utils/authUtils';
import { StorageKeyEnum, updateLocalStorageItem } from 'src/utils/storageUtils';
import { isUserLoggedIn } from 'src/utils/utils';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [loadingSigninButton, setLoadingSigninButton] = useState(false);

  const handleSignin = useCallback(() => {
    setLoadingSigninButton(true);
    const { url, code_verifier, state, code_challenge } = generateRedirectUrl();
    console.log('url', url);
    console.log('code_verifier', code_verifier);
    console.log('state', state);
    console.log('code_challenge', code_challenge);
    updateLocalStorageItem(StorageKeyEnum.AUTHORIZE_STORAGE, {
      code_verifier,
      code_challenge,
      state,
    });

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
      <CCButton
        loading={loadingSigninButton}
        onClick={handleSignin}
        variant="contained"
      >
        <Typography textAlign="center">Giriş Yap</Typography>
      </CCButton>
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
