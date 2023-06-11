import { Avatar, AvatarProps } from '@mui/material';

type ImageProps = AvatarProps & {
  width?: string;
  height?: string;
  shadow?: boolean;
};

const Image = ({ width, height, sx, shadow, ...rest }: ImageProps) => {
  return (
    <Avatar
      variant="rounded"
      sx={{
        width: width ?? '100%',
        height: height ?? 'initial',

        ...(shadow && {
          boxShadow:
            'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
        }),

        ...sx,
      }}
      {...rest}
    />
  );
};

export default Image;
