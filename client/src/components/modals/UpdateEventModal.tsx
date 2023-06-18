import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import CCButton from 'src/components/common/CCButton';
import FileUpload from 'src/components/form/FileUpload';
import {
  EventUpdatePayload,
  updateEventFetcher,
} from 'src/fetch/eventFetchers';
import { uploadFileFetcher } from 'src/fetch/fetchers';
import { EventType } from 'src/types/types';

type EventUpdateModalProps = {
  event: EventType;
  open: boolean;
  onClose: () => void;
};

const EventUpdateModal = ({ event, open, onClose }: EventUpdateModalProps) => {
  const [loading, setLoading] = useState(false);
  const [updatedEvent, setUpdatedEvent] = useState<EventUpdatePayload>({
    name: event.name,
    description: event.description,
    image: '',
    location: event.location,
    type: event.type,
    eventDate: event.eventDate,
    clubId: event.club.clubId,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (
    eventId: string,
    updatedEvent: EventUpdatePayload
  ) => {
    try {
      setLoading(true);
      let imageUrl: string | undefined = undefined;
      if (imageFile) {
        const uploadResponse = await uploadFileFetcher(imageFile);
        imageUrl = uploadResponse.data.filePath;
      }

      const response = await updateEventFetcher(eventId, {
        ...updatedEvent,
        image: imageUrl,
        clubId: event.club.clubId,
      });
      if (response.status) {
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <Stack
        sx={{
          backgroundColor: '#fff',
          padding: '1rem',
          borderRadius: '0.5rem',
        }}
      >
        <DialogTitle variant="h5" gutterBottom>
          Etkinlik Güncelle
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(event.eventId.toString(), updatedEvent);
            }}
          >
            <Stack gap="20px">
              <FileUpload
                onSelectComplete={(file) => {
                  setImageFile(file);
                }}
              />
              <TextField
                label="Etkinlik Adı"
                fullWidth
                value={updatedEvent.name}
                onChange={(e) =>
                  setUpdatedEvent({ ...updatedEvent, name: e.target.value })
                }
              />
              <TextField
                label="Etkinlik Açıklaması"
                fullWidth
                multiline
                rows={3}
                value={updatedEvent.description}
                onChange={(e) =>
                  setUpdatedEvent({
                    ...updatedEvent,
                    description: e.target.value,
                  })
                }
              />

              <TextField
                label="Etkinlik Yeri"
                fullWidth
                value={updatedEvent.location}
                onChange={(e) =>
                  setUpdatedEvent({ ...updatedEvent, location: e.target.value })
                }
              />
              <TextField
                label="Etkinlik Tipi (Örnek: Workshop, Konferans, Gezi, Hackathon)"
                fullWidth
                value={updatedEvent.type}
                onChange={(e) =>
                  setUpdatedEvent({ ...updatedEvent, type: e.target.value })
                }
              />
              <TextField
                label="Etkinlik Tarihi"
                fullWidth
                type="date"
                value={
                  new Date(updatedEvent.eventDate ?? '')
                    .toISOString()
                    .split('T')[0]
                }
                onChange={(e) =>
                  setUpdatedEvent({
                    ...updatedEvent,
                    eventDate: e.target.value,
                  })
                }
              />
              <Stack gap="10px" justifyContent="center" px="100px">
                <CCButton
                  loading={loading}
                  disabled={
                    updatedEvent.name === '' || updatedEvent.description === ''
                  }
                  variant="contained"
                  color="primary"
                  type="submit"
                  style={{ marginTop: '1rem' }}
                >
                  Güncelle
                </CCButton>
                <CCButton
                  onClick={onClose}
                  variant="contained"
                  color="warning"
                  style={{ marginTop: '1rem' }}
                >
                  Kapat
                </CCButton>
              </Stack>
            </Stack>
          </form>
        </DialogContent>
      </Stack>
    </Dialog>
  );
};

export default EventUpdateModal;
