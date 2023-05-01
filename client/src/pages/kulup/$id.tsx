import { Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Image from 'src/components/common/Image';
import { Link } from 'src/components/common/Link';
import Table, { Column } from 'src/components/common/Table';
import ContentLayout from 'src/components/layout/ContentLayout';
import { events } from 'src/data/etkinlikler';
import { kulupler } from 'src/data/kulupler';
import { Routes } from 'src/data/routes';
import Slides from 'src/slides/Slides';
import { EtkinlikWithoutKulupType, UyeWithoutKulupType } from 'src/types/types';
import { Layout } from '../../components/layout/Layout';

const etkinlikColumns: Column<EtkinlikWithoutKulupType>[] = [
  { header: ' ', accessor: 'image', align: 'center' },
  { header: 'Etkinlik Adı', accessor: 'name' },
  { header: 'Tarih', accessor: 'date', align: 'center' },
  { header: 'Yer', accessor: 'location', align: 'center' },
];

const uyeler: UyeWithoutKulupType[] = [
  {
    id: 1,
    name: 'Muhammed Oğuz',
    image:
      'https://cdn.pixabay.com/photo/2021/08/25/15/21/man-6576565_960_720.png',
    slug: 'muhammed-oguz',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    bolum: 'Bilgisayar Mühendisliği',
  },
  {
    id: 2,
    name: 'Ayşe Kaya',
    image:
      'https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659652_960_720.png',
    slug: 'ayse-kaya',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    bolum: 'Endüstri Mühendisliği',
  },
  {
    id: 3,
    name: 'Kadir Demir',
    image:
      'https://cdn.pixabay.com/photo/2016/03/31/20/27/avatar-1295773_960_720.png',
    slug: 'kadir-demir',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    bolum: 'Makine Mühendisliği',
  },
  {
    id: 4,
    name: 'Fatma Yılmaz',
    image:
      'https://cdn.pixabay.com/photo/2017/01/31/19/07/avatar-2026510_960_720.png',
    slug: 'fatma-yilmaz',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    bolum: 'İnşaat Mühendisliği',
  },
  {
    id: 5,
    name: 'Emre Şahin',
    image:
      'https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375_960_720.png',
    slug: 'emre-sahin',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    bolum: 'Elektrik Elektronik Mühendisliği',
  },
  {
    id: 6,
    name: 'Suleyman Golbol',
    image:
      'https://cdn.pixabay.com/photo/2021/08/25/15/21/man-6576565_960_720.png',
    slug: 'suleyman-golbol',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    bolum: 'Bilgisayar Mühendisliği',
  },
];

const uyeColumns: Column<UyeWithoutKulupType>[] = [
  { header: ' ', accessor: 'image', align: 'center' },
  { header: 'Üye Adı', accessor: 'name' },
  { header: 'Bölüm', accessor: 'bolum' },
];

type DuyuruType = {
  id: number;
  title: string;
  description: string;
  date: string;
};

const duyurular: DuyuruType[] = [
  {
    id: 1,
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut aliquam aliquam, nunc nunc aliquam elit, nec ultricies nunc nunc vel nunc. Sed euismod, nunc ut aliquam aliquam, nunc nunc aliquam elit, nec ultricies nunc nunc vel nunc.',
    date: '2021-09-01',
  },
  {
    id: 2,
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut aliquam aliquam, nunc nunc aliquam elit, nec ultricies nunc nunc vel nunc. Sed euismod, nunc ut aliquam aliquam, nunc nunc aliquam elit, nec ultricies nunc nunc vel nunc.',
    date: '2021-09-01',
  },
];

const duyuruColumns: Column<DuyuruType>[] = [
  { header: 'Duyuru Başlığı', accessor: 'title' },
  { header: 'Duyuru Açıklaması', accessor: 'description' },
  { header: 'Duyuru Tarihi', accessor: 'date' },
];

const Kulup = () => {
  const { id } = useParams();

  const [index, setIndex] = useState(0);

  const tumKulupler = kulupler;
  const desiredKulup = tumKulupler.find((kulup) => kulup.slug === id);

  if (!desiredKulup) return <Layout>404</Layout>;

  return (
    <Layout>
      <ContentLayout
        upperBackgroundImage={desiredKulup.image}
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
              src={desiredKulup.image}
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
                {desiredKulup.name}
              </Typography>
              <Typography variant="h6" color="secondary">
                @{desiredKulup.name}
              </Typography>
              <Typography variant="h6">{desiredKulup.description}</Typography>
            </Stack>
          </Stack>
        }
        upperRight={
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
                <Typography fontWeight={600}>
                  Danışman: Yusuf Sinan Akgül
                </Typography>
                <Image
                  variant="circular"
                  src="https://abl.gtu.edu.tr/resimler/104/t_10416.jpg?"
                  width="30px"
                  height="30px"
                />
              </Stack>
            </Link>
            <Typography fontWeight={600}>
              Kulüp Türü: Teknoloji, Yazılım, Bilgisayar
            </Typography>
            <Typography fontWeight={600}>Üye sayısı: 200+</Typography>
          </Stack>
        }
        middleLeft={
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
                data={events}
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
        }
        middleRight={
          <Stack id="middle-content-right">
            <Table title="Üyeler" data={uyeler} columns={uyeColumns} />
          </Stack>
        }
      />
    </Layout>
  );
};

export default Kulup;
