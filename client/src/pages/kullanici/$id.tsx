import { Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import Image from 'src/components/common/Image';
import Table, { Column } from 'src/components/common/Table';
import ContentLayout from 'src/components/layout/ContentLayout';
import { events } from 'src/data/etkinlikler';
import { kulupler } from 'src/data/kulupler';
import { Routes } from 'src/data/routes';
import { uyeler } from 'src/data/uyeler';
import { EtkinlikType, KulupType, UyeType } from 'src/types/types';
import { Layout } from '../../components/layout/Layout';
import { useState } from 'react';

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

type CommonProps = {
  uye: UyeType;
};

const UyeInfo = ({ uye }: CommonProps) => {
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
        src={uye.image}
        sx={{
          borderRadius: '20px',
          boxShadow:
            'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
        }}
      />
      <Stack maxWidth="400px" pt={{ xs: '0px', sm: '55px' }}>
        <Typography variant="h4" fontSize={30} color="main" fontWeight={600}>
          {uye.name}
        </Typography>
        <Typography variant="h6" color="secondary">
          @{uye.slug}
        </Typography>
        <Typography variant="h6">{uye.bolum}</Typography>
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
        title="Uyesi Olunan Kulupler"
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
        title="Katılınan Etkinlikler"
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
  const [loading, setLoading] = useState(false);
  const { id } = useParams();


  const tumUyeler = uyeler;
  const bulunanKullanici = tumUyeler.find((uye) => uye.slug === id);

  if (!bulunanKullanici) return <Layout>404</Layout>;

  return (
    <Layout>
      <ContentLayout
        upperLeft={<UyeInfo uye={bulunanKullanici} />}
        upperRight={<Stack> </Stack>}
        middleLeft={<UyeEtkinlikler etkinlikler={events} />}
        middleRight={<UyeKulupler kulupler={kulupler} />}
      />
    </Layout>
  );
};

export default Kullanici;
