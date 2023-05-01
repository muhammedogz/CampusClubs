import { Stack } from '@mui/material';
import CircularLoading from 'src/Loading/CircularLoading';
import { getLocalImage } from 'src/utils/imageUtils';

type ContentLayoutProps = {
  upperLeft: React.ReactNode;
  upperRight: React.ReactNode;
  middleLeft: React.ReactNode;
  middleRight: React.ReactNode;
  upperBackgroundImage?: string;
  loadingUpperLeft?: boolean;
  loadingUpperRight?: boolean;
  loadingMiddleLeft?: boolean;
  loadingMiddleRight?: boolean;
};

const ContentLayout = ({
  middleLeft,
  middleRight,
  upperLeft,
  upperRight,
  upperBackgroundImage,
  loadingUpperLeft,
  loadingUpperRight,
  loadingMiddleLeft,
  loadingMiddleRight,
}: ContentLayoutProps) => {
  return (
    <Stack gap="20px">
      <Stack
        id="upper-background"
        sx={{
          zIndex: -1,
          position: 'absolute',
          left: 0,
          right: 0,
          backgroundImage: `url(${
            upperBackgroundImage ?? getLocalImage('/images/gtu-1.jpg')
          })`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',

          filter: 'brightness(0.5)',

          height: '200px',
        }}
      />
      <Stack gap="50px" mt="160px">
        <Stack
          id="upper-content"
          zIndex={2}
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          gap="20px"
          textAlign={{ xs: 'center', md: 'initial' }}
        >
          {loadingUpperLeft ? <CircularLoading /> : upperLeft}
          {loadingUpperRight ? <CircularLoading /> : upperRight}
        </Stack>
        <Stack gap="10px">
          <Stack
            id="middle-content"
            flexDirection={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'center', md: 'initial' }}
            justifyContent="space-evenly"
            gap="40px"
          >
            {loadingMiddleLeft ? <CircularLoading /> : middleLeft}
            {loadingMiddleRight ? <CircularLoading /> : middleRight}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ContentLayout;
