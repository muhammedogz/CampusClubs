import MenuIcon from '@mui/icons-material/Menu';
import {
  IconButton,
  Stack,
  StackProps,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useProSidebar } from 'react-pro-sidebar';
import { Sidebar } from '../Sidebar';

type LayoutProps = StackProps & {
  children: React.ReactNode;
};

export const Layout = ({ children, ...rest }: LayoutProps) => {
  const { toggleSidebar, toggled } = useProSidebar();
  const isMobile = useMediaQuery(useTheme().breakpoints.down('md'));

  return (
    <Stack position="relative" {...rest}>
      {isMobile && (
        <Stack
          p="20px"
          position="absolute"
          sx={{
            top: 0,
            left: 0,
          }}
        >
          <IconButton
            onClick={() => {
              toggleSidebar(!toggled);
            }}
          >
            <MenuIcon />
          </IconButton>
        </Stack>
      )}
      <Stack flexDirection="row" gap={{ xs: '0px', md: '10px' }}>
        <Sidebar />
        <Stack
          component="main"
          sx={{
            border: '2px solid red',
          }}
        >
          {children}
        </Stack>
      </Stack>
    </Stack>
  );
};
