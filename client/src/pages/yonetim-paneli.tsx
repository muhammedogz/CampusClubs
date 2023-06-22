import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CCButton from 'src/components/common/CCButton';
import ImageNameStack from 'src/components/common/ImageNameStack';
import { Layout } from 'src/components/layout/Layout';
import AddUserClubModal from 'src/components/modals/AddUserClubModal';
import ClubCreateModal from 'src/components/modals/ClubCreateModal';
import RemoveEventModal from 'src/components/modals/RemoveEventModal';
import RemoveUserClubModal from 'src/components/modals/RemoveUserClubModal';
import RemoveUserModal from 'src/components/modals/RemoveUserModal';
import ClubUpdateModal from 'src/components/modals/UpdateClubModal';
import { Routes } from 'src/data/routes';
import { getAllClubsFetcher, removeClubFetcher } from 'src/fetch/clubFetchers';
import { ClubType, UserRoleEnum } from 'src/types/types';
import { StorageKeyEnum, getLocalStorageItem } from 'src/utils/storageUtils';
import { generateRoute } from 'src/utils/urlUtils';

type CommonProps = {
  clubs: ClubType[];
  loading: boolean;
};

const AllClubsEdit = ({ clubs, loading }: CommonProps) => {
  const [openUpdateClubDialog, setOpenUpdateClubDialog] = useState(false);
  const [selectedClub, setSelectedClub] = useState<ClubType | null>(null);
  const navigate = useNavigate();

  return (
    <Stack>
      {selectedClub && (
        <ClubUpdateModal
          onClose={() => {
            navigate(0);
          }}
          open={openUpdateClubDialog}
          club={selectedClub}
        />
      )}
      {loading ? (
        <Stack>
          <CircularProgress
            size={50}
            sx={{
              color: '#78ee11',
            }}
          />
        </Stack>
      ) : (
        <Stack>
          {clubs.map((club) => (
            <Stack key={club.name + club.description}>
              <ImageNameStack
                data={{
                  image: club.image,
                  name: club.name,
                  id: club.clubId,
                }}
              />
              <CCButton
                onClick={() => {
                  setSelectedClub(club);
                  setOpenUpdateClubDialog(true);
                }}
              >
                Bu kulübü düzenle
              </CCButton>
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

const AllClubsAddUser = ({ clubs, loading }: CommonProps) => {
  const [openUpdateClubDialog, setOpenUpdateClubDialog] = useState(false);
  const [selectedClub, setSelectedClub] = useState<ClubType | null>(null);

  const navigate = useNavigate();

  return (
    <Stack>
      {selectedClub && (
        <AddUserClubModal
          onClose={() => {
            navigate(0);
          }}
          open={openUpdateClubDialog}
          clubId={selectedClub.clubId}
        />
      )}
      {loading ? (
        <Stack>
          <CircularProgress
            size={50}
            sx={{
              color: '#78ee11',
            }}
          />
        </Stack>
      ) : (
        <Stack>
          {clubs.map((club) => (
            <Stack key={club.name + club.description}>
              <ImageNameStack
                data={{
                  image: club.image,
                  name: club.name,
                  id: club.clubId,
                }}
              />
              <CCButton
                onClick={() => {
                  setSelectedClub(club);
                  setOpenUpdateClubDialog(true);
                }}
              >
                Bu kulübe kullanıcı ekle
              </CCButton>
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

const AllClubsRemoveUser = ({ clubs, loading }: CommonProps) => {
  const [openRemoveUserDialog, setOpenRemoveUserDialog] = useState(false);
  const [selectedClub, setSelectedClub] = useState<ClubType | null>(null);

  const navigate = useNavigate();

  return (
    <Stack>
      {selectedClub && (
        <RemoveUserClubModal
          onClose={() => {
            navigate(0);
          }}
          open={openRemoveUserDialog}
          clubId={selectedClub.clubId}
        />
      )}
      {loading ? (
        <Stack>
          <CircularProgress
            size={50}
            sx={{
              color: '#78ee11',
            }}
          />
        </Stack>
      ) : (
        <Stack>
          {clubs.map((club) => (
            <Stack key={club.name + club.description}>
              <ImageNameStack
                data={{
                  image: club.image,
                  name: club.name,
                  id: club.clubId,
                }}
              />
              <CCButton
                onClick={() => {
                  setSelectedClub(club);
                  setOpenRemoveUserDialog(true);
                }}
              >
                Bu kulübe kullanıcı ekle
              </CCButton>
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

const RemoveClub = ({ clubs, loading }: CommonProps) => {
  const [loadingRemoveClub, setLoadingRemoveClub] = useState(false);

  const navigate = useNavigate();

  const handleRemoveClub = useCallback(
    async (clubId: number) => {
      try {
        setLoadingRemoveClub(true);
        const response = await removeClubFetcher(clubId);
        if (response.status) {
          navigate(0);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [navigate]
  );

  return (
    <Stack>
      {loading ? (
        <Stack>
          <CircularProgress
            size={50}
            sx={{
              color: '#78ee11',
            }}
          />
        </Stack>
      ) : (
        <Stack>
          {clubs.map((club) => (
            <Stack key={club.name + club.description}>
              <ImageNameStack
                data={{
                  image: club.image,
                  name: club.name,
                  id: club.clubId,
                }}
              />
              <CCButton
                loading={loadingRemoveClub}
                onClick={() => {
                  handleRemoveClub(club.clubId);
                }}
              >
                Bu kulübü sil
              </CCButton>
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

const Panel = () => {
  const [openCreateClubDialog, setOpenCreateClubDialog] = useState(false);
  const [openRemoveEventDialog, setOpenRemoveEventDialog] = useState(false);
  const [openRemoveUserDialog, setOpenRemoveUserDialog] = useState(false);

  const user = getLocalStorageItem(StorageKeyEnum.USER_STORAGE)?.user;
  const userLoggedIn = !!user?.firstName;

  const navigate = useNavigate();

  const [clubs, setClubs] = useState<ClubType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const getAllClubs = useCallback(async () => {
    try {
      setLoading(true);
      const clubsRespone = await getAllClubsFetcher();
      if (clubsRespone.status) {
        setClubs(clubsRespone.data);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getAllClubs();
  }, [getAllClubs]);

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
        <Stack
          gap="20px"
          justifyContent="center"
          alignItems="center"
          sx={{
            backgroundColor: '#ec68689d',
            p: '50px',
            borderRadius: '10px',
            boxShadow: '0px 0px 10px 0px #000000',
            '& > *': {
              minWidth: { xs: '300px', md: '700px' },
            },
          }}
        >
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
          <Stack>
            <Accordion>
              <AccordionSummary
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography>Kulüpleri düzenle</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <AllClubsEdit clubs={clubs} loading={loading} />
              </AccordionDetails>
            </Accordion>
          </Stack>
          <Stack>
            <Accordion>
              <AccordionSummary
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography>Kulüplere kullanıcı ekle</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <AllClubsAddUser clubs={clubs} loading={loading} />
              </AccordionDetails>
            </Accordion>
          </Stack>
          <Stack>
            <Accordion>
              <AccordionSummary
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography>Kulüplerden Kullanıcı Çıkar</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <AllClubsRemoveUser clubs={clubs} loading={loading} />
              </AccordionDetails>
            </Accordion>
          </Stack>
          <Stack>
            <Accordion>
              <AccordionSummary
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography>Kulüp sil</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <RemoveClub clubs={clubs} loading={loading} />
              </AccordionDetails>
            </Accordion>
          </Stack>
          <Stack>
            {openRemoveEventDialog && (
              <RemoveEventModal
                onClose={() => {
                  navigate(0);
                }}
                open={openRemoveEventDialog}
              />
            )}
            <CCButton
              variant="contained"
              onClick={() => {
                setOpenRemoveEventDialog(true);
              }}
            >
              Etkinlik Sil
            </CCButton>
          </Stack>
          <Stack>
            {openRemoveUserDialog && (
              <RemoveUserModal
                onClose={() => {
                  navigate(0);
                }}
                open={openRemoveUserDialog}
              />
            )}
            <CCButton
              variant="contained"
              onClick={() => {
                setOpenRemoveUserDialog(true);
              }}
            >
              Üye Sil
            </CCButton>
          </Stack>
        </Stack>
      </Stack>
    </Layout>
  );
};

export default Panel;
