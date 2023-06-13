import { Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import Image from 'src/components/common/Image';
import { Link } from 'src/components/common/Link';
import Table, { Column } from 'src/components/common/Table';
import ContentLayout from 'src/components/layout/ContentLayout';
import { Routes } from 'src/data/routes';
import { EtkinlikType, UyeType } from 'src/types/types';
import { Layout } from '../../components/layout/Layout';

const uyeColumns: Column<UyeType>[] = [
  { header: ' ', accessor: 'image', align: 'center' },
  { header: 'Üye Adı', accessor: 'name' },
  { header: 'Bölüm', accessor: 'bolum' },
];

type CommonProps = {
  etkinlik: EtkinlikType;
};

const EtkinlikInfo = ({ etkinlik }: CommonProps) => {
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
        src={etkinlik.image}
        sx={{
          borderRadius: '20px',
          boxShadow:
            'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
        }}
      />
      <Stack maxWidth="400px" pt={{ xs: '0px', sm: '55px' }}>
        <Typography variant="h4" fontSize={30} color="main" fontWeight={600}>
          {etkinlik.name}
        </Typography>
        <Typography variant="h6" color="secondary">
          @{etkinlik.name}
        </Typography>
      </Stack>
    </Stack>
  );
};

const EtkinlikDuzenleyenKulup = ({ etkinlik }: CommonProps) => {
  return (
    <Link to={`${Routes.KULUP}/${etkinlik.kulup.slug}`}>
      <Stack
        id="upper-content-right"
        alignItems="center"
        justifyContent="center"
        gap="6px"
        sx={{
          backgroundColor: '#00AF8E',
          borderRadius: '20px',
          p: '20px',
          color: '#ffffff',
        }}
      >
        <Typography fontWeight={600} textAlign="center">
          Düzenleyen Kulüp
        </Typography>
        <Image
          variant="circular"
          src={etkinlik.kulup.image}
          width="80px"
          height="80px"
        />

        <Typography fontWeight={600} textAlign="center">
          {etkinlik.kulup.name}
        </Typography>
      </Stack>
    </Link>
  );
};

const EtkinlikotherInfo = ({ etkinlik }: CommonProps) => {
  return (
    <Stack
      id="middle-content-left"
      alignItems={{ xs: 'center', md: 'flex-start' }}
      textAlign={{ xs: 'center', md: 'left' }}
      gap={2}
      sx={{
        maxWidth: '400px',
      }}
    >
      <Stack>
        <Typography variant="h5">Açıklama</Typography>
        <Typography variant="body2">{etkinlik.description}</Typography>
      </Stack>
      <Stack>
        <Typography variant="h5">Tarih</Typography>
        <Typography variant="body2">{etkinlik.date}</Typography>
      </Stack>
      <Stack>
        <Typography variant="h5">Yer</Typography>
        <Typography variant="body2">{etkinlik.location}</Typography>
      </Stack>
    </Stack>
  );
};

type EtkinlikKatilimcilarProps = {
  uyeler: UyeType[];
};

const EtkinlikKatilimcilar = ({ uyeler }: EtkinlikKatilimcilarProps) => {
  return (
    <Stack id="middle-content-right">
      <Table
        title="Katılımcılar"
        columns={uyeColumns}
        data={uyeler.map((uye) => ({
          ...uye,
          slug: `${Routes.KULLANICI}/${uye.slug}`,
        }))}
      />
    </Stack>
  );
};

const Etkinlik = () => {
  const { id } = useParams();
  const tumEtkinlikler = events;
  const bulunanEtkinlik = tumEtkinlikler.find(
    (etkinlik) => etkinlik.slug === id
  );

  if (!bulunanEtkinlik) return <Layout>404</Layout>;

  return (
    <Layout>
      <ContentLayout
        upperBackgroundImage={bulunanEtkinlik.image}
        upperLeft={<EtkinlikInfo etkinlik={bulunanEtkinlik} />}
        upperRight={<EtkinlikDuzenleyenKulup etkinlik={bulunanEtkinlik} />}
        middleLeft={<EtkinlikotherInfo etkinlik={bulunanEtkinlik} />}
        middleRight={<EtkinlikKatilimcilar uyeler={uyeler} />}
      />
    </Layout>
  );
};

export default Etkinlik;
