import { CircularProgress, Stack } from '@mui/material';

type CircularLoadingProps = {
  size?: number;
};

const CircularLoading = ({ size }: CircularLoadingProps) => {
  return (
    <Stack p="60px">
      <CircularProgress color="secondary" size={size ? size : 40} />
    </Stack>
  );
};

export default CircularLoading;
