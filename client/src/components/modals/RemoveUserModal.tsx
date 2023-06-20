import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import CampusClubCard, {
  CampusClubCardLoading,
} from 'src/components/cards/CampusClubCard';
import CCButton from 'src/components/common/CCButton';
import { getAllUsersFetcher, removeUserFetcher } from 'src/fetch/userFetchers';
import { UserType } from 'src/types/types';
import { getRemoteImage } from 'src/utils/imageUtils';

type UserRemoveModalProps = {
  open: boolean;
  onClose: () => void;
};

const RemoveUserModal = ({ open, onClose }: UserRemoveModalProps) => {
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<UserType[]>([]);

  const getAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      const allUsersResponse = await getAllUsersFetcher();
      if (allUsersResponse.status) {
        setAllUsers(allUsersResponse.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const handleRemove = async (userId: number) => {
    try {
      setLoading(true);
      const response = await removeUserFetcher(userId);
      if (response.status) {
        getAllUsers();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle variant="h5" gutterBottom>
        Kullanıcı Çıkar
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
              {allUsers.map((user) => (
                <Stack key={user.userId}>
                  <CampusClubCard
                    image={getRemoteImage(user.image)}
                    title={user.firstName + ' ' + user.lastName}
                    description={''}
                  />
                  <CCButton
                    onClick={() => handleRemove(user.userId)}
                    variant="outlined"
                  >
                    Bu kullanıcıyı çıkar
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

export default RemoveUserModal;
