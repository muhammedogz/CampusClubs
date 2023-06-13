import { Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import CampusClubCard from 'src/components/cards/CampusClubCard';
import { Layout } from 'src/components/layout/Layout';
import { Routes } from 'src/data/routes';
import { getAllClubsFetcher } from 'src/fetch/clubFetchers';
import { ClubType } from 'src/types/types';

const index = () => {
  const [clubs, setClubs] = useState<ClubType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getAllClubs = useCallback(async () => {
    try {
      const clubsRespone = await getAllClubsFetcher();
      if (clubsRespone.status) {
        setClubs(clubsRespone.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getAllClubs();
  }, [getAllClubs]);

  return (
    <Layout loading={loading}>
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
          {clubs.map((club) => (
            <CampusClubCard
              key={club.name + club.description}
              link={`${Routes.CLUB}/${club.clubId}`}
              image={club.image}
              title={club.name}
              description={club.description}
            />
          ))}
        </Stack>
      </Stack>
    </Layout>
  );
};

export default index;
