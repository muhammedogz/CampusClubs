import { Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import CampusClubCard from 'src/components/cards/CampusClubCard';
import Image from 'src/components/common/Image';
import { Link } from 'src/components/common/Link';
import { Layout } from 'src/components/layout/Layout';
import { Routes } from 'src/data/routes';
import { getAllEventsFetcher } from 'src/fetch/eventFetchers';
import { EventType } from 'src/types/types';
import { getRemoteImage } from 'src/utils/imageUtils';
import { formatDate } from 'src/utils/utils';

const index = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getAllEvents = useCallback(async () => {
    try {
      const eventsResponse = await getAllEventsFetcher();
      if (eventsResponse.status) {
        setEvents(eventsResponse.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getAllEvents();
  }, [getAllEvents]);

  return (
    <Layout loading={loading}>
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
              link={`${Routes.EVENT}/${event.eventId}`}
              image={getRemoteImage(event.image)}
              topLeftText={event.type}
              title={event.name}
              description={event.description}
              topRightText={formatDate(event.eventDate)}
              rightDownElement={
                <Link to={`${Routes.CLUB}/${event.club.clubId}`}>
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
                      src={getRemoteImage(event.club.image)}
                      alt={event.club.name}
                      width="50px"
                      height="50px"
                      variant="circular"
                    />
                    <Typography
                      maxWidth="100px"
                      textAlign="center"
                      variant="body2"
                    >
                      {event.club.name}
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
