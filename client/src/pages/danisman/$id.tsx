import { Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import Image from 'src/components/common/Image';
import Table, { Column } from 'src/components/common/Table';
import ContentLayout from 'src/components/layout/ContentLayout';
import { Routes } from 'src/data/routes';
import { DanismanType, KulupType } from 'src/types/types';
import { Layout } from '../../components/layout/Layout';

const kulupColumns: Column<KulupType>[] = [
  { header: ' ', accessor: 'image', align: 'center' },
  { header: 'Kulüp Adı', accessor: 'name' },
  { header: 'Kulüp Açıklaması', accessor: 'description' },
];

type CommonProps = {
  danisman: DanismanType;
};

const DanismanInfo = ({ danisman }: CommonProps) => {
  return (
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
        src={danisman.image}
        sx={{
          borderRadius: '20px',
          boxShadow:
            'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
        }}
      />
      <Stack maxWidth="400px" pt={{ xs: '0px', sm: '55px' }}>
        <Typography variant="h4" fontSize={30} color="main" fontWeight={600}>
          {danisman.name}
        </Typography>
        <Typography variant="h6" color="secondary">
          @{danisman.slug}
        </Typography>
        <Typography variant="h6">{danisman.depertman}</Typography>
      </Stack>
    </Stack>
  );
};

type DanismanKulupler = {
  kulupler: KulupType[];
};

const DanismanKulupler = ({ kulupler }: DanismanKulupler) => {
  return (
    <Stack id="middle-content-right">
      <Table
        fullWidth
        title="Danışmanı Olunan Kulupler"
        data={kulupler.map((kulup) => ({
          ...kulup,
          slug: `${Routes.KULUP}/${kulup.slug}`,
        }))}
        columns={kulupColumns}
      />
    </Stack>
  );
};

const Danisman = () => {
  const { id } = useParams();

  const tumDanismanlar = danismanlar;
  const bulunanDanisman = tumDanismanlar.find(
    (danisman) => danisman.slug === id
  );

  if (!bulunanDanisman) return <Layout>404</Layout>;

  return (
    <Layout>
      <ContentLayout
        upperLeft={<DanismanInfo danisman={bulunanDanisman} />}
        upperRight={<Stack> </Stack>}
        middleLeft={<DanismanKulupler kulupler={kulupler} />}
        middleRight={<Stack></Stack>}
      />
    </Layout>
  );
};

export default Danisman;
