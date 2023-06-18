import { Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingUserInfo from 'src/Loading/LoadingUserInfo';
import Image from 'src/components/common/Image';
import Table, { clubColumns } from 'src/components/common/Table';
import ContentLayout from 'src/components/layout/ContentLayout';
import { emptyUserData } from 'src/data/emptyData';
import { Routes } from 'src/data/routes';
import { getUserFromIdFetcher } from 'src/fetch/userFetchers';
import { UserType } from 'src/types/types';
import { getRemoteImage } from 'src/utils/imageUtils';
import { Layout } from '../../components/layout/Layout';

type CommonProps = {
  user: UserType;
  loading: boolean;
};

const DanismanInfo = ({ user, loading }: CommonProps) => {
  if (loading) {
    return <LoadingUserInfo />;
  }

  return (
    <Stack
      id="upper-content-left"
      justifyContent="center"
      alignItems="center"
      flexDirection={{ xs: 'column', sm: 'row' }}
      gap="30px"
    >
      <Image
        width="150px"
        height="150px"
        src={getRemoteImage(user.image)}
        sx={{
          borderRadius: '20px',
          boxShadow:
            'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
        }}
      />
      <Stack maxWidth="400px" pt={{ xs: '0px', sm: '55px' }}>
        <Typography variant="h4" fontSize={30} color="main" fontWeight={600}>
          {user.firstName} {user.lastName}
        </Typography>
        <Typography variant="h6" color="secondary">
          {user.email}
        </Typography>
        <Typography variant="h6">{user.department.name}</Typography>
      </Stack>
    </Stack>
  );
};

const DanismanKulupler = ({ user, loading }: CommonProps) => {
  return (
    <Stack id="middle-content-right">
      <Table
        loading={loading}
        fullWidth
        title="Danışmanı Olunan Kulupler"
        data={user.clubs.map((club) => ({
          ...club,
          image: getRemoteImage(club.image),
          href: `${Routes.CLUB}/${club.clubId}`,
        }))}
        columns={clubColumns}
      />
    </Stack>
  );
};

const Danisman = () => {
  const [user, setUser] = useState<UserType>(emptyUserData);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const getUserInfo = useCallback(async () => {
    try {
      if (!id) return;
      setLoading(true);
      const userResponse = await getUserFromIdFetcher(id);
      if (userResponse.status) {
        setUser(userResponse.data);
        setLoading(false);
      }
      userResponse;
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  return (
    <Layout>
      <ContentLayout
        upperLeft={<DanismanInfo user={user} loading={loading} />}
        upperRight={<Stack> </Stack>}
        middleLeft={<DanismanKulupler user={user} loading={loading} />}
        middleRight={<Stack></Stack>}
      />
    </Layout>
  );
};

export default Danisman;
