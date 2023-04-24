import { useParams } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Stack } from '@mui/material';

const Kulup = () => {
  const { id } = useParams();

  return (
    <Layout>
      <Stack>{id}</Stack>
    </Layout>
  );
};

export default Kulup;
