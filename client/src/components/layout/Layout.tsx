import { Stack, StackProps } from '@mui/material';
import ResponsiveAppBar from 'src/components/layout/AppBar';
import { Sidebar } from 'src/components/layout/Sidebar';

type LayoutProps = StackProps & {
  children: React.ReactNode;
};

export const Layout = ({ children, ...rest }: LayoutProps) => {
  return (
    <Stack>
      <ResponsiveAppBar />
      <Stack flexDirection="row" {...rest}>
        <Sidebar />
        <Stack
          width={{ xs: 'calc(100vw - 90px)', md: 'calc(100vw - 260px)' }}
          component="main"
          mb={2}
        >
          {children}
        </Stack>
      </Stack>
    </Stack>
  );
};
