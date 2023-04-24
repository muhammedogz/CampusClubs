import { Stack, Typography } from '@mui/material';
import { TaggedContentCard } from 'react-ui-cards';
import { Layout } from 'src/components/layout/Layout';
import { kulupler } from 'src/data/kulupler';

const index = () => {
  return (
    <Layout>
      <Stack>
        <Typography variant="h1">Kulüpler</Typography>
      </Stack>
      <Stack flexDirection="row" gap="20px" flexWrap="wrap">
        {kulupler.map((kulup) => (
          <TaggedContentCard
            key={kulup.id}
            description={kulup.description}
            title={kulup.name}
            href={kulup.link}
            tags={['Kulüp']}
            thumbnail={kulup.logo}
          />
        ))}
        {kulupler.map((kulup) => (
          <TaggedContentCard
            key={kulup.id}
            description={kulup.description}
            title={kulup.name}
            href={kulup.link}
            tags={['Kulüp']}
            thumbnail={kulup.logo}
          />
        ))}
        {kulupler.map((kulup) => (
          <TaggedContentCard
            key={kulup.id}
            description={kulup.description}
            title={kulup.name}
            href={kulup.link}
            tags={['Kulüp']}
            thumbnail={kulup.logo}
          />
        ))}{' '}
        {kulupler.map((kulup) => (
          <TaggedContentCard
            key={kulup.id}
            description={kulup.description}
            title={kulup.name}
            href={kulup.link}
            tags={['Kulüp']}
            thumbnail={kulup.logo}
          />
        ))}{' '}
        {kulupler.map((kulup) => (
          <TaggedContentCard
            key={kulup.id}
            description={kulup.description}
            title={kulup.name}
            href={kulup.link}
            tags={['Kulüp']}
            thumbnail={kulup.logo}
          />
        ))}{' '}
        {kulupler.map((kulup) => (
          <TaggedContentCard
            key={kulup.id}
            description={kulup.description}
            title={kulup.name}
            href={kulup.link}
            tags={['Kulüp']}
            thumbnail={kulup.logo}
          />
        ))}{' '}
        {kulupler.map((kulup) => (
          <TaggedContentCard
            key={kulup.id}
            description={kulup.description}
            title={kulup.name}
            href={kulup.link}
            tags={['Kulüp']}
            thumbnail={kulup.logo}
          />
        ))}
      </Stack>
    </Layout>
  );
};

export default index;
