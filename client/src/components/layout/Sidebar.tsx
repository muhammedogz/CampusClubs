import ContactsSharpIcon from '@mui/icons-material/ContactsSharp';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import SettingsIcon from '@mui/icons-material/Settings';
import SupervisedUserCircleSharpIcon from '@mui/icons-material/SupervisedUserCircleSharp';
import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import {
  Menu,
  MenuItem,
  MenuItemProps,
  Sidebar as ProSidebar,
  SubMenu,
} from 'react-pro-sidebar';
import { useNavigate } from 'react-router-dom';
import Image from 'src/components/common/Image';
import { Link } from 'src/components/common/Link';
import { Routes } from 'src/data/routes';
import { getLocalImage } from 'src/utils/imageUtils';
import {
  StorageKeyEnum,
  getLocalStorageItem,
  removeLocalStorageItem,
} from 'src/utils/storageUtils';
import { isUserLoggedIn } from 'src/utils/utils';

const SidebarHeader = () => {
  const isMobile = useMediaQuery(useTheme().breakpoints.down('md'));

  return (
    <Stack justifyContent="center" alignItems="center">
      <Link to="/">
        <Image
          src={
            isMobile
              ? getLocalImage('/icons/logo-mobile.svg')
              : getLocalImage('/icons/logo.svg')
          }
          alt="logo"
          width="200px"
        />
      </Link>
    </Stack>
  );
};

const SidebarFooter = () => {
  const currentYear = new Date().getFullYear();
  return (
    <Stack px={{ xs: 'initial', md: '20px' }}>
      <Typography
        variant="body2"
        fontWeight={400}
        textAlign="center"
        fontSize={{ xs: '10px', md: '16px' }}
      >
        Tüm Hakları Saklıdır.{' '}
        <Typography
          component="span"
          sx={{
            display: { xs: 'none', md: 'inline' },
            fontWeight: 600,
          }}
        >
          CampusClubs@{currentYear}
        </Typography>
        <Typography
          component="span"
          sx={{
            display: { xs: 'inline', md: 'none' },
            fontWeight: 600,
          }}
        >
          @{currentYear}
        </Typography>
      </Typography>
    </Stack>
  );
};

type SidebarMenuProps = {
  children: React.ReactNode | React.ReactNode[];
  title: string;
};

const SidebarMenu = ({ children, title }: SidebarMenuProps) => {
  return (
    <Stack>
      <Stack sx={{ px: { xs: '6px', md: '20px' }, marginBottom: '8px' }}>
        <Typography
          variant="body2"
          fontWeight={600}
          textAlign="center"
          sx={{ letterSpacing: '0.5px', color: '#dadbdc' }}
        >
          {title}
        </Typography>
      </Stack>
      <Menu
        menuItemStyles={{
          root: {
            fontSize: '13px',
            fontWeight: 400,
          },

          label: {
            color: '#b0bcd4',
          },
          icon: {
            color: '#b6b7b9',
          },
          SubMenuExpandIcon: {
            color: '#b6b7b9',
          },
          subMenuContent: () => ({
            backgroundColor: '#082440',
          }),
          button: {
            '&:hover': {
              backgroundColor: '#00458b',
              color: '#b6c8d9',
            },
          },
        }}
      >
        {children}
      </Menu>
    </Stack>
  );
};

type SidebarMenuItemProps = MenuItemProps & {
  children: React.ReactNode | React.ReactNode[];
  icon?: React.ReactNode;
};

const SidebarMenuItem = ({ ...rest }: SidebarMenuItemProps) => {
  return (
    <MenuItem
      component="div"
      style={{
        padding: '0px 24px',
      }}
      {...rest}
    />
  );
};

export const Sidebar = () => {
  const isMobile = useMediaQuery(useTheme().breakpoints.down('md'));

  const navigate = useNavigate();
  const user = getLocalStorageItem(StorageKeyEnum.USER_STORAGE)?.user;
  const userLoggedIn = !!user?.firstName;

  return (
    <Stack
      key="sidebar-stack"
      position="relative"
      pr={{ xs: '80px', md: '250px' }}
    >
      <ProSidebar
        key="sidebar"
        defaultCollapsed={isMobile}
        backgroundColor="#0b2948"
        rootStyles={{
          color: '#8ba1b7',
          position: 'fixed',
          minHeight: '100dvh',
          zIndex: 999,
          top: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <Stack
          minHeight="100vh"
          justifyContent="space-between"
          pb={{ xs: '10px', md: '20px' }}
        >
          <Stack>
            <SidebarHeader />
            <Stack gap="12px">
              <SidebarMenu title="Kulüp Yönetim">
                <Link to={Routes.HOME}>
                  <SidebarMenuItem icon={<HomeIcon />}>
                    Anasayfa
                  </SidebarMenuItem>
                </Link>
              </SidebarMenu>
              <SidebarMenu title="Genel">
                <SubMenu label="Kulüpler" icon={<PeopleIcon />}>
                  <Link to={Routes.CLUB}>
                    <SidebarMenuItem>Tüm Kulüpler</SidebarMenuItem>
                  </Link>
                </SubMenu>
                <SubMenu label="Etkinlikler" icon={<EventSeatIcon />}>
                  <Link to={Routes.EVENT}>
                    <SidebarMenuItem>Tüm Etkinlikler</SidebarMenuItem>
                  </Link>
                </SubMenu>
                <SubMenu label="Kullanicilar" icon={<ContactsSharpIcon />}>
                  <Link to={Routes.USER}>
                    <SidebarMenuItem>Tüm Kullanicilar</SidebarMenuItem>
                  </Link>
                </SubMenu>
                <SubMenu
                  label="Danismanlar"
                  icon={<SupervisedUserCircleSharpIcon />}
                >
                  <Link to={Routes.ADVISOR}>
                    <SidebarMenuItem>Tüm Danışmanlar</SidebarMenuItem>
                  </Link>
                </SubMenu>
              </SidebarMenu>
              {userLoggedIn && (
                <SidebarMenu title="Kullanıcı">
                  <Link to={`${Routes.USER}/${user.userId}`}>
                    <SidebarMenuItem icon={<PersonPinIcon />}>
                      Profilim
                    </SidebarMenuItem>
                  </Link>
                  <SidebarMenuItem
                    onClick={() => {
                      // remove all stroages and logout
                      const storageKeysToRemove = Object.values(StorageKeyEnum);
                      storageKeysToRemove.forEach((key) => {
                        removeLocalStorageItem(key);
                      });
                      navigate(0);
                    }}
                    icon={<LogoutIcon />}
                  >
                    Çıkış Yap
                  </SidebarMenuItem>
                </SidebarMenu>
              )}
            </Stack>
          </Stack>
          <SidebarFooter />
        </Stack>
      </ProSidebar>
    </Stack>
  );
};
