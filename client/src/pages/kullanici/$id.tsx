import { Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Image from 'src/components/common/Image';
import Table, { Column } from 'src/components/common/Table';
import ContentLayout from 'src/components/layout/ContentLayout';
import { Routes } from 'src/data/routes';
import { getUserInfoFromIdfetcher } from 'src/fetch/fetchers';
import { EtkinlikType, KulupType, UyeBackendType } from 'src/types/types';
import { getRemoteImage } from 'src/utils/imageUtils';
import { Layout } from '../../components/layout/Layout';

const etkinlikColumns: Column<EtkinlikType>[] = [
  { header: ' ', accessor: 'image', align: 'center' },
  { header: 'Etkinlik Adı', accessor: 'name' },
  { header: 'Tarih', accessor: 'date', align: 'center' },
  { header: 'Yer', accessor: 'location', align: 'center' },
];

const kulupColumns: Column<KulupType>[] = [
  { header: ' ', accessor: 'image', align: 'center' },
  { header: 'Kulüp Adı', accessor: 'name' },
  { header: 'Kulüp Açıklaması', accessor: 'description' },
];

type UserProps = {
  uye: UyeBackendType;
};

const UyeInfo = ({ uye }: UserProps) => {
  console.log('uye', uye);
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
        src={getRemoteImage(uye.image)}
        sx={{
          borderRadius: '20px',
          boxShadow:
            'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
        }}
      />
      <Stack maxWidth="400px" pt={{ xs: '0px', sm: '55px' }}>
        <Typography variant="h4" fontSize={30} color="main" fontWeight={600}>
          {uye.firstName} {uye.lastName}
        </Typography>
        <Typography variant="h6" color="secondary">
          {uye.email}
        </Typography>
        <Typography variant="h6">Bilgisayar Mühendisliği</Typography>
      </Stack>
    </Stack>
  );
};

type UyeKuluplerType = {
  kulupler: KulupType[];
};

const UyeKulupler = ({ kulupler }: UyeKuluplerType) => {
  return (
    <Stack id="middle-content-right">
      <Table
        title="Kulüp Üyelikleri"
        data={kulupler.map((kulup) => ({
          ...kulup,
          slug: `${Routes.KULUP}/${kulup.slug}`,
        }))}
        columns={kulupColumns}
      />
    </Stack>
  );
};

type UyeEtkinliklerType = {
  etkinlikler: EtkinlikType[];
};

const UyeEtkinlikler = ({ etkinlikler }: UyeEtkinliklerType) => {
  return (
    <Stack id="middle-content-right">
      <Table
        title="Etkinlik Kayıtları"
        data={etkinlikler.map((event) => ({
          ...event,
          slug: `${Routes.ETKINLIK}/${event.slug}`,
        }))}
        columns={etkinlikColumns}
      />
    </Stack>
  );
};

const Kullanici = () => {
  const [user, setUser] = useState<UyeBackendType | null>(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const getUserInfo = useCallback(async () => {
    try {
      if (!id) return;
      setLoading(true);
      const userResponse = await getUserInfoFromIdfetcher(id);
      if (userResponse.status) {
        setUser(userResponse.data);
        setLoading(false);
      }
      console.log(userResponse);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  if (loading || !user) {
    <Layout loading={loading}>Yükleniyor...</Layout>;
  } else {
    return (
      <Layout>
        <ContentLayout
          upperLeft={<UyeInfo uye={user} />}
          upperRight={<Stack> </Stack>}
          middleLeft={<UyeEtkinlikler etkinlikler={[]} />}
          middleRight={<UyeKulupler kulupler={user.clubsRegistered} />}
        />
      </Layout>
    );
  }
};

export default Kullanici;
