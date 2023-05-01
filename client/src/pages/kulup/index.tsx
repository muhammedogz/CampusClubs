import { Stack, Typography } from '@mui/material';
import CampusClubCard from 'src/components/cards/CampusClubCard';
import { Layout } from 'src/components/layout/Layout';
import { kulupler } from 'src/data/kulupler';
import { Routes } from 'src/data/routes';

const index = () => {
  return (
    <Layout>
      <Stack gap="20px" pt="60px">
        <Stack>
          <Typography variant="h3" color="primary" textAlign="center">
            Tüm Kulüpler
          </Typography>
        </Stack>

        <Stack
          flexDirection="row"
          gap="30px"
          flexWrap="wrap"
          justifyContent="center"
        >
          {kulupler.map((kulup) => (
            <CampusClubCard
              key={kulup.name + kulup.description}
              link={`${Routes.KULUP}/${kulup.slug}`}
              image={kulup.image}
              title={kulup.name}
              description={kulup.description}
            />
          ))}
          {kulupler.map((kulup) => (
            <CampusClubCard
              key={kulup.name + kulup.description}
              link={`${Routes.KULUP}/${kulup.slug}`}
              image={kulup.image}
              title={kulup.name}
              description={kulup.description}
            />
          ))}
        </Stack>
      </Stack>
    </Layout>
  );
};

export default index;
