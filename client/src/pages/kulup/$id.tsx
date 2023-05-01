import { Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Image from 'src/components/common/Image';
import { Link } from 'src/components/common/Link';
import Table, { Column } from 'src/components/common/Table';
import ContentLayout from 'src/components/layout/ContentLayout';
import { duyurular } from 'src/data/duyurular';
import { events } from 'src/data/etkinlikler';
import { kulupler } from 'src/data/kulupler';
import { Routes } from 'src/data/routes';
import { uyeler } from 'src/data/uyeler';
import Slides from 'src/slides/Slides';
import { DuyuruType, EtkinlikType, KulupType, UyeType } from 'src/types/types';
import { Layout } from '../../components/layout/Layout';

const etkinlikColumns: Column<EtkinlikType>[] = [
  { header: ' ', accessor: 'image', align: 'center' },
  { header: 'Etkinlik Adı', accessor: 'name' },
  { header: 'Tarih', accessor: 'date', align: 'center' },
  { header: 'Yer', accessor: 'location', align: 'center' },
];

const uyeColumns: Column<UyeType>[] = [
  { header: ' ', accessor: 'image', align: 'center' },
  { header: 'Üye Adı', accessor: 'name' },
  { header: 'Bölüm', accessor: 'bolum' },
];

const duyuruColumns: Column<DuyuruType>[] = [
  { header: 'Duyuru Başlığı', accessor: 'title' },
  { header: 'Duyuru Açıklaması', accessor: 'description' },
  { header: 'Duyuru Tarihi', accessor: 'date' },
];

type CommonProps = {
  kulup: KulupType;
};

const KulupInfo = ({ kulup }: CommonProps) => {
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
        src={kulup.image}
        sx={{
          borderRadius: '20px',
          boxShadow:
            'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
        }}
      />
      <Stack maxWidth="400px" pt={{ xs: '0px', sm: '55px' }}>
        <Typography variant="h4" fontSize={30} color="main" fontWeight={600}>
          {kulup.name}
        </Typography>
        <Typography variant="h6" color="secondary">
          @{kulup.name}
        </Typography>
        <Typography variant="h6">{kulup.description}</Typography>
      </Stack>
    </Stack>
  );
};

const KulupOtherInfo = ({ kulup }: CommonProps) => {
  return (
    <Stack
      id="upper-content-right"
      justifyContent="center"
      gap="6px"
      sx={{
        backgroundColor: '#00AF8E',
        borderRadius: '20px',
        p: '20px',
        color: '#ffffff',
      }}
    >
      <Link to={`${Routes.DANISMAN}/yusufsinanakgul`}>
        <Stack
          flexDirection="row"
          gap="10px"
          alignItems="center"
          justifyContent="center"
          sx={{
            textAlign: 'center',
            backgroundColor: '#6F7788',
            p: '4px',
            borderRadius: '20px',
          }}
        >
          <Typography fontWeight={600}>Danışman: Yusuf Sinan Akgül</Typography>
          <Image
            variant="circular"
            src="https://abl.gtu.edu.tr/resimler/104/t_10416.jpg?"
            width="30px"
            height="30px"
          />
        </Stack>
      </Link>
      <Typography fontWeight={600}>
        {kulup.faaliyetAlanlari?.join(', ')}
      </Typography>
      <Typography fontWeight={600}>Üye sayısı: {kulup.uyeCount}</Typography>
    </Stack>
  );
};

type EtkinlikDuyuruType = {
  etkinlikler: EtkinlikType[];
  duyurular: DuyuruType[];
};

const KulupEtkinlikDuyuru = ({
  duyurular,
  etkinlikler,
}: EtkinlikDuyuruType) => {
  const [index, setIndex] = useState(0);

  return (
    <Stack id="middle-content-left" gap={2}>
      <Stack alignItems="center" alignSelf="flex-start">
        <Tabs value={index} onChange={(e, value) => setIndex(value)}>
          <Tab label="Etkinlikler" value={0} />
          <Tab label="Duyurular" value={1} />
        </Tabs>
      </Stack>
      <Slides index={index}>
        <Table
          fullWidth
          title="Etkinlikler"
          data={etkinlikler.map((event) => ({
            ...event,
            slug: `${Routes.ETKINLIK}/${event.slug}`,
          }))}
          columns={etkinlikColumns}
        />
        <Table
          fullWidth
          title="Duyurular"
          data={duyurular}
          columns={duyuruColumns}
        />
      </Slides>
    </Stack>
  );
};

type KulupUyelerType = {
  uyeler: any[];
};

const KulupUyeler = ({ uyeler }: KulupUyelerType) => {
  return (
    <Stack id="middle-content-right">
      <Table
        title="Üyeler"
        columns={uyeColumns}
        data={uyeler.map((uye) => ({
          ...uye,
          slug: `${Routes.KULLANICI}/${uye.slug}`,
        }))}
      />
    </Stack>
  );
};

const Kulup = () => {
  const { id } = useParams();

  const tumKulupler = kulupler;
  const desiredKulup = tumKulupler.find((kulup) => kulup.slug === id);

  if (!desiredKulup) return <Layout>404</Layout>;

  return (
    <Layout>
      <ContentLayout
        upperBackgroundImage={desiredKulup.image}
        upperLeft={<KulupInfo kulup={desiredKulup} />}
        upperRight={<KulupOtherInfo kulup={desiredKulup} />}
        middleLeft={
          <KulupEtkinlikDuyuru etkinlikler={events} duyurular={duyurular} />
        }
        middleRight={<KulupUyeler uyeler={uyeler} />}
      />
    </Layout>
  );
};

export default Kulup;
