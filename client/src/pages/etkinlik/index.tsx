import { Stack, Typography } from '@mui/material';
import CampusClubCard from 'src/components/cards/CampusClubCard';
import Image from 'src/components/common/Image';
import { Link } from 'src/components/common/Link';
import { Layout } from 'src/components/layout/Layout';
import { Routes } from 'src/data/routes';
import { EtkinlikType, KulupType } from 'src/types/types';
// https://picsum.photos/700/500

const kulup: KulupType = {
  name: 'Gtubt',
  description: 'Kodluyoruz',
  etkinlik: [],
  id: 1,
  image: 'https://picsum.photos/700/500',
  slug: 'gtubt',
  uye: [],
};

const events: EtkinlikType[] = [
  {
    name: 'Geekday 2021',
    date: 'Mayıs 2021',
    location: 'Online Youtube',
    type: 'Workshop',
    description: 'Geekday 2021',
    id: 1,
    image: 'https://picsum.photos/700/501',
    slug: 'geekday-2021',
    kulup,
  },
  {
    name: 'Startup Weekend Istanbul',
    date: 'June 2023',
    location: 'Istanbul, Turkey',
    type: 'Hackathon',
    description:
      'An event where entrepreneurs come together to pitch ideas, form teams, and build prototypes over the course of a weekend.',
    id: 2,
    image: 'https://picsum.photos/701/500',
    slug: 'startup-weekend-istanbul',
    kulup,
  },
  {
    name: 'Women in Tech Conference',
    date: 'September 2023',
    location: 'San Francisco, USA',
    type: 'Conference',
    description:
      'A conference that brings together women in technology to network, learn, and share ideas.',
    id: 3,
    image: 'https://picsum.photos/300/500',
    slug: 'women-in-tech-conference',
    kulup,
  },
  {
    name: 'CodeCamp',
    date: 'July 2023',
    location: 'Boston, USA',
    type: 'Workshop',
    description:
      'A workshop where participants learn to code and build projects in a collaborative environment.',
    id: 4,
    image: 'https://picsum.photos/700/700',
    slug: 'codecamp',
    kulup,
  },
  {
    name: 'DevOpsDays London',
    date: 'October 2023',
    location: 'London, UK',
    type: 'Conference',
    description:
      'A conference focused on DevOps practices, tools, and culture.',
    id: 5,
    image: 'https://picsum.photos/550/500',
    slug: 'devopsdays-london',
    kulup,
  },
  {
    name: 'Artificial Intelligence Summit',
    date: 'August 2023',
    location: 'Tokyo, Japan',
    type: 'Summit',
    description:
      'A summit exploring the latest trends and innovations in artificial intelligence.',
    id: 6,
    image: 'https://picsum.photos/700/620',
    slug: 'artificial-intelligence-summit',
    kulup,
  },
];
const index = () => {
  return (
    <Layout>
      <Stack gap="20px" pt="60px">
        <Stack>
          <Typography variant="h3" color="primary" textAlign="center">
            Tüm Etkinlikler
          </Typography>
        </Stack>

        <Stack
          flexDirection="row"
          gap="30px"
          flexWrap="wrap"
          justifyContent="center"
          alignItems="flex-start"
          flexGrow={1}
        >
          {events.map((event) => (
            <CampusClubCard
              key={event.name + event.description}
              link={`${Routes.ETKINLIK}/${event.slug}`}
              image={event.image}
              topLeftText={event.type}
              title={event.name}
              description={event.description}
              topRightText={event.date}
              rightDownElement={
                <Link to={`${Routes.KULUP}/${event.kulup.slug}`}>
                  <Stack
                    id="organizer-kulup"
                    justifyContent="center"
                    alignItems="center"
                    gap="2px"
                    sx={{
                      backgroundColor: '#00AF8E',
                      borderRadius: '20px',
                      p: '6px',
                      color: '#ffffff',
                    }}
                  >
                    <Image
                      src={event.kulup.image}
                      alt={event.kulup.name}
                      width="50px"
                      height="50px"
                      variant="circular"
                    />
                    <Typography variant="body2">{event.kulup.name}</Typography>
                  </Stack>
                </Link>
              }
            />
          ))}
        </Stack>
      </Stack>
    </Layout>
  );
};

export default index;
