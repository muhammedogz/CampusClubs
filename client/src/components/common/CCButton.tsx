import { Button, ButtonProps, CircularProgress } from '@mui/material';

type CCButtonProps = ButtonProps & {
  loading?: boolean;
};

const CCButton = ({ loading, children, ...rest }: CCButtonProps) => {
  return (
    <Button disabled={loading} {...rest}>
      {loading ? <CircularProgress size={20} /> : children}
    </Button>
  );
};

export default CCButton;
