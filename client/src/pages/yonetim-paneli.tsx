import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CCButton from 'src/components/common/CCButton';
import { Layout } from 'src/components/layout/Layout';
import ClubCreateModal from 'src/components/modals/ClubCreateModal';
import { Routes } from 'src/data/routes';
import { UserRoleEnum } from 'src/types/types';
import { StorageKeyEnum, getLocalStorageItem } from 'src/utils/storageUtils';
import { generateRoute } from 'src/utils/urlUtils';

const Panel = () => {
  const [openCreateClubDialog, setOpenCreateClubDialog] = useState(false);
  const user = getLocalStorageItem(StorageKeyEnum.USER_STORAGE)?.user;
  const userLoggedIn = !!user?.firstName;

  const navigate = useNavigate();

  useEffect(() => {
    if (!userLoggedIn || user.userRole !== UserRoleEnum.ADMIN) {
      navigate(generateRoute(Routes.HOME));
    }
  }, [userLoggedIn, navigate, user?.userRole]);

  return (
    <Layout>
      <ClubCreateModal
        onClose={() => navigate(0)}
        open={openCreateClubDialog}
      />
      <Stack gap="20px" pt="60px">
        <Stack>
          <Typography variant="h3" color="primary" textAlign="center">
            Yönetim Paneli
          </Typography>
        </Stack>
        <Stack>
          <Stack>
            <CCButton
              onClick={() => setOpenCreateClubDialog(true)}
              variant="contained"
            >
              Kulüp Oluştur
            </CCButton>
          </Stack>
        </Stack>
      </Stack>
    </Layout>
  );
};

export default Panel;
