import { CircularProgress, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingUserInfo from 'src/Loading/LoadingUserInfo';
import CCButton from 'src/components/common/CCButton';
import Image from 'src/components/common/Image';
import { Link } from 'src/components/common/Link';
import Table, { userColumns } from 'src/components/common/Table';
import ContentLayout from 'src/components/layout/ContentLayout';
import { Layout } from 'src/components/layout/Layout';
import EventUpdateModal from 'src/components/modals/UpdateEventModal';
import { emptyEventData } from 'src/data/emptyData';
import { Routes } from 'src/data/routes';
import {
  eventJoinFetcher,
  eventLeaveFetcher,
  getEventFromIdFetcher,
} from 'src/fetch/eventFetchers';
import { ApprovalStatusEnum, ClubRoleEnum, EventType } from 'src/types/types';
import { getRemoteImage } from 'src/utils/imageUtils';
import { formatDate, isUserLoggedIn } from 'src/utils/utils';

type CommonProps = {
  event: EventType;
  loading: boolean;
};

const EtkinlikActionButton = ({ event }: CommonProps) => {
  const [loadingJoin, setLoadingJoin] = useState(false);
  const [loadingLeave, setLoadingLeave] = useState(false);
  const [openUpdateEventDialog, setOpenUpdateEventDialog] = useState(false);
  const isUserApproved =
    event.userApprovalStatus === ApprovalStatusEnum.APPROVED;
  const isUserClubAdmin = event.club.clubRole === ClubRoleEnum.ADMIN;
  const isLoggedIn = isUserLoggedIn();

  const navigate = useNavigate();

  const handleEventJoin = useCallback(async () => {
    try {
      setLoadingJoin(true);
      const joinResponse = await eventJoinFetcher(event.eventId.toString());
      if (joinResponse.status) {
        navigate(0);
      }
    } catch (error) {
      console.error(error);
    }
  }, [event.eventId, navigate]);

  const handleLeaveEvent = useCallback(async () => {
    try {
      setLoadingLeave(true);
      const leaveResponse = await eventLeaveFetcher(event.eventId.toString());
      if (leaveResponse.status) {
        navigate(0);
      }
    } catch (error) {
      console.error(error);
    }
  }, [event.eventId, navigate]);

  if (isLoggedIn) {
    if (isUserApproved && isUserClubAdmin) {
      return (
        <Stack>
          <EventUpdateModal
            onClose={() => navigate(0)}
            open={openUpdateEventDialog}
            event={event}
          />
          <CCButton
            onClick={() => setOpenUpdateEventDialog(true)}
            variant="contained"
          >
            Etkinliği Düzenle
          </CCButton>
        </Stack>
      );
    } else if (isUserApproved) {
      return (
        <Stack>
          <CCButton
            loading={loadingLeave}
            onClick={handleLeaveEvent}
            variant="contained"
          >
            Etkinlkten ayrıl
          </CCButton>
        </Stack>
      );
    } else if (event.userApprovalStatus === ApprovalStatusEnum.DECLINED) {
      return (
        <Stack>
          <CCButton disabled>Etkinlik başvurunuz reddedildi</CCButton>
        </Stack>
      );
    } else if (event.userApprovalStatus === ApprovalStatusEnum.PENDING) {
      return (
        <Stack>
          <CCButton disabled>Etkinlik başvurunuz onay bekliyor</CCButton>
        </Stack>
      );
    } else {
      return (
        <Stack>
          <CCButton
            onClick={handleEventJoin}
            loading={loadingJoin}
            variant="contained"
          >
            Etkinliğe katıl
          </CCButton>
        </Stack>
      );
    }
  }

  return null;
};

const EtkinlikInfo = ({ event, loading }: CommonProps) => {
  if (loading) {
    return <LoadingUserInfo />;
  }

  return (
    <Stack gap="30px">
      <Stack
        id="upper-content-left"
        justifyContent="center"
        alignItems="center"
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap="30px"
      >
        <Image
          width="150px"
          height="150px"
          src={getRemoteImage(event.image)}
          sx={{
            borderRadius: '20px',
            boxShadow:
              'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
          }}
        />
        <Stack maxWidth="400px" pt={{ xs: '0px', sm: '55px' }}>
          <Typography variant="h4" fontSize={30} color="main" fontWeight={600}>
            {event.name}
          </Typography>
          <Typography variant="h6" color="secondary">
            {event.club.name}
          </Typography>
        </Stack>
      </Stack>
      <EtkinlikActionButton event={event} loading={loading} />
    </Stack>
  );
};

const EtkinlikDuzenleyenKulup = ({ event, loading }: CommonProps) => {
  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Link to={`${Routes.CLUB}/${event.club.clubId}`}>
      <Stack
        id="upper-content-right"
        alignItems="center"
        justifyContent="center"
        gap="6px"
        sx={{
          backgroundColor: '#00AF8E',
          borderRadius: '20px',
          p: '20px',
          color: '#ffffff',
        }}
      >
        <Typography fontWeight={600} textAlign="center">
          Düzenleyen Kulüp
        </Typography>
        <Image
          variant="circular"
          src={getRemoteImage(event.club.image)}
          width="80px"
          height="80px"
        />

        <Typography fontWeight={600} textAlign="center">
          {event.club.name}
        </Typography>
      </Stack>
    </Link>
  );
};

