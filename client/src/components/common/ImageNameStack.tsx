import { Stack, Typography } from '@mui/material';
import Image from 'src/components/common/Image';
import { getRemoteImage } from 'src/utils/imageUtils';

type ImageNameItemType = {
  id: number;
  name: string;
  image: string;
};
type ImageNameStackProps = {
  data: ImageNameItemType;
};

const ImageNameStack = ({ data }: ImageNameStackProps) => {
  return (
    <Stack
      flexDirection="row"
      component="li"
      alignItems="flex-start"
      justifyContent="flex-start"
      gap="20px"
      sx={{
        p: '10px',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#F5F6F8',
        },
      }}
    >
      <Image
        src={getRemoteImage(data.image)}
        alt={data.name}
        width="30px"
        height="30px"
        variant="circular"
      />
      <Typography
        fontSize={{ xs: '12px', md: '15px' }}
        lineHeight="30px"
        color="#60647E"
      >
        {data.name}
      </Typography>
    </Stack>
  );
};

export default ImageNameStack;
