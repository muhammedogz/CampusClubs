import { Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import Image from 'src/components/common/Image';
import { kulupler } from 'src/data/kulupler';
import { Layout } from '../../components/layout/Layout';

const Kulup = () => {
  const { id } = useParams();

  const tumKulupler = kulupler;
  const desiredKulup = tumKulupler.find((kulup) => kulup.username === id);

  if (!desiredKulup) return <Layout>404</Layout>;

  return (
    <Layout>
      <Stack>
        <Stack
          id="upper-background"
          sx={{
            zIndex: -1,
            position: 'absolute',
            left: 0,
            right: 0,
            width: '100%',
            backgroundImage: `url(${desiredKulup.logo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(20px)',

            height: '200px',
          }}
        />
        <Stack
          flex={1}
          id="top-content"
          px="20px"
          mt="150px"
          zIndex={2}
          width="100%"
        >
          <Stack flexDirection={{ xs: 'column', sm: 'row' }} gap="30px">
            <Image
              width="150px"
              height="150px"
              sx={{
                borderRadius: '20px',
                boxShadow:
                  'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
              }}
            />
            <Stack width="200px" pt={{ xs: '0px', sm: '55px' }}>
              <Typography variant="h4">{desiredKulup.name}</Typography>
              <Typography variant="h6">{desiredKulup.username}</Typography>
              <Typography variant="h6">{desiredKulup.description}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Layout>
  );
};

export default Kulup;