const EtkinlikotherInfo = ({ event, loading }: CommonProps) => {
  if (loading) {
    return <CircularProgress size={50} />;
  }

  return (
    <Stack
      id="middle-content-left"
      alignItems={{ xs: 'center', md: 'flex-start' }}
      textAlign={{ xs: 'center', md: 'left' }}
      gap={2}
      sx={{
        maxWidth: '400px',
      }}
    >
      <Stack>
        <Typography variant="h5">Açıklama</Typography>
        <Typography variant="body2">{event.description}</Typography>
      </Stack>
      <Stack>
        <Typography variant="h5">Tarih</Typography>
        <Typography variant="body2">{formatDate(event.eventDate)}</Typography>
      </Stack>
      <Stack>
        <Typography variant="h5">Yer</Typography>
        <Typography variant="body2">{event.location}</Typography>
      </Stack>
    </Stack>
  );
};

const EtkinlikKatilimcilar = ({ event, loading }: CommonProps) => {
  return (
    <Stack id="middle-content-right">
      <Table
        loading={loading}
        title="Katılımcılar"
        columns={userColumns}
        data={event.users.map((user) => ({
          bolum: user.department.name,
          image: getRemoteImage(user.image),
          name: user.firstName + ' ' + user.lastName,
          role:
            user.clubRole === ClubRoleEnum.ADMIN
              ? 'Kulüp Yöneticisi'
              : user.clubRole === ClubRoleEnum.MEMBER
              ? 'Kulüp Üyesi'
              : 'Katılımcı',
          href: `${Routes.USER}/${user.userId}`,
        }))}
      />
    </Stack>
  );
};

const Etkinlik = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<EventType>(emptyEventData);
  const [loading, setLoading] = useState(true);

  const getEvent = useCallback(async () => {
    try {
      if (!id) return;
      const eventResponse = await getEventFromIdFetcher(id);
      if (eventResponse.status) {
        setEvent(eventResponse.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    getEvent();
  }, [getEvent]);

  return (
    <Layout>
      <ContentLayout
        upperBackgroundImage={getRemoteImage(event.image)}
        upperLeft={<EtkinlikInfo event={event} loading={loading} />}
        upperRight={<EtkinlikDuzenleyenKulup event={event} loading={loading} />}
        middleLeft={<EtkinlikotherInfo event={event} loading={loading} />}
        middleRight={<EtkinlikKatilimcilar event={event} loading={loading} />}
      />
    </Layout>
  );
};

export default Etkinlik;
