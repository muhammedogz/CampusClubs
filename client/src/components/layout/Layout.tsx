import { Stack, StackProps } from '@mui/material';
import { Sidebar } from 'src/components/layout/Sidebar';

type LayoutProps = StackProps & {
  children: React.ReactNode;
};

export const Layout = ({ children, ...rest }: LayoutProps) => {
  return (
    <Stack flexDirection="row" gap={{ xs: '0px', md: '10px' }} {...rest}>
      <Sidebar />
      <Stack
        component="main"
        mb={2}
        sx={{
          border: '2px solid red',
        }}
      >
        {children}
      </Stack>
    </Stack>
  );
};
