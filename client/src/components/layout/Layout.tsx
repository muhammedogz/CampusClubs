import { Stack, StackProps } from '@mui/material';
import { Playground } from './Test';

type LayoutProps = StackProps & {
  children: React.ReactNode;
};

export const Layout = ({ children, ...rest }: LayoutProps) => {
  return (
    <Stack flexDirection="row" {...rest}>
      <Playground />
      <Stack component="main">{children}</Stack>
    </Stack>
  );
};
