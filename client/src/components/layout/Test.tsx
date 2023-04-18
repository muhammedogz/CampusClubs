import { BarChart, CalendarMonth } from '@mui/icons-material';
import { Badge, Stack, Typography } from '@mui/material';
import {
  Menu,
  MenuItem,
  Sidebar as ProSidebar,
  SubMenu,
} from 'react-pro-sidebar';
import { Link } from 'react-router-dom';

const SidebarHeader = () => {
  return (
    <Stack justifyContent="center" alignItems="center">
      <Link to={'/'}>
        <img
          src="icons/logo.svg"
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
          style={{ letterSpacing: '0.5px' }}
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
        breakPoint="lg"
        backgroundColor="#0b2948"
        rootStyles={{
          color: '#8ba1b7',
        }}
      >
        <Stack>
          <SidebarHeader />
          <SidebarMenu title="General">
            <SubMenu label="Charts" icon={<BarChart />}>
              <MenuItem> Pie charts</MenuItem>
              <MenuItem> Line charts</MenuItem>
              <MenuItem> Bar charts</MenuItem>
            </SubMenu>
            <SubMenu label="Maps" icon={<CalendarMonth />}>
              <MenuItem> Google maps</MenuItem>
              <MenuItem> Open street maps</MenuItem>
            </SubMenu>
            <SubMenu label="Theme" icon={<CalendarMonth />}>
              <MenuItem> Dark</MenuItem>
              <MenuItem> Light</MenuItem>
            </SubMenu>
            <SubMenu label="Components" icon={<CalendarMonth />}>
              <MenuItem> Grid</MenuItem>
              <MenuItem> Layout</MenuItem>
              <SubMenu label="Forms">
                <MenuItem> Input</MenuItem>
                <MenuItem> Select</MenuItem>
                <SubMenu label="More">
                  <MenuItem> CheckBox</MenuItem>
                  <MenuItem> Radio</MenuItem>
                </SubMenu>
              </SubMenu>
            </SubMenu>
            <SubMenu label="E-commerce" icon={<CalendarMonth />}>
              <MenuItem> Product</MenuItem>
              <MenuItem> Orders</MenuItem>
              <MenuItem> Credit card</MenuItem>
            </SubMenu>
          </SidebarMenu>
          <SidebarMenu title="Applications">
            <MenuItem
              icon={<CalendarMonth />}
              suffix={<Badge variant="dot">New</Badge>}
            >
              Calendar
            </MenuItem>
            <MenuItem icon={<CalendarMonth />}>Documentation</MenuItem>
            <MenuItem disabled icon={<CalendarMonth />}>
              Examples
            </MenuItem>
          </SidebarMenu>
        </Stack>
        {/* <ProSidebarFooter collapsed={collapsed} /> */}
      </ProSidebar>
    </Stack>
  );
};
