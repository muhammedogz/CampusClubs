import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CampusClubCard, {
  CampusClubCardLoading,
} from 'src/components/cards/CampusClubCard';
import CCButton from 'src/components/common/CCButton';
import {
  getAllEventsFetcher,
  removeEventFetcher,
} from 'src/fetch/eventFetchers';
import { EventType } from 'src/types/types';
import { getRemoteImage } from 'src/utils/imageUtils';

type EventRemoveModalProps = {
  open: boolean;
  onClose: () => void;
  clubId?: number;
};

const RemoveEventModal = ({ open, onClose, clubId }: EventRemoveModalProps) => {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<EventType[]>([]);

  const getAllEvents = useCallback(async () => {
    try {
      setLoading(true);
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

  const handleRemove = async (eventId: number) => {
    try {
      setLoading(true);
      const response = await removeEventFetcher(eventId.toString());
      if (response.status) {
        getAllEvents();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const clubEvents = useMemo(() => {
    if (clubId) {
      return events.filter((event) => event.club.clubId === clubId);
    } else {
      return events;
    }
  }, [events, clubId]);

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle variant="h5" gutterBottom>
        Etkinlik Çıkar
      </DialogTitle>
      <DialogContent>
        <Stack gap="20px">
          {loading ? (
            <Stack alignItems="center" justifyContent="center" gap="20px">
              <CampusClubCardLoading />
              <CampusClubCardLoading />
              <CampusClubCardLoading />
              <CampusClubCardLoading />
            </Stack>
          ) : (
            <Stack alignItems="center" justifyContent="center" gap="20px">
              {clubEvents.map((event) => (
                <Stack key={event.eventId}>
                  <CampusClubCard
                    image={getRemoteImage(event.image)}
                    title={event.name}
                    description={event.description}
                  />
                  <CCButton
                    onClick={() => handleRemove(event.eventId)}
                    variant="outlined"
                  >
                    Bu etkinliği sil
                  </CCButton>
                </Stack>
              ))}
            </Stack>
          )}
          <Stack alignContent="center" justifyContent="center">
            <CCButton onClick={onClose} variant="outlined">
              Kapat
            </CCButton>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveEventModal;
