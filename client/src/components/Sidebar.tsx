import {
  PersonPinCircleTwoTone,
  SettingsApplications,
} from '@mui/icons-material';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import { Stack, Typography } from '@mui/material';
import {
  Menu,
  MenuItem,
  Sidebar as ProSidebar,
  SubMenu,
} from 'react-pro-sidebar';
import { Routes } from '../data/routes';
import { Link } from './common/Link';

const SidebarHeader = () => {
  return (
    <Stack justifyContent="center" alignItems="center">
      <Link to="/">
        <img
          src="/icons/logo.svg"
          alt="logo"
          style={{
            width: '200px',
          }}
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
      <Stack sx={{ padding: '0 24px', marginBottom: '8px' }}>
        <Typography
          variant="body2"
          fontWeight={600}
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

export const Sidebar = () => {
  return (
    <Stack>
      <ProSidebar
        customBreakPoint="900px"
        backgroundColor="#0b2948"
        rootStyles={{
          color: '#8ba1b7',
          minHeight: '100vh',
        }}
      >
        <Stack>
          <SidebarHeader />
          <Stack gap="12px">
            <SidebarMenu title="Kulüp Yönetim">
              <Link to={Routes.HOME}>
                <MenuItem icon={<HomeIcon />}>Anasayfa</MenuItem>
              </Link>
            </SidebarMenu>
            <SidebarMenu title="Genel">
              <SubMenu label="Kulüpler" icon={<PeopleIcon />}>
                <MenuItem>Tüm Kulüpler</MenuItem>
                <MenuItem>Kulüp Yöneticileri</MenuItem>
              </SubMenu>
              <SubMenu label="Etkinlikler" icon={<EventSeatIcon />}>
                <MenuItem>Tüm Etkinlikler</MenuItem>
              </SubMenu>
            </SidebarMenu>
            <SidebarMenu title="Ben">
              <MenuItem
                icon={<PersonPinCircleTwoTone />}
                // suffix={<Badge variant="dot">New</Badge>}
              >
                Profilim
              </MenuItem>
              <MenuItem icon={<SettingsApplications />}>Ayarlar</MenuItem>
              <MenuItem icon={<LogoutIcon />}>Çıkış Yap</MenuItem>
            </SidebarMenu>
          </Stack>
        </Stack>
        {/* <ProSidebarFooter collapsed={collapsed} /> */}
      </ProSidebar>
    </Stack>
  );
};
