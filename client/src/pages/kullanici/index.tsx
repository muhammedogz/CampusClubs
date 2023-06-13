import { Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import CampusClubCard from 'src/components/cards/CampusClubCard';
import { Layout } from 'src/components/layout/Layout';
import { Routes } from 'src/data/routes';
import { getAllStudentsFetcher } from 'src/fetch/userFetchers';
import { UserType } from 'src/types/types';
import { getRemoteImage } from 'src/utils/imageUtils';

const index = () => {
  const [loading, setLoading] = useState(false);
  const [allStudents, setAllStudents] = useState<UserType[]>([]);

  const getAllStudents = useCallback(async () => {
    try {
      const allUsersResponse = await getAllStudentsFetcher();

      if (allUsersResponse.status) {
        setAllStudents(allUsersResponse.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getAllStudents();
  }, [getAllStudents]);

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
          {allStudents.map((student) => (
            <CampusClubCard
              key={student.firstName + student.lastName}
              link={`${Routes.USER}/${student.userId}`}
              image={getRemoteImage(student.image)}
              title={student.firstName + ' ' + student.lastName}
              description={student.department.name}
            />
          ))}
        </Stack>
      </Stack>
    </Layout>
  );
};

export default index;
