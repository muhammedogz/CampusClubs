import {
  Autocomplete,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import CCButton from 'src/components/common/CCButton';
import FileUpload from 'src/components/form/FileUpload';
import { departmentData } from 'src/data/departmentData';
import { uploadFileFetcher } from 'src/fetch/fetchers';
import {
  UserUpdateDTO,
  getUserFromIdFetcher,
  updateUserFetcher,
} from 'src/fetch/userFetchers';
import { UserType } from 'src/types/types';
import {
  StorageKeyEnum,
  getLocalStorageItem,
  updateLocalStorageItem,
} from 'src/utils/storageUtils';

type UserUpdateModalProps = {
  user: UserType;
  open: boolean;
  onClose: () => void;
};

const UserUpdateModal = ({ user, open, onClose }: UserUpdateModalProps) => {
  const [loading, setLoading] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<UserUpdateDTO>({
    userName: user.userName,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    departmentId: user.department?.departmentId,
    image: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (userId: number, updatedUser: UserUpdateDTO) => {
    try {
      setLoading(true);
      let imageUrl: string | undefined = undefined;
      if (imageFile) {
        const uploadResponse = await uploadFileFetcher(imageFile);

        imageUrl = uploadResponse.data.filePath;
      }

      const response = await updateUserFetcher(userId, {
        ...updatedUser,
        image: imageUrl,
      });
      if (response.status) {
        const userResponse = await getUserFromIdFetcher(user.userId.toString());
        if (userResponse.status) {
          const userData = userResponse.data;
          const userStorage = getLocalStorageItem(StorageKeyEnum.USER_STORAGE);
          updateLocalStorageItem(StorageKeyEnum.USER_STORAGE, {
            token: userStorage?.token ?? '',
            user: {
              ...userStorage?.user,
              ...userData,
            },
          });
        }
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
          Kullanıcı Düzenle
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(user.userId, updatedUser);
            }}
          >
            <Stack gap="20px">
              <FileUpload
                onSelectComplete={(file) => {
                  setImageFile(file);
                }}
              />
              <TextField
                label="Kullanıcı Adı"
                disabled
                fullWidth
                value={updatedUser.userName}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, userName: e.target.value })
                }
              />
              <TextField
                label="Email"
                disabled
                fullWidth
                value={updatedUser.email}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, email: e.target.value })
                }
              />
              <TextField
                label="İsim"
                fullWidth
                value={updatedUser.firstName}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, firstName: e.target.value })
                }
              />
              <TextField
                label="Soyisim"
                fullWidth
                value={updatedUser.lastName}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, lastName: e.target.value })
                }
              />

              <Autocomplete
                options={departmentData}
                value={departmentData.find(
                  (d) => d.departmentId === user.department?.departmentId
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Bölüm"
                    name="department"
                    required
                    fullWidth
                  />
                )}
                onChange={(e, value) => {
                  setUpdatedUser({
                    ...user,
                    departmentId: value?.departmentId ?? undefined,
                  });
                }}
                getOptionLabel={(option) => option.name}
              />
              <Stack gap="10px" justifyContent="center" px="100px">
                <CCButton
                  loading={loading}
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
                  İptal
                </CCButton>
              </Stack>
            </Stack>
          </form>
        </DialogContent>
      </Stack>
    </Dialog>
  );
};

export default UserUpdateModal;
