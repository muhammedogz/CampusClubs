import { Button, Menu, MenuItem, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CCButton from 'src/components/common/CCButton';
import Image from 'src/components/common/Image';
import { generateRedirectUrl } from 'src/utils/authUtils';
import { getRemoteImage } from 'src/utils/imageUtils';
import {
  StorageKeyEnum,
  getLocalStorageItem,
  removeLocalStorageItem,
  updateLocalStorageItem,
} from 'src/utils/storageUtils';

function ResponsiveAppBar() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [loadingSigninButton, setLoadingSigninButton] = useState(false);
  const navigate = useNavigate();
  const user = getLocalStorageItem(StorageKeyEnum.USER_STORAGE)?.user;

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

  const userLoggedIn = !!user?.firstName;

  const LoggedUserContent = () => {
    return (
      <Stack>
        <Stack>
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
            <MenuItem onClick={handleCloseUserMenu}>
              <Typography textAlign="center">Profilim</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                // remove all stroages and logout
                const storageKeysToRemove = Object.values(StorageKeyEnum);
                storageKeysToRemove.forEach((key) => {
                  removeLocalStorageItem(key);
                });
                navigate(0);
                handleCloseUserMenu();
              }}
            >
              <Typography textAlign="center">Çıkış yap</Typography>
            </MenuItem>
          </Menu>
        </Stack>
      </Stack>
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

  return (
    <Stack
      sx={{
        position: 'fixed',
        top: 10,
        right: 10,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      {userLoggedIn ? (
        <Stack
          sx={{
            border: '2px solid red',
          }}
        >
          <Button onClick={handleOpenUserMenu}>
            <Image
              width="100px"
              height="100px"
              variant="circular"
              src={getRemoteImage(user?.image)}
            />
          </Button>
          <LoggedUserContent />
        </Stack>
      ) : (
        <NotLoggedUserContent />
      )}
    </Stack>
  );
}

export default ResponsiveAppBar;
