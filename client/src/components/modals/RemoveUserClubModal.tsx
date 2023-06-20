import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import CampusClubCard, {
  CampusClubCardLoading,
} from 'src/components/cards/CampusClubCard';
import CCButton from 'src/components/common/CCButton';
import { emptyClubData } from 'src/data/emptyData';
import {
  getClubFromIdFetcher,
  removeUserFromClubFetcher,
} from 'src/fetch/clubFetchers';
import { ClubRoleEnum, ClubType } from 'src/types/types';
import { getRemoteImage } from 'src/utils/imageUtils';

type UserRemoveModalProps = {
  open: boolean;
  onClose: () => void;
  clubId: number;
};

const RemoveUserClubModal = ({
  open,
  onClose,
  clubId,
}: UserRemoveModalProps) => {
  const [loading, setLoading] = useState(false);
  const [club, setClub] = useState<ClubType>(emptyClubData);

  const getClubInfo = useCallback(async () => {
    try {
      setLoading(true);
      const clubResponse = await getClubFromIdFetcher(clubId.toString());
      if (clubResponse.status) {
        setClub(clubResponse.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }, [clubId]);

  useEffect(() => {
    getClubInfo();
  }, [getClubInfo]);

  const handleRemove = async (userId: number) => {
    try {
      setLoading(true);
      const response = await removeUserFromClubFetcher(clubId, userId);
      if (response.status) {
        // Update the club info after a user has been removed.
        getClubInfo();
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
        Kulüpten Üye Çıkar
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
              {club.users.map((user) => (
                <Stack key={user.firstName + user.lastName}>
                  <CampusClubCard
                    image={getRemoteImage(user.image)}
                    title={user.firstName + ' ' + user.lastName}
                    description={
                      user.clubRole === ClubRoleEnum.ADMIN ? 'Yönetici' : 'Üye'
                    }
                  />
                  <CCButton
                    onClick={() => handleRemove(user.userId)}
                    variant="outlined"
                  >
                    Bu üyeyi çıkar
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

export default RemoveUserClubModal;
