import { Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import CampusClubCard from 'src/components/cards/CampusClubCard';
import { Layout } from 'src/components/layout/Layout';
import { Routes } from 'src/data/routes';
import { getAllUsersFetcher } from 'src/fetch/fetchers';
import { UyeBackendType } from 'src/types/types';
import { getRemoteImage } from 'src/utils/imageUtils';

const index = () => {
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<UyeBackendType[]>([]);

  const getAllUsers = useCallback(async () => {
    try {
      const allUsersResponse = await getAllUsersFetcher();

      if (allUsersResponse.status) {
        setAllUsers(allUsersResponse.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  return (
    <Layout loading={loading}>
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
          {allUsers.map((uye) => (
            <CampusClubCard
              key={uye.firstName + uye.lastName}
              link={`${Routes.KULLANICI}/${uye.userId}`}
              image={getRemoteImage(uye.image)}
              title={uye.firstName + ' ' + uye.lastName}
              description={'Bilgisayar Mühendisliği'}
            />
          ))}
        </Stack>
      </Stack>
    </Layout>
  );
};

export default index;
