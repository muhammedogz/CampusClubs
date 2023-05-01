import { Stack, Typography } from '@mui/material';
import CampusClubCard from 'src/components/cards/CampusClubCard';
import { Layout } from 'src/components/layout/Layout';
import { Routes } from 'src/data/routes';
import { uyeler } from 'src/data/uyeler';

const index = () => {
  return (
    <Layout>
      <Stack gap="20px" pt="60px">
        <Stack>
          <Typography variant="h3" color="primary" textAlign="center">
            Tüm Kullanıcılar
          </Typography>
        </Stack>

        <Stack
          flexDirection="row"
          gap="30px"
          flexWrap="wrap"
          justifyContent="center"
        >
          {uyeler.map((uye) => (
            <CampusClubCard
              key={uye.name + uye.description}
              link={`${Routes.KULLANICI}/${uye.slug}`}
              image={uye.image}
              title={uye.name}
              description={uye.bolum}
            />
          ))}
        </Stack>
      </Stack>
    </Layout>
  );
};

export default index;
