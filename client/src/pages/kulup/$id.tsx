import {
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import Image from 'src/components/common/Image';
import { Link } from 'src/components/common/Link';
import { kulupler } from 'src/data/kulupler';
import { Routes } from 'src/data/routes';
import { Layout } from '../../components/layout/Layout';

type KulupContentProps = {
  kulup: any;
};

const KulupContent = ({ kulup }: KulupContentProps) => {
  return (
    <Stack
      id="kulup-bilgileri"
      flex={1}
      mt="160px"
      zIndex={2}
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent="space-between"
      alignItems="center"
      gap="20px"
      textAlign={{ xs: 'center', md: 'initial' }}
    >
      <Stack
        justifyContent="center"
        alignItems="center"
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap="30px"
      >
        <Image
          width="150px"
          height="150px"
          src={kulup.logo}
          sx={{
            borderRadius: '20px',
            boxShadow:
              'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
          }}
        />
        <Stack maxWidth="400px" pt={{ xs: '0px', sm: '55px' }}>
          <Typography variant="h4" fontSize={30} color="main" fontWeight={600}>
            {kulup.name}
          </Typography>
          <Typography variant="h6" color="secondary">
            @{kulup.username}
          </Typography>
          <Typography variant="h6">{kulup.description}</Typography>
        </Stack>
      </Stack>
      <Stack
        justifyContent="center"
        gap="6px"
        sx={{
          backgroundColor: '#00AF8E',
          opacity: 0.8,
          borderRadius: '20px',
          p: '20px',
          color: '#ffffff',
        }}
      >
        <Link to={`${Routes.DANISMAN}/yusufsinanakgul`}>
          <Stack
            flexDirection="row"
            gap="10px"
            alignItems="center"
            justifyContent="center"
            sx={{
              textAlign: 'center',
              backgroundColor: '#6F7788',
              p: '4px',
              borderRadius: '20px',
            }}
          >
            <Typography fontWeight={600}>
              Danışman: Yusuf Sinan Akgül
            </Typography>
            <Image
              variant="circular"
              src="https://abl.gtu.edu.tr/resimler/104/t_10416.jpg?"
              width="30px"
              height="30px"
            />
          </Stack>
        </Link>
        <Typography fontWeight={600}>
          Kulüp Türü: Teknoloji, Yazılım, Bilgisayar
        </Typography>
        <Typography fontWeight={600}>Üye sayısı: 200+</Typography>
      </Stack>
    </Stack>
  );
};

const KulupEtkinlikleri = () => {
  return (
    <Stack id="kulup-etkinlikleri">
      <Typography variant="h4" fontWeight={600} color="main">
        Etkinlikler
      </Typography>
      <Divider />
      <Stack
        sx={{
          maxWidth: 500,
        }}
      >
        <TableContainer component={Paper}>
          <Table size="small" aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Etkinlik Adı</TableCell>
                <TableCell align="right">Tarih</TableCell>
                <TableCell align="right">Yer</TableCell>
                <TableCell align="right">Tür</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Geekday 2021
                </TableCell>
                <TableCell align="right">Mayıs 2021</TableCell>
                <TableCell align="right">Online -Youtube- </TableCell>
                <TableCell align="right">Workshop</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Stack>
  );
};

const Kulup = () => {
  const { id } = useParams();

  const tumKulupler = kulupler;
  const desiredKulup = tumKulupler.find((kulup) => kulup.username === id);

  if (!desiredKulup) return <Layout>404</Layout>;

  return (
    <Layout>
      <Stack
        px="20px"
        gap="20px"
      >
        <Stack
          id="upper-background"
          sx={{
            zIndex: -1,
            position: 'absolute',
            left: 0,
            right: 0,
            width: '100%',
            backgroundImage: `url(${desiredKulup.logo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(20px)',

            height: '200px',
          }}
        />
        <KulupContent kulup={desiredKulup} />
        <Stack
          id="kulup-etkinlikleri-uyeleri"
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          gap="40px"
        >
          <KulupEtkinlikleri />
          <KulupEtkinlikleri />
        </Stack>
      </Stack>
    </Layout>
  );
};

export default Kulup;
