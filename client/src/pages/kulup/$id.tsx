import { Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Image from 'src/components/common/Image';
import { Link } from 'src/components/common/Link';
import Table, { Column } from 'src/components/common/Table';
import { kulupler } from 'src/data/kulupler';
import { Routes } from 'src/data/routes';
import Slides from 'src/slides/Slides';
import { EtkinlikWithoutKulupType, UyeWithoutKulupType } from 'src/types/types';
import { Layout } from '../../components/layout/Layout';

type KulupContentProps = {
  kulup: any;
};

const KulupContent = ({ kulup }: KulupContentProps) => {
  return (
    <Stack
      id="kulup-bilgileri"
      zIndex={2}
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent="space-between"
      alignItems="center"
      gap="20px"
      textAlign={{ xs: 'center', md: 'initial' }}
    >
      <Stack
        justifyContent="center"
        alignItems="center"
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap="30px"
      >
        <Image
          width="150px"
          height="150px"
          src={kulup.logo}
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
            @{kulup.username}
          </Typography>
          <Typography variant="h6">{kulup.description}</Typography>
        </Stack>
      </Stack>
      <Stack
        justifyContent="center"
        gap="6px"
        sx={{
          backgroundColor: '#00AF8E',
          opacity: 0.8,
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
    </Stack>
  );
};

const events: EtkinlikWithoutKulupType[] = [
  {
    name: 'Geekday 2021',
    date: 'Mayıs 2021',
    location: 'Online Youtube',
    type: 'Workshop',
    description: 'Geekday 2021',
    id: 1,
    image: 'https://abl.gtu.edu.tr/resimler/104/t_10416.jpg?',
    slug: 'geekday-2021',
  },
  {
    name: 'Startup Weekend Istanbul',
    date: 'June 2023',
    location: 'Istanbul, Turkey',
    type: 'Hackathon',
    description:
      'An event where entrepreneurs come together to pitch ideas, form teams, and build prototypes over the course of a weekend.',
    id: 2,
    image:
      'https://cdn.pixabay.com/photo/2016/11/08/05/26/startup-1807545_960_720.jpg',
    slug: 'startup-weekend-istanbul',
  },
  {
    name: 'Women in Tech Conference',
    date: 'September 2023',
    location: 'San Francisco, USA',
    type: 'Conference',
    description:
      'A conference that brings together women in technology to network, learn, and share ideas.',
    id: 3,
    image:
      'https://cdn.pixabay.com/photo/2018/08/08/14/10/conference-3593087_960_720.jpg',
    slug: 'women-in-tech-conference',
  },
  {
    name: 'CodeCamp',
    date: 'July 2023',
    location: 'Boston, USA',
    type: 'Workshop',
    description:
      'A workshop where participants learn to code and build projects in a collaborative environment.',
    id: 4,
    image:
      'https://cdn.pixabay.com/photo/2017/07/31/11/46/laptop-2557586_960_720.jpg',
    slug: 'codecamp',
  },
  {
    name: 'DevOpsDays London',
    date: 'October 2023',
    location: 'London, UK',
    type: 'Conference',
    description:
      'A conference focused on DevOps practices, tools, and culture.',
    id: 5,
    image:
      'https://cdn.pixabay.com/photo/2016/11/19/22/32/data-1845504_960_720.jpg',
    slug: 'devopsdays-london',
  },
  {
    name: 'Artificial Intelligence Summit',
    date: 'August 2023',
    location: 'Tokyo, Japan',
    type: 'Summit',
    description:
      'A summit exploring the latest trends and innovations in artificial intelligence.',
    id: 6,
    image:
      'https://cdn.pixabay.com/photo/2018/05/28/14/19/ai-3436190_960_720.jpg',
    slug: 'artificial-intelligence-summit',
  },
  {
    name: 'Data Science Bootcamp',
    date: 'May 2023',
    location: 'Toronto, Canada',
    type: 'Bootcamp',
    description:
      'A bootcamp designed to teach participants the fundamentals of data science and machine learning.',
    id: 7,
    image:
      'https://cdn.pixabay.com/photo/2017/08/06/11/16/code-2588852_960_720.jpg',
    slug: 'data-science-bootcamp',
  },
];

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
  },
  {
    id: 2,
    name: 'Ayşe Kaya',
    image:
      'https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659652_960_720.png',
    slug: 'ayse-kaya',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 3,
    name: 'Kadir Demir',
    image:
      'https://cdn.pixabay.com/photo/2016/03/31/20/27/avatar-1295773_960_720.png',
    slug: 'kadir-demir',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 4,
    name: 'Fatma Yılmaz',
    image:
      'https://cdn.pixabay.com/photo/2017/01/31/19/07/avatar-2026510_960_720.png',
    slug: 'fatma-yilmaz',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 5,
    name: 'Emre Şahin',
    image:
      'https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375_960_720.png',
    slug: 'emre-sahin',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 6,
    name: 'Suleyman Golbol',
    image:
      'https://cdn.pixabay.com/photo/2021/08/25/15/21/man-6576565_960_720.png',
    slug: 'suleyman-golbol',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 7,
    name: 'Dilara Özdemir',
    image:
      'https://cdn.pixabay.com/photo/2014/03/24/17/19/teacher-295387_960_720.png',
    slug: 'dilara-ozdemir',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 8,
    name: 'Ali İhsan',
    image:
      'https://cdn.pixabay.com/photo/2016/03/31/20/27/avatar-1295772_960_720.png',
    slug: 'ali-ihsan',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 9,
    name: 'Gamze Arslan',
    image:
      'https://cdn.pixabay.com/photo/2016/11/18/23/38/woman-1837376_960_720.png',
    slug: 'gamze-arslan',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 9,
    name: 'Gamze Arslan',
    image:
      'https://cdn.pixabay.com/photo/2016/11/18/23/38/woman-1837376_960_720.png',
    slug: 'gamze-arslan',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 9,
    name: 'Gamze Arslan',
    image:
      'https://cdn.pixabay.com/photo/2016/11/18/23/38/woman-1837376_960_720.png',
    slug: 'gamze-arslan',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 9,
    name: 'Gamze Arslan',
    image:
      'https://cdn.pixabay.com/photo/2016/11/18/23/38/woman-1837376_960_720.png',
    slug: 'gamze-arslan',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 9,
    name: 'Gamze Arslan',
    image:
      'https://cdn.pixabay.com/photo/2016/11/18/23/38/woman-1837376_960_720.png',
    slug: 'gamze-arslan',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 9,
    name: 'Gamze Arslan',
    image:
      'https://cdn.pixabay.com/photo/2016/11/18/23/38/woman-1837376_960_720.png',
    slug: 'gamze-arslan',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 9,
    name: 'Gamze Arslan',
    image:
      'https://cdn.pixabay.com/photo/2016/11/18/23/38/woman-1837376_960_720.png',
    slug: 'gamze-arslan',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
];

const uyeColumns: Column<UyeWithoutKulupType>[] = [
  { header: ' ', accessor: 'image', align: 'center' },
  { header: 'Üye Adı', accessor: 'name' },
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
  const desiredKulup = tumKulupler.find((kulup) => kulup.username === id);

  if (!desiredKulup) return <Layout>404</Layout>;

  return (
    <Layout>
      <Stack gap="20px">
        <Stack
          id="upper-background"
          sx={{
            zIndex: -1,
            position: 'absolute',
            left: 0,
            right: 0,
            backgroundImage: `url(${desiredKulup.logo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(20px)',

            height: '200px',
          }}
        />
        <Stack gap="50px" mt="160px">
          <KulupContent kulup={desiredKulup} />
          <Stack gap="10px">
            <Stack
              id="kulup-etkinlikleri-uyeleri"
              flexDirection={{ xs: 'column', md: 'row' }}
              justifyContent="space-evenly"
              gap="40px"
            >
              <Stack gap={6}>
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
              <Stack>
                <Table title="Üyeler" data={uyeler} columns={uyeColumns} />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Layout>
  );
};

export default Kulup;
