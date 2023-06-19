import {
  CheckCircleOutlined,
  RemoveCircleOutlineOutlined,
} from '@mui/icons-material';
import ZoomOutSharpIcon from '@mui/icons-material/ZoomOutSharp';
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
import { considerJoinClubFetcher } from 'src/fetch/clubFetchers';
import {
  considerCreateEventFetcher,
  considerJoinEventFetcher,
} from 'src/fetch/eventFetchers';
import {
  NotificationType,
  getNotificationFetcher,
} from 'src/fetch/userFetchers';
import { ApprovalStatusEnum } from 'src/types/types';
import { getRemoteImage } from 'src/utils/imageUtils';
import { StorageKeyEnum, getLocalStorageItem } from 'src/utils/storageUtils';
import { generateRoute } from 'src/utils/urlUtils';
type NotificationItemType = {
  id: string;
  name: string;
  image: string;
  link: string;
  type: 'join club' | 'create event' | 'join event';
};

type OnClickParamType = {
  leftId: string;
  rightId: string;
};

type NotificationItemProps = {
  leftItem: NotificationItemType;
  rightItem: NotificationItemType;
  onClickApprove: () => void;
  onClickDecline: () => void;
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
              onClickApprove();
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
              onClickDecline();
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
      if (notificationResponse.status) {
        const response = notificationResponse.data;
        setNotifications(response);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const considerJoiningClubRequest = useCallback(
    async (
      { leftId: userId, rightId: clubId }: OnClickParamType,
      status: ApprovalStatusEnum
    ) => {
      try {
        const requestResponse = await considerJoinClubFetcher({
          approveStatus: status,
          clubId,
          userId,
        });

        if (requestResponse.status) {
          navigate(0);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [navigate]
  );

  const considerJoinEventRequest = useCallback(
    async (
      { leftId: userId, rightId: eventId }: OnClickParamType,
      status: ApprovalStatusEnum
    ) => {
      try {
        const requestResponse = await considerJoinEventFetcher({
          approveStatus: status,
          eventId,
          userId,
        });
        if (requestResponse.status) {
          navigate(0);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [navigate]
  );

  const considerCreateEventRequest = useCallback(
    async (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      { leftId: clubId, rightId: eventId }: OnClickParamType,
      status: ApprovalStatusEnum
    ) => {
      try {
        const requestResponse = await considerCreateEventFetcher({
          approveStatus: status,
          eventId,
        });
        if (requestResponse.status) {
          navigate(0);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (userLoggedIn) {
      getNotifications();
    }
  }, [getNotifications, userLoggedIn]);

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
                      onClickApprove={async () => {
                        await considerJoiningClubRequest(
                          {
                            leftId: item.user.userId.toString(),
                            rightId: item.club.clubId.toString(),
                          },
                          ApprovalStatusEnum.APPROVED
                        );
                      }}
                      onClickDecline={async () => {
                        await considerJoiningClubRequest(
                          {
                            leftId: item.user.userId.toString(),
                            rightId: item.club.clubId.toString(),
                          },
                          ApprovalStatusEnum.DECLINED
                        );
                      }}
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
                        link: `${Routes.EVENT}/${item.event.eventId}`,
                      }}
                      onClickApprove={async () => {
                        await considerJoinEventRequest(
                          {
                            leftId: item.user.userId.toString(),
                            rightId: item.event.eventId.toString(),
                          },
                          ApprovalStatusEnum.APPROVED
                        );
                      }}
                      onClickDecline={async () => {
                        await considerJoinEventRequest(
                          {
                            leftId: item.user.userId.toString(),
                            rightId: item.event.eventId.toString(),
                          },
                          ApprovalStatusEnum.DECLINED
                        );
                      }}
                    />
                    <Divider />
                  </>
                ))}
              </Stack>
            )}
            {notifications.eventCreateRequest.length > 0 && (
              <Stack gap="20px">
                <Typography variant="h5" color="primary" textAlign="center">
                  Etkinlik Oluşturma İstekleri
                </Typography>
                {notifications.eventCreateRequest.map((item) => (
                  <>
                    <NotificationItem
                      key={item.event.eventId + item.club.clubId}
                      leftItem={{
                        id: item.club.clubId.toString(),
                        name: item.club.name,
                        image: item.club.image,
                        type: 'create event',
                        link: `${Routes.CLUB}/${item.club.clubId}`,
                      }}
                      rightItem={{
                        id: item.event.eventId.toString(),
                        name: item.event.name,
                        image: item.event.image,
                        type: 'create event',
                        link: `${Routes.CLUB}/${item.event.eventId}`,
                      }}
                      onClickApprove={async () => {
                        await considerCreateEventRequest(
                          {
                            leftId: item.club.clubId.toString(),
                            rightId: item.event.eventId.toString(),
                          },
                          ApprovalStatusEnum.APPROVED
                        );
                      }}
                      onClickDecline={async () => {
                        await considerCreateEventRequest(
                          {
                            leftId: item.club.clubId.toString(),
                            rightId: item.event.eventId.toString(),
                          },
                          ApprovalStatusEnum.DECLINED
                        );
                      }}
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
