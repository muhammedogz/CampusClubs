import { Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import Image from 'src/components/common/Image';
import { Link } from 'src/components/common/Link';
import Table, { Column } from 'src/components/common/Table';
import ContentLayout from 'src/components/layout/ContentLayout';
import { events } from 'src/data/etkinlikler';
import { Routes } from 'src/data/routes';
import { UyeType } from 'src/types/types';
import { Layout } from '../../components/layout/Layout';
import { uyeler } from 'src/data/uyeler';

const uyeColumns: Column<UyeType>[] = [
  { header: ' ', accessor: 'image', align: 'center' },
  { header: 'Üye Adı', accessor: 'name' },
  { header: 'Bölüm', accessor: 'bolum' },
];

const Etkinlik = () => {
  const { id } = useParams();
  console.log('id', id);
  const tumEtkinlikler = events;
  console.log('tumEtkinlikler', tumEtkinlikler);
  const bulunanEtkinlik = tumEtkinlikler.find(
    (etkinlik) => etkinlik.slug === id
  );

  if (!bulunanEtkinlik) return <Layout>404</Layout>;

  return (
    <Layout>
      <ContentLayout
        upperBackgroundImage={bulunanEtkinlik.image}
        upperLeft={
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
              src={bulunanEtkinlik.image}
              sx={{
                borderRadius: '20px',
                boxShadow:
                  'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
              }}
            />
            <Stack maxWidth="400px" pt={{ xs: '0px', sm: '55px' }}>
              <Typography
                variant="h4"
                fontSize={30}
                color="main"
                fontWeight={600}
              >
                {bulunanEtkinlik.name}
              </Typography>
              <Typography variant="h6" color="secondary">
                @{bulunanEtkinlik.name}
              </Typography>
            </Stack>
          </Stack>
        }
        upperRight={
          <Link to={`${Routes.KULUP}/${bulunanEtkinlik.kulup.slug}`}>
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
                src={bulunanEtkinlik.kulup.image}
                width="80px"
                height="80px"
              />

              <Typography fontWeight={600} textAlign="center">
                {bulunanEtkinlik.kulup.name}
              </Typography>
            </Stack>
          </Link>
        }
        middleLeft={
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
              <Typography variant="body2">
                {bulunanEtkinlik.description}
              </Typography>
            </Stack>
            <Stack>
              <Typography variant="h5">Tarih</Typography>
              <Typography variant="body2">{bulunanEtkinlik.date}</Typography>
            </Stack>
            <Stack>
              <Typography variant="h5">Yer</Typography>
              <Typography variant="body2">
                {bulunanEtkinlik.location}
              </Typography>
            </Stack>
          </Stack>
        }
        middleRight={
          <Stack id="middle-content-right">
            <Table title="Katılımcılar" data={uyeler} columns={uyeColumns} />
          </Stack>
        }
      />
    </Layout>
  );
};

export default Etkinlik;
