import { Menu, MenuItem, Sidebar as ProSidebar, SubMenu } from 'react-pro-sidebar';

export const Sidebar = () => {
  return (
    <ProSidebar>
      <Menu>
        <SubMenu label="Charts">
          <MenuItem> Pie charts </MenuItem>
          <MenuItem> Line charts </MenuItem>
        </SubMenu>
        <MenuItem> Documentation </MenuItem>
        <MenuItem> Calendar </MenuItem>
      </Menu>
    </ProSidebar>
  );
};
