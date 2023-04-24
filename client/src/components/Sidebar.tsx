import EventSeatIcon from '@mui/icons-material/EventSeat';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import SettingsIcon from '@mui/icons-material/Settings';
import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import {
  Menu,
  MenuItem,
  Sidebar as ProSidebar,
  SubMenu,
} from 'react-pro-sidebar';
import Image from 'src/components/common/Image';
import { Link } from 'src/components/common/Link';
import { Routes } from 'src/data/routes';

const SidebarHeader = () => {
  const isMobile = useMediaQuery(useTheme().breakpoints.down('md'));

  return (
    <Stack justifyContent="center" alignItems="center">
      <Link to="/">
        <Image
          src={isMobile ? '/icons/logo-mobile.svg' : '/icons/logo.svg'}
          alt="logo"
          width="200px"
        />
      </Link>
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

type SidebarMenuItemProps = {
  children: React.ReactNode | React.ReactNode[];
  icon?: React.ReactNode;
};

const SidebarMenuItem = ({ ...rest }: SidebarMenuItemProps) => {
  return <MenuItem component="div" {...rest} />;
};

export const Sidebar = () => {
  const isMobile = useMediaQuery(useTheme().breakpoints.down('md'));

  return (
    <Stack key="sidebar-stack">
      <ProSidebar
        key="sidebar"
        defaultCollapsed={isMobile}
        backgroundColor="#0b2948"
        rootStyles={{
          color: '#8ba1b7',
          minHeight: '100dvh',
        }}
      >
        <Stack>
          <SidebarHeader />
          <Stack gap="12px">
            <SidebarMenu title="Kulüp Yönetim">
              <Link to={Routes.HOME}>
                <SidebarMenuItem icon={<HomeIcon />}>Anasayfa</SidebarMenuItem>
              </Link>
            </SidebarMenu>
            <SidebarMenu title="Genel">
              <SubMenu label="Kulüpler" icon={<PeopleIcon />}>
                <Link to={Routes.KULUP}>
                  <SidebarMenuItem>Tüm Kulüpler</SidebarMenuItem>
                </Link>
                <SidebarMenuItem>Kulüp Yöneticileri</SidebarMenuItem>
              </SubMenu>
              <SubMenu label="Etkinlikler" icon={<EventSeatIcon />}>
                <SidebarMenuItem>Tüm Etkinlikler</SidebarMenuItem>
              </SubMenu>
            </SidebarMenu>
            <SidebarMenu title="Kullanıcı">
              <SidebarMenuItem
                icon={<PersonPinIcon />}
                // suffix={<Badge variant="dot">New</Badge>}
              >
                Profilim
              </SidebarMenuItem>
              <SidebarMenuItem icon={<SettingsIcon />}>Ayarlar</SidebarMenuItem>
              <SidebarMenuItem icon={<LogoutIcon />}>Çıkış Yap</SidebarMenuItem>
            </SidebarMenu>
          </Stack>
        </Stack>
        {/* <ProSidebarFooter collapsed={collapsed} /> */}
      </ProSidebar>
    </Stack>
  );
};
