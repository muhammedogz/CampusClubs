import {
  ApprovalOutlined,
  CheckCircleOutlined,
  ClosedCaptionOffTwoTone,
  RemoveCircleOutline,
  RemoveCircleOutlineOutlined,
  RemoveShoppingCartTwoTone,
} from '@mui/icons-material';
import {
  CircularProgress,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from 'src/components/common/Image';
import { Link } from 'src/components/common/Link';
import { Layout } from 'src/components/layout/Layout';
import { Routes } from 'src/data/routes';
import {
  NotificationType,
  getNotificationFetcher,
} from 'src/fetch/userFetchers';
import { getRemoteImage } from 'src/utils/imageUtils';
import { StorageKeyEnum, getLocalStorageItem } from 'src/utils/storageUtils';
import { generateRoute } from 'src/utils/urlUtils';
import ZoomOutSharpIcon from '@mui/icons-material/ZoomOutSharp';

type NotificationItemType = {
  id: string;
  name: string;
  image: string;
  link: string;
  type: 'join club' | 'create event' | 'join event';
};

type NotificationItemProps = {
  leftItem: NotificationItemType;
  rightItem: NotificationItemType;
  onClickApprove: (id: string) => void;
  onClickDecline: (id: string) => void;
};

const NotificationItem = ({
  leftItem,
  rightItem,
  onClickApprove,
  onClickDecline,
}: NotificationItemProps) => {
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingDecline, setLoadingDecline] = useState(false);

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      flexDirection={{ xs: 'column', md: 'row' }}
      gap="30px"
    >
      <Link to={leftItem.link}>
        <Stack
          gap="10px"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          <Image
            variant="circular"
            src={getRemoteImage(leftItem.image)}
            width="50px"
            height="50px"
          />
          <Typography fontWeight={700}>{leftItem.name}</Typography>
        </Stack>
      </Link>
      <Link to={rightItem.link}>
        <Stack
          gap="10px"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          <Image
            variant="circular"
            src={getRemoteImage(rightItem.image)}
            width="50px"
            height="50px"
          />
          <Typography fontWeight={700} fontSize="16px">
            {rightItem.name}
          </Typography>
        </Stack>
      </Link>
      <Typography>
        {leftItem.type === 'join club'
          ? 'adlı kulübe katılmak istiyor'
          : leftItem.type === 'join event'
          ? 'adlı etkinliğe katılmak istiyor'
          : 'adlı etkinliği oluşturmak istiyor'}
      </Typography>
      <Stack flexDirection="row" gap="20px">
        <Stack>
          <IconButton
            onClick={() => {
              setLoadingApprove(true);
              onClickApprove(leftItem.id);
            }}
          >
            {loadingApprove ? (
              <CircularProgress />
            ) : (
              <CheckCircleOutlined
                sx={{
                  width: '35px',
                  height: '35px',

                  color: '#1cdd12',
                }}
              />
            )}
          </IconButton>
          <Typography fontWeight={700} fontSize="16px">
            Onayla
          </Typography>
        </Stack>
        <Stack>
          <IconButton
            onClick={() => {
              setLoadingDecline(true);
              onClickDecline(leftItem.id);
            }}
          >
            {loadingDecline ? (
              <CircularProgress />
            ) : (
              <RemoveCircleOutlineOutlined
                sx={{
                  width: '35px',
                  height: '35px',
                  color: '#dd1212',
                }}
              />
            )}
          </IconButton>
          <Typography fontWeight={700} fontSize="16px">
            Reddet
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

const Notifications = () => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType>({
    clubJoinRequest: [],
    eventCreateRequest: [],
    eventJoinRequest: [],
  });
  const navigate = useNavigate();
  const user = getLocalStorageItem(StorageKeyEnum.USER_STORAGE)?.user;
  const userLoggedIn = !!user?.firstName;

  const getNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const notificationResponse = await getNotificationFetcher();
      console.log(notificationResponse);
      if (notificationResponse.status) {
        const response = notificationResponse.data;
        setNotifications(response);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (userLoggedIn) {
      getNotifications();
    }
  }, [getNotifications]);

  useEffect(() => {
    if (!userLoggedIn) {
      navigate(generateRoute(Routes.HOME));
    }
  }, [userLoggedIn, navigate]);

  const totalData =
    notifications.clubJoinRequest.length +
    notifications.eventCreateRequest.length +
    notifications.eventJoinRequest.length;

  return (
    <Layout>
      <Stack gap="20px" pt="60px">
        <Stack>
          <Typography variant="h3" color="primary" textAlign="center">
            Bildirimler
          </Typography>
        </Stack>
        {loading ? (
          <Stack justifyContent="center" alignItems="center" gap="5px">
            <Skeleton width={600} height={50} />
            <Divider />
            <Skeleton width={600} height={50} />
            <Divider />
            <Skeleton width={600} height={50} />
            <Divider />
            <Skeleton width={600} height={50} />
          </Stack>
        ) : totalData === 0 ? (
          <Stack>
            <Stack
              alignContent="center"
              justifyContent="center"
              p="50px"
              gap="20px"
            >
              <Typography
                variant="h6"
                fontWeight={600}
                color="main"
                textAlign="center"
              >
                Bekleyen bir bildiriminiz bulunmamaktadır.
              </Typography>
              <ZoomOutSharpIcon
                color="primary"
                sx={{
                  width: '100px',
                  height: '100px',
                  alignSelf: 'center',
                }}
              />
            </Stack>
          </Stack>
        ) : (
          <Stack gap="30px" justifyContent="center">
            {notifications.clubJoinRequest.length > 0 && (
              <Stack gap="20px">
                <Typography variant="h5" color="primary" textAlign="center">
                  Kulüp Katılım İstekleri
                </Typography>
                {notifications.clubJoinRequest.map((item) => (
                  <>
                    <NotificationItem
                      key={item.club.clubId + item.user.userId}
                      leftItem={{
                        id: item.user.userId.toString(),
                        name: item.user.firstName + ' ' + item.user.lastName,
                        image: item.user.image,
                        type: 'join club',
                        link: `${Routes.USER}/${item.user.userId}`,
                      }}
                      rightItem={{
                        id: item.club.clubId.toString(),
                        name: item.club.name,
                        image: item.club.image,
                        type: 'join club',
                        link: `${Routes.CLUB}/${item.club.clubId}`,
                      }}
                      onClickApprove={(id) => console.log(id)}
                      onClickDecline={(id) => console.log(id)}
                    />
                    <Divider />
                  </>
                ))}
              </Stack>
            )}
            {notifications.eventJoinRequest.length > 0 && (
              <Stack gap="20px">
                <Typography variant="h5" color="primary" textAlign="center">
                  Etkinlik Katılım İstekleri
                </Typography>
                {notifications.eventJoinRequest.map((item) => (
                  <>
                    <NotificationItem
                      key={item.event.eventId + item.user.userId}
                      leftItem={{
                        id: item.user.userId.toString(),
                        name: item.user.firstName + ' ' + item.user.lastName,
                        image: item.user.image,
                        type: 'join event',
                        link: `${Routes.USER}/${item.user.userId}`,
                      }}
                      rightItem={{
                        id: item.event.eventId.toString(),
                        name: item.event.name,
                        image: item.event.image,
                        type: 'join event',
                        link: `${Routes.CLUB}/${item.event.eventId}`,
                      }}
                      onClickApprove={(id) => console.log(id)}
                      onClickDecline={(id) => console.log(id)}
                    />
                    <Divider />
                  </>
                ))}
              </Stack>
            )}
          </Stack>
        )}
      </Stack>
    </Layout>
  );
};

export default Notifications;
