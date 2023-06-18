import { Autocomplete, Stack, TextField, Typography } from '@mui/material';
import Image from 'src/components/common/Image';
import { getRemoteImage } from 'src/utils/imageUtils';

type AutocompleteItemType = {
  id: number;
  name: string;
  image: string;
};

type CCAutocompleteProps = {
  options: AutocompleteItemType[];
  onChange: (e: any, value: AutocompleteItemType | null) => void;
};

const CCAutocomplete = ({ options, onChange }: CCAutocompleteProps) => {
  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Seçim"
          name="selection"
          required
          fullWidth
        />
      )}
      onChange={onChange}
      renderOption={(props, option) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { className, ...rest } = props;
        return (
          <Stack
            {...rest}
            flexDirection="row"
            component="li"
            alignItems="flex-start"
            justifyContent="flex-start"
            gap="20px"
            sx={{
              p: '10px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#F5F6F8',
              },
            }}
          >
            <Image
              src={getRemoteImage(option.image)}
              alt={option.name}
              width="30px"
              height="30px"
              variant="circular"
            />
            <Typography
              fontSize={{ xs: '12px', md: '15px' }}
              lineHeight="30px"
              color="#60647E"
            >
              {option.name}
            </Typography>
          </Stack>
        );
      }}
    />
  );
};

export default CCAutocomplete;
