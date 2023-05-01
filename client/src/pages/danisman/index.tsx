import { Stack, Typography } from '@mui/material';
import CampusClubCard from 'src/components/cards/CampusClubCard';
import { Layout } from 'src/components/layout/Layout';
import { danismanlar } from 'src/data/danismanlar';
import { Routes } from 'src/data/routes';

const index = () => {
  return (
    <Layout>
      <Stack gap="20px" pt="60px">
        <Stack>
          <Typography variant="h3" color="primary" textAlign="center">
            Tüm Danışmanlar
          </Typography>
        </Stack>

        <Stack
          flexDirection="row"
          gap="30px"
          flexWrap="wrap"
          justifyContent="center"
        >
          {danismanlar.map((danisman) => (
            <CampusClubCard
              key={danisman.name}
              link={`${Routes.DANISMAN}/${danisman.slug}`}
              image={danisman.image}
              title={danisman.name}
              description={danisman.depertman}
            />
          ))}
        </Stack>
      </Stack>
    </Layout>
  );
};

export default index;
