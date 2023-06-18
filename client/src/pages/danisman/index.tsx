import { Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import CampusClubCard, {
  CampusClubCardLoading,
} from 'src/components/cards/CampusClubCard';
import { Layout } from 'src/components/layout/Layout';
import { Routes } from 'src/data/routes';
import { getAllTeachersFetcher } from 'src/fetch/userFetchers';
import { UserType } from 'src/types/types';
import { getRemoteImage } from 'src/utils/imageUtils';

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [allTeachers, setAllTeachers] = useState<UserType[]>([]);

  const getAllTeachers = useCallback(async () => {
    try {
      const allUsersResponse = await getAllTeachersFetcher();

      if (allUsersResponse.status) {
        setAllTeachers(allUsersResponse.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getAllTeachers();
  }, [getAllTeachers]);

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
          {loading ? (
            <>
              <CampusClubCardLoading />
              <CampusClubCardLoading />
              <CampusClubCardLoading />
              <CampusClubCardLoading />
            </>
          ) : (
            <>
              {allTeachers.map((teacher) => (
                <CampusClubCard
                  key={teacher.firstName + teacher.lastName}
                  link={`${Routes.ADVISOR}/${teacher.userId}`}
                  image={getRemoteImage(teacher.image)}
                  title={teacher.firstName + ' ' + teacher.lastName}
                  description={teacher.department.name}
                />
              ))}
            </>
          )}
        </Stack>
      </Stack>
    </Layout>
  );
};

export default Index;
