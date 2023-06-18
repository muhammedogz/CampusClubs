import { Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingUserInfo from 'src/Loading/LoadingUserInfo';
import CCButton from 'src/components/common/CCButton';
import Image from 'src/components/common/Image';
import Table, { clubColumns, eventColumns } from 'src/components/common/Table';
import ContentLayout from 'src/components/layout/ContentLayout';
import { Layout } from 'src/components/layout/Layout';
import UserUpdateModal from 'src/components/modals/UserUpdateModal';
import { emptyUserData } from 'src/data/emptyData';
import { Routes } from 'src/data/routes';
import { getUserFromIdFetcher } from 'src/fetch/userFetchers';
import { UserType } from 'src/types/types';
import { getRemoteImage } from 'src/utils/imageUtils';
import { StorageKeyEnum, getLocalStorageItem } from 'src/utils/storageUtils';
import { formatDate } from 'src/utils/utils';

type UserProps = {
  user: UserType;
  loading: boolean;
};

const UyeActionButton = ({ user }: UserProps) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const localUser = getLocalStorageItem(StorageKeyEnum.USER_STORAGE)?.user;
  const isMe = localUser?.userId === user.userId;
  const navigate = useNavigate();

  if (!isMe) return null;

  return (
    <Stack>
      <UserUpdateModal
        onClose={() => navigate(0)}
        open={openEditDialog}
        user={user}
      />
      <CCButton onClick={() => setOpenEditDialog(true)} variant="contained">
        Profili Düzenle
      </CCButton>
    </Stack>
  );
};

const UyeInfo = ({ user, loading }: UserProps) => {
  if (loading) {
    return <LoadingUserInfo />;
  }

  return (
    <Stack gap="20px">
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
      <UyeActionButton user={user} loading={loading} />
    </Stack>
  );
};

const UyeKulupler = ({ user, loading }: UserProps) => {
  return (
    <Stack id="middle-content-right">
      <Table
        loading={loading}
        title="Kulüp Üyelikleri"
        data={user.clubs.map((club) => ({
          ...club,
          href: `${Routes.CLUB}/${club.clubId}`,
        }))}
        columns={clubColumns}
      />
    </Stack>
  );
};

const UyeEtkinlikler = ({ user, loading }: UserProps) => {
  const localUser = getLocalStorageItem(StorageKeyEnum.USER_STORAGE)?.user;
  const isMe = localUser?.userId === user.userId;

  return (
    <Stack id="middle-content-right" gap="20px">
      {isMe && (
        <Stack px="100px">
          <CSVLink
            data={user.events.map((event) => ({
              etkinlik_adi: event.name,
              etkinlik_tarihi: formatDate(event.eventDate),
              etlinlik_yeri: event.location,
              etkinlik_duzenleyen_kulup: event.club.name,
              etkinlik_aciklama: event.description,
            }))}
            filename={'etlinlik-kayıtları.csv'}
            style={{
              textDecoration: 'none',
              textAlign: 'center',
              border: '1px solid #ccc',
            }}
            target="_blank"
          >
            <CCButton fullWidth variant="contained">
              Etlinlik Katılım Raporu İndir
            </CCButton>
          </CSVLink>
        </Stack>
      )}
      <Table
        loading={loading}
        title="Etkinlik Kayıtları"
        data={user.events.map((event) => ({
          ...event,
          eventDate: formatDate(event.eventDate),
          href: `${Routes.EVENT}/${event.eventId}`,
        }))}
        columns={eventColumns}
      />
    </Stack>
  );
};

const Kullanici = () => {
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
        upperLeft={<UyeInfo loading={loading} user={user} />}
        upperRight={<Stack> </Stack>}
        middleLeft={<UyeEtkinlikler loading={loading} user={user} />}
        middleRight={<UyeKulupler loading={loading} user={user} />}
      />
    </Layout>
  );
};

export default Kullanici;
