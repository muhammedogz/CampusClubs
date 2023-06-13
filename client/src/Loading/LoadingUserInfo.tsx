import { Skeleton, Stack } from "@mui/material";

const LoadingUserInfo = () => {
  return (
    <Stack
      id="upper-content-left"
      justifyContent="center"
      alignItems="center"
      flexDirection={{ xs: 'column', sm: 'row' }}
      gap="30px"
    >
      <Skeleton
        variant="rectangular"
        width="150px"
        height="150px"
        sx={{
          borderRadius: '20px',
          boxShadow:
            'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
        }}
      />
      <Stack maxWidth="400px" pt={{ xs: '0px', sm: '55px' }}>
        <Skeleton variant="text" width="200px" height={30} />
        <Skeleton variant="text" width="200px" />
        <Skeleton variant="text" width="200px" />
      </Stack>
    </Stack>
  );
};

export default LoadingUserInfo;
