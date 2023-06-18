import {
  Autocomplete,
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
import { addUserToClubFetcher } from 'src/fetch/clubFetchers';
import { getAllUsersFetcher } from 'src/fetch/userFetchers';
import { ClubRoleEnum, UserType } from 'src/types/types';

type UserAddModalProps = {
  open: boolean;
  onClose: () => void;
  clubId: number;
};

const AddUserClubModal = ({ open, onClose, clubId }: UserAddModalProps) => {
  const [loading, setLoading] = useState(false);
  const [loadingUserList, setLoadingUserList] = useState(false);
  const [userList, setUserList] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [selectedRole, setSelectedRole] = useState<ClubRoleEnum | null>(null);

  const roles = [ClubRoleEnum.ADVISOR, ClubRoleEnum.ADMIN, ClubRoleEnum.MEMBER];

  const getAllUsers = useCallback(async () => {
    try {
      setLoadingUserList(true);
      const allUsersResponse = await getAllUsersFetcher();

      if (allUsersResponse.status) {
        setUserList(allUsersResponse.data);
        setLoadingUserList(false);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const handleSubmit = async () => {
    if (selectedUser && selectedRole) {
      try {
        setLoading(true);
        const response = await addUserToClubFetcher(clubId, {
          userId: selectedUser.userId,
          role: selectedRole,
        });
        if (response.status) {
          onClose();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle variant="h5" gutterBottom>
        Kulübe Kullanıcı Ekle
      </DialogTitle>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Stack gap="20px">
            {loadingUserList ? (
              <Skeleton width="200px" />
            ) : (
              <CCAutocomplete
                options={userList.map((user) => ({
                  id: user.userId,
                  name: user.firstName + ' ' + user.lastName,
                  image: user.image,
                }))}
                onChange={(e, value) => {
                  setSelectedUser(
                    userList.find((user) => user.userId === value?.id) ?? null
                  );
                }}
              />
            )}
            <Autocomplete
              options={roles}
              renderInput={(params) => (
                <TextField {...params} label="Role" variant="outlined" />
              )}
              getOptionLabel={(option) =>
                option === ClubRoleEnum.ADMIN
                  ? 'Admin'
                  : option === ClubRoleEnum.ADVISOR
                  ? 'Danışman'
                  : 'Üye'
              }
              renderOption={(props, option) => (
                <li {...props}>
                  {option === ClubRoleEnum.ADMIN
                    ? 'Admin'
                    : option === ClubRoleEnum.ADVISOR
                    ? 'Danışman'
                    : 'Üye'}
                </li>
              )}
              onChange={(e, value) => {
                setSelectedRole(value ?? null);
              }}
            />
            <CCButton
              loading={loading}
              disabled={selectedUser === null || selectedRole === null}
              variant="contained"
              color="primary"
              type="submit"
              style={{ marginTop: '1rem' }}
            >
              Kullanıcıyı ekle
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
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserClubModal;
