import { BarChart, CalendarMonth } from '@mui/icons-material';
import { Badge, Typography } from '@mui/material';
import { Menu, MenuItem, Sidebar, SubMenu } from 'react-pro-sidebar';

export const Playground = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
      }}
    >
      <Sidebar
        breakPoint="lg"
        backgroundColor="#0b2948"
        rootStyles={{
          color: '#8ba1b7',
        }}
      >
        {/* <SidebarHeader style={{ marginBottom: '24px', marginTop: '16px' }} /> */}
        <div style={{ flex: 1, marginBottom: '32px' }}>
          <div style={{ padding: '0 24px', marginBottom: '8px' }}>
            <Typography
              variant="body2"
              fontWeight={600}
              style={{ letterSpacing: '0.5px' }}
            >
              General
            </Typography>
          </div>
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
            <SubMenu
              label="Charts"
              icon={<BarChart />}
              suffix={<Badge variant="dot">6</Badge>}
            >
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
          </Menu>

          <div
            style={{
              padding: '0 24px',
              marginBottom: '8px',
              marginTop: '32px',
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              Extra
            </Typography>
          </div>

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
          </Menu>
        </div>
        {/* <SidebarFooter collapsed={collapsed} /> */}
      </Sidebar>
    </div>
  );
};
