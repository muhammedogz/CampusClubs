import { Stack } from '@mui/material';

type ContentLayoutProps = {
  upperLeft: React.ReactNode;
  upperRight: React.ReactNode;
  middleLeft: React.ReactNode;
  middleRight: React.ReactNode;
  upperBackgroundImage?: string;
};

const ContentLayout = ({
  middleLeft,
  middleRight,
  upperLeft,
  upperRight,
  upperBackgroundImage,
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
          backgroundImage: `url(${upperBackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(20px)',

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
          {upperLeft}
          {upperRight}
        </Stack>
        <Stack gap="10px">
          <Stack
            id="middle-content"
            flexDirection={{ xs: 'column', md: 'row' }}
            justifyContent="space-evenly"
            gap="40px"
          >
            {middleLeft}
            {middleRight}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ContentLayout;
