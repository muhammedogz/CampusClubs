import { Stack, Typography } from '@mui/material';
import CampusClubCard from 'src/components/cards/CampusClubCard';
import Image from 'src/components/common/Image';
import { Link } from 'src/components/common/Link';
import { Layout } from 'src/components/layout/Layout';
import { events } from 'src/data/etkinlikler';
import { Routes } from 'src/data/routes';

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
          alignItems="stretch"
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
                    <Typography textAlign="center" variant="body2">
                      {event.kulup.shortName}
                    </Typography>
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
