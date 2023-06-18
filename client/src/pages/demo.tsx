import { Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CampusClubCard, {
  CampusClubCardLoading,
} from 'src/components/cards/CampusClubCard';
import CCButton from 'src/components/common/CCButton';
import { Layout } from 'src/components/layout/Layout';
import { Routes } from 'src/data/routes';
import { authTokenFetcher } from 'src/fetch/authFetchers';
import { getAllUsersFetcher } from 'src/fetch/userFetchers';
import { UserRoleEnum, UserType } from 'src/types/types';
import { getRemoteImage } from 'src/utils/imageUtils';
import {
  StorageKeyEnum,
  removeLocalStorageItem,
  updateLocalStorageItem,
} from 'src/utils/storageUtils';
import { generateRoute } from 'src/utils/urlUtils';

const Demo = () => {
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<UserType[]>([]);

  const navigate = useNavigate();

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

  const handleLogin = useCallback(
    async (username: string) => {
      try {
        const storageKeysToRemove = Object.values(StorageKeyEnum);
        storageKeysToRemove.forEach((key) => {
          removeLocalStorageItem(key);
        });
        const signinWithDemo = await authTokenFetcher(username);
        if (signinWithDemo.status) {
          const data = signinWithDemo.data;
          const token = data.token as string;
          updateLocalStorageItem(StorageKeyEnum.USER_STORAGE, {
            token,
            user: data.user,
          });
          navigate(generateRoute(Routes.HOME));
        }
      } catch (error) {
        console.error(error);
      }
    },
    [navigate]
  );

  return (
    <Layout>
      <Stack gap="20px" pt="60px">
        <Stack>
          <Typography variant="h3" color="primary" textAlign="center">
            Tüm Kullanıcıalr
          </Typography>
          <Typography color="primary" textAlign="center">
            Bu sayfadan, demo olarak tüm kullanıcıları giriş yapmak için
            kullanabilirsiniz.
          </Typography>
        </Stack>
        <Stack
          flexDirection="row"
          gap="30px"
          flexWrap="wrap"
          justifyContent="center"
        >
          {loading ? (
            <>
              <CampusClubCardLoading />
              <CampusClubCardLoading />
              <CampusClubCardLoading />
              <CampusClubCardLoading />
            </>
          ) : (
            <>
              {allUsers.map((user) => (
                <Stack key={user.firstName + user.lastName}>
                  <CampusClubCard
                    image={getRemoteImage(user.image)}
                    title={user.firstName + ' ' + user.lastName}
                    description={
                      user.userRole === UserRoleEnum.ADMIN
                        ? 'SKS Admin'
                        : user.userRole === UserRoleEnum.TEACHER
                        ? 'Öğretmen'
                        : 'Öğrenci'
                    }
                  />
                  <CCButton
                    onClick={() => handleLogin(user.userName)}
                    variant="outlined"
                  >
                    Bu Kullanıcı olarak giriş yap
                  </CCButton>
                </Stack>
              ))}
            </>
          )}
        </Stack>
      </Stack>
    </Layout>
  );
};

export default Demo;
