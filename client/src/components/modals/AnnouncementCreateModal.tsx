import { Dialog, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import CCButton from 'src/components/common/CCButton';
import { CreateAnnouncementPayload, createAnnouncementFetcher } from 'src/fetch/clubFetchers';
import { ClubType } from 'src/types/types';

type AnnouncementCreateModalProps = {
  club: ClubType;
  open: boolean;
  onClose: () => void;
};

const AnnouncementCreateModal = ({ club, open, onClose }: AnnouncementCreateModalProps) => {
  const [loading, setLoading] = useState(false);
  const [announcement, setAnnouncement] = useState<CreateAnnouncementPayload>({
    title: '',
    description: '',
    date: new Date(),
    clubId: club.clubId,
  });

  const handleSubmit = async (announcement: CreateAnnouncementPayload) => {
    try {
      setLoading(true);

      const response = await createAnnouncementFetcher({
        ...announcement,
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
          Duyuru Oluştur
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(announcement);
            }}
          >
            <Stack gap="20px">
              <TextField
                label="Duyuru Başlığı"
                fullWidth
                value={announcement.title}
                onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
              />
              <TextField
                label="Duyuru Açıklaması"
                fullWidth
                multiline
                rows={3}
                value={announcement.description}
                onChange={(e) =>
                  setAnnouncement({ ...announcement, description: e.target.value })
                }
              />
              <TextField
                label="Duyuru Tarihi"
                fullWidth
                type="date"
                value={announcement.date.toISOString().substr(0, 10)}
                onChange={(e) =>
                  setAnnouncement({ ...announcement, date: new Date(e.target.value) })
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

export default AnnouncementCreateModal;
