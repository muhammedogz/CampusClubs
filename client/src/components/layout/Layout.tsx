import { Stack, StackProps } from '@mui/material';
import { Sidebar } from 'src/components/Sidebar';

type LayoutProps = StackProps & {
  children: React.ReactNode;
};

export const Layout = ({ children, ...rest }: LayoutProps) => {
  return (
    <Stack flexDirection="row" gap={{ xs: '0px', md: '10px' }} {...rest}>
      <Sidebar />
      <Stack
        component="main"
        mb={4}
        sx={{
          border: '2px solid red',
        }}
      >
        {children}
      </Stack>
    </Stack>
  );
};
