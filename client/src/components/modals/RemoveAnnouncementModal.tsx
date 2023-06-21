import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import CCButton from 'src/components/common/CCButton';
import { deleteAnnouncementFetcher } from 'src/fetch/clubFetchers';
import { AnnouncementType, ClubType } from 'src/types/types';

type AnnouncementRemoveModalProps = {
  open: boolean;
  onClose: () => void;
  club: ClubType;
};

const RemoveAnnouncementModal = ({
  open,
  onClose,
  club,
}: AnnouncementRemoveModalProps) => {
  const handleRemove = async (announcementId: number) => {
    try {
      const response = await deleteAnnouncementFetcher(announcementId);
      if (response.status) {
        // Notify parent to update the club info after an announcement has been removed.
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle variant="h5" gutterBottom>
        Duyuru Çıkar
      </DialogTitle>
      <DialogContent>
        <Stack gap="20px">
          <Stack alignItems="center" justifyContent="center" gap="20px">
            {club.announcements.map((announcement: AnnouncementType) => (
              <Stack
                key={announcement.announcementId}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  border: '1px solid #ccc',
                  padding: '10px',
                  borderRadius: '5px',
                  boxShadow: '0 0 5px #ccc',
                }}
              >
                <Stack gap="20px" alignItems="center" justifyContent="center">
                  <Typography variant="body1">
                    {announcement.title} - {announcement.description}
                  </Typography>
                  <CCButton
                    onClick={() => handleRemove(announcement.announcementId)}
                    variant="outlined"
                  >
                    Bu duyuruyu çıkar
                  </CCButton>
                </Stack>
              </Stack>
            ))}
          </Stack>
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

export default RemoveAnnouncementModal;
