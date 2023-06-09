import {
  Button,
  Menu,
  MenuItem,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CCButton from 'src/components/common/CCButton';
import Image from 'src/components/common/Image';
import { Routes } from 'src/data/routes';
import { generateRedirectUrl } from 'src/utils/authUtils';
import { getRemoteImage } from 'src/utils/imageUtils';
import {
  StorageKeyEnum,
  getLocalStorageItem,
  removeLocalStorageItem,
  updateLocalStorageItem,
} from 'src/utils/storageUtils';
import { generateRoute } from 'src/utils/urlUtils';

function ResponsiveAppBar() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [loadingSigninButton, setLoadingSigninButton] = useState(false);
  const navigate = useNavigate();
  const user = getLocalStorageItem(StorageKeyEnum.USER_STORAGE)?.user;
  const isMobile = useMediaQuery(useTheme().breakpoints.down('md'));

  const handleSignin = useCallback(() => {
    setLoadingSigninButton(true);
    const { url, code_verifier, state, code_challenge } = generateRedirectUrl();
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
            <MenuItem
              onClick={() => {
                navigate(generateRoute(`${Routes.USER}/${user?.userId}`));
                handleCloseUserMenu();
              }}
            >
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
        <Stack>
          <Button onClick={handleOpenUserMenu}>
            <Image
              shadow
              width={isMobile ? '50px' : '100px'}
              height={isMobile ? '50px' : '100px'}
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
