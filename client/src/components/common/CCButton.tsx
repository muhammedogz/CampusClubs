import { Button, ButtonProps, CircularProgress } from '@mui/material';

type CCButtonProps = ButtonProps & {
  loading?: boolean;
};

const CCButton = ({ loading, children, ...rest }: CCButtonProps) => {
  return (
    <Button disabled={loading} {...rest}>
      {loading ? (
        <CircularProgress
          size={25}
          sx={{
            color: '#78ee11',
          }}
        />
      ) : (
        children
      )}
    </Button>
  );
};

export default CCButton;
