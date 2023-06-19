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
import ClubUpdateModal from 'src/components/modals/UpdateClubModal';
import { Routes } from 'src/data/routes';
import { getAllClubsFetcher } from 'src/fetch/clubFetchers';
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

const Panel = () => {
  const [openCreateClubDialog, setOpenCreateClubDialog] = useState(false);
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
              <Typography>Kulüplere kullanıcı ekkle</Typography>
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
              <AllClubsAddUser clubs={clubs} loading={loading} />
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Stack>
    </Layout>
  );
};

export default Panel;
