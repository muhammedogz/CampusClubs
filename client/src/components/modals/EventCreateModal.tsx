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
  EventCreatePayload,
  createEventFetcher,
} from 'src/fetch/eventFetchers';
import { uploadFileFetcher } from 'src/fetch/fetchers';
import { ClubType } from 'src/types/types';

type EventCreateModalProps = {
  club: ClubType;
  open: boolean;
  onClose: () => void;
};

const EventCreateModal = ({ club, open, onClose }: EventCreateModalProps) => {
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<EventCreatePayload>({
    name: '',
    description: '',
    image: '',
    location: '',
    type: '',
    eventDate: new Date(),
    clubId: club.clubId,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (event: EventCreatePayload) => {
    try {
      setLoading(true);
      let imageUrl: string | undefined = undefined;
      if (imageFile) {
        const uploadResponse = await uploadFileFetcher(imageFile);

        imageUrl = uploadResponse.data.filePath;
      }

      const response = await createEventFetcher({
        ...event,
        image: imageUrl,
        clubId: club.clubId,
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
          Etkinlik Oluştur
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(event);
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
                value={event.name}
                onChange={(e) => setEvent({ ...event, name: e.target.value })}
              />
              <TextField
                label="Etkinlik Açıklaması"
                fullWidth
                multiline
                rows={3}
                value={event.description}
                onChange={(e) =>
                  setEvent({ ...event, description: e.target.value })
                }
              />

              <TextField
                label="Etkinlik Yeri"
                fullWidth
                value={event.location}
                onChange={(e) =>
                  setEvent({ ...event, location: e.target.value })
                }
              />
              <TextField
                label="Etkinlik Tipi (Örnek: Workshop, Konferans, Gezi, Hackathon)"
                fullWidth
                value={event.type}
                onChange={(e) => setEvent({ ...event, type: e.target.value })}
              />
              <TextField
                label="Etkinlik Tarihi"
                fullWidth
                type="date"
                value={event.eventDate.toISOString().substr(0, 10)}
                onChange={(e) =>
                  setEvent({ ...event, eventDate: new Date(e.target.value) })
                }
              />
              <Stack gap="10px" justifyContent="center" px="100px">
                <CCButton
                  loading={loading}
                  variant="contained"
                  color="primary"
                  type="submit"
                  style={{ marginTop: '1rem' }}
                >
                  Oluştur
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

export default EventCreateModal;
