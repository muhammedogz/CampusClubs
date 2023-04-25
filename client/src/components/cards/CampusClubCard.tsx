import {
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Image from 'src/components/common/Image';
import { Link } from 'src/components/common/Link';

type CampusClubCardProps = {
  image: string;
  title: string;
  description: string;
  link: string;
};

const CampusClubCard = ({
  title,
  description,
  image,
  link,
}: CampusClubCardProps) => {
  const isMobile = useMediaQuery(useTheme().breakpoints.down('md'));

  return (
    <Link to={link}>
      <Stack
        id="kulup-kart"
        key={`${title}-${description}`}
        sx={{
          position: 'relative',
          zIndex: 1,
          '&:after': {
            content: '""',
            zIndex: -1,
            position: 'absolute',
            inset: '1px',
            filter: 'blur(20px)',
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '10px',
          },

          backgroundColor: (theme) => theme.palette.primary.main,
          color: '#ffffff',
          // px: '20px',
          pt: '20px',

          boxShadow:
            'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px',
          borderRadius: '10px',
          width: { xs: '250px', md: '350px' },
        }}
      >
        <Stack gap="30px">
          <Stack justifyContent="center" alignItems="center">
            <Image
              src={image}
              alt={title}
              width={isMobile ? '150px' : '200px'}
              height={isMobile ? '100px' : '150px'}
              sx={{
                boxShadow:
                  'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
              }}
            />
          </Stack>
          <Stack
            gap="8px"
            pb="20px"
            sx={{
              backgroundColor: '#1c070769',
              borderBottomRightRadius: '10px',
              borderBottomLeftRadius: '10px',
            }}
          >
            <Divider color="#d9d9d9" />
            <Stack px="14px">
              <Typography>{title}</Typography>
              <Typography
                fontWeight={300}
                sx={{
                  opacity: 0.8,
                }}
              >
                {description}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Link>
  );
};

export default CampusClubCard;
