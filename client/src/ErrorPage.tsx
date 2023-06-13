import { Stack } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { Layout } from 'src/components/layout/Layout';

const ErrorPage = () => {
  const location = useLocation();
  console.error('location', location);
  return (
    <Layout>
      <Stack
        minWidth={'50vw'}
        minHeight={'100vh'}
        justifyContent={'center'}
        alignItems={'center'}
        fontSize={30}
        textAlign={'center'}
      >
        <Stack>
          Bir hata ile karşılaştık. Bunun sistemle ilgili bir hata olduğunu
          düşünüyorsanız lütfen bizimle iletişime geçin.
        </Stack>
        <Stack>m.oguz2018@gtu.edu.tr</Stack>
        <Stack>s.golbol2018@gtu.edu.tr</Stack>
        <Stack>Sayfa bulunamadı: {location.pathname}</Stack>
      </Stack>
    </Layout>
  );
};

export default ErrorPage;
