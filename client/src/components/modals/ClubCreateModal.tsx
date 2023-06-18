import {
  Dialog,
  DialogContent,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import CCAutocomplete from 'src/components/common/CCAutocomplete';
import CCButton from 'src/components/common/CCButton';
import FileUpload from 'src/components/form/FileUpload';
import { CreateClubPayload, createClubFetcher } from 'src/fetch/clubFetchers';
import { uploadFileFetcher } from 'src/fetch/fetchers';
import { getAllTeachersFetcher } from 'src/fetch/userFetchers';
import { UserType } from 'src/types/types';

type ClubCreateModalProps = {
  open: boolean;
  onClose: () => void;
};

const ClubCreateModal = ({ open, onClose }: ClubCreateModalProps) => {
  const [loading, setLoading] = useState(false);
  const [loadingTeacherList, setLoadingTeacherList] = useState(false);
  const [teacherList, setAllTeachers] = useState<UserType[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [advisor, setAdvisor] = useState<UserType | null>(null);
  const [club, setClub] = useState<CreateClubPayload>({
    name: '',
    description: '',
    image: '',
    tag: '',
    advisorId: 0,
  });

  const getAllTeachers = useCallback(async () => {
    try {
      setLoadingTeacherList(true);
      const allUsersResponse = await getAllTeachersFetcher();

      if (allUsersResponse.status) {
        setAllTeachers(allUsersResponse.data);
        setLoadingTeacherList(false);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getAllTeachers();
  }, [getAllTeachers]);

  const handleSubmit = async (club: CreateClubPayload) => {
    try {
      setLoading(true);
      let imageUrl: string | undefined = undefined;
      if (imageFile) {
        const uploadResponse = await uploadFileFetcher(imageFile);

        imageUrl = uploadResponse.data.filePath;
      }

      const response = await createClubFetcher({
        ...club,
        image: imageUrl,
        advisorId: advisor?.userId ?? 0,
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
          Kulüp Oluştur
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(club);
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
                value={club.name}
                onChange={(e) => setClub({ ...club, name: e.target.value })}
              />
              <TextField
                label="Kulüp Açıklaması"
                fullWidth
                multiline
                rows={3}
                value={club.description}
                onChange={(e) =>
                  setClub({ ...club, description: e.target.value })
                }
              />
              <TextField
                label="Kulüp İlgi Alanları (Virgülle Ayırarak)"
                fullWidth
                value={club.tag}
                onChange={(e) => setClub({ ...club, tag: e.target.value })}
              />
              {loadingTeacherList ? (
                <Skeleton width="200px" />
              ) : (
                <CCAutocomplete
                  options={teacherList.map((teacher) => ({
                    id: teacher.userId,
                    name: teacher.firstName + ' ' + teacher.lastName,
                    image: teacher.image,
                  }))}
                  onChange={(e, value) => {
                    setAdvisor(
                      teacherList.find(
                        (teacher) => teacher.userId === value?.id
                      ) ?? null
                    );
                  }}
                />
              )}
              <Stack gap="10px" justifyContent="center" px="100px">
                <CCButton
                  loading={loading}
                  disabled={
                    club.name === '' ||
                    club.description === '' ||
                    advisor === null
                  }
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

export default ClubCreateModal;
