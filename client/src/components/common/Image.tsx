import { Avatar, AvatarProps } from '@mui/material';

type ImageProps = AvatarProps & {
  width?: string;
  height?: string;
};

const Image = ({ src, width, height, ...rest }: ImageProps) => {
  const publicPath = import.meta.env.VITE_PUBLIC_PATH;

  console.log('publicPath', `${publicPath}${src}`);
  return (
    <Avatar
      variant="rounded"
      src={`${publicPath}${src}`}
      sx={{
        width: width ?? '100%',
        height: height ?? 'initial',
      }}
      {...rest}
    />
  );
};

export default Image;
