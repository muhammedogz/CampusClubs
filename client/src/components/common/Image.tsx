import { Avatar, AvatarProps } from '@mui/material';

type ImageProps = AvatarProps & {
  width?: string;
  height?: string;
};

const Image = ({ width, height, sx, ...rest }: ImageProps) => {
  return (
    <Avatar
      variant="rounded"
      sx={{
        width: width ?? '100%',
        height: height ?? 'initial',

        ...sx,
      }}
      {...rest}
    />
  );
};

export default Image;
