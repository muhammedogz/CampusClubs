import { Stack, Typography } from '@mui/material';
import { useCallback, useEffect } from 'react';
import CampusClubCard from 'src/components/cards/CampusClubCard';
import { Layout } from 'src/components/layout/Layout';
import { kulupler } from 'src/data/kulupler';
import { Routes } from 'src/data/routes';
import { getAllClubsFetcher } from 'src/fetch/fetchers';

const index = () => {
  const getAllClubs = useCallback(async () => {
    try {
      const allClubs = await getAllClubsFetcher();
      console.log('allClubs', allClubs);
    } catch (error) {
      console.log('error', error);
    }
  }, []);

  useEffect(() => {
    getAllClubs();
  }, [])

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
