import { Stack, StackProps } from '@mui/material';
import { Sidebar } from './Test';

type LayoutProps = StackProps & {
  children: React.ReactNode;
};

export const Layout = ({ children, ...rest }: LayoutProps) => {
  return (
    <Stack flexDirection="row" {...rest}>
      <Sidebar />
      <Stack component="main">{children}</Stack>
    </Stack>
  );
};
