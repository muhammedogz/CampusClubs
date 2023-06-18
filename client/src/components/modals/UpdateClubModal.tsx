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
import { UpdateClubPayload, updateClubFetcher } from 'src/fetch/clubFetchers';
import { uploadFileFetcher } from 'src/fetch/fetchers';
import { ClubType } from 'src/types/types';

type ClubUpdateModalProps = {
  club: ClubType;
  open: boolean;
  onClose: () => void;
};

const ClubUpdateModal = ({ club, open, onClose }: ClubUpdateModalProps) => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [updatedClub, setUpdatedClub] = useState<UpdateClubPayload>({
    ...club,
  });

  const handleSubmit = async (newClub: UpdateClubPayload) => {
    try {
      setLoading(true);
      let imageUrl: string | undefined = undefined;
      if (imageFile) {
        const uploadResponse = await uploadFileFetcher(imageFile);
        imageUrl = uploadResponse.data.filePath;
      }

      const response = await updateClubFetcher(club.clubId, {
        ...newClub,
        image: imageUrl,
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
          Kulüp Güncelle
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(updatedClub);
            }}
          >
            <Stack gap="20px">
              <FileUpload
                onSelectComplete={(file) => {
                  setImageFile(file);
                }}
              />
              <TextField
                label="Kulüp Adı"
                fullWidth
                value={updatedClub.name}
                onChange={(e) =>
                  setUpdatedClub({ ...updatedClub, name: e.target.value })
                }
              />
              <TextField
                label="Kulüp Açıklaması"
                fullWidth
                multiline
                rows={3}
                value={updatedClub.description}
                onChange={(e) =>
                  setUpdatedClub({
                    ...updatedClub,
                    description: e.target.value,
                  })
                }
              />
              <TextField
                label="Kulüp İlgi Alanları (Virgülle Ayırarak)"
                fullWidth
                value={updatedClub.tag}
                onChange={(e) =>
                  setUpdatedClub({ ...updatedClub, tag: e.target.value })
                }
              />
              <Stack gap="10px" justifyContent="center" px="100px">
                <CCButton
                  loading={loading}
                  disabled={
                    updatedClub.name === '' || updatedClub.description === ''
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

export default ClubUpdateModal;
