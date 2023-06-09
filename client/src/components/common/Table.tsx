import ZoomOutSharpIcon from '@mui/icons-material/ZoomOutSharp';
import {
  CircularProgress,
  Divider,
  Table as MuiTable,
  Paper,
  Stack,
  SxProps,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import Image from 'src/components/common/Image';
import { Link } from 'src/components/common/Link';
import { AnnouncementType, ClubBaseType, EventBaseType } from 'src/types/types';

export type Column<T> = {
  header: string;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  accessor: keyof T | ((data: T) => React.ReactNode);
  href?: string;
};

type TableContentColumnContentProps<T> = {
  column: Column<T>;
  data: T;
};

const TableContentColumnContent = <T,>({
  column,
  data,
}: TableContentColumnContentProps<T>) => {
  const Content = () => {
    return (
      <>
        {column.accessor === 'image' ? (
          <Image
            src={data[column.accessor] as string}
            width="30px"
            height="30px"
            variant="circular"
          />
        ) : typeof column.accessor === 'function' ? (
          (column.accessor(data) as React.ReactNode)
        ) : (
          (data[column.accessor] as React.ReactNode)
        )}
      </>
    );
  };

  const href = (data as any)?.href;

  return href ? (
    <Link to={href}>
      <Content />
    </Link>
  ) : (
    <Content />
  );
};

type TableContentProps<T> = {
  data: T[];
  columns: Column<T>[];
};

const TableContent = <T,>({ data, columns }: TableContentProps<T>) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: '400px',
      }}
    >
      <MuiTable stickyHeader size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index} align={column.align || 'left'}>
                {column.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell
                  key={colIndex}
                  align={column.align || 'left'}
                  component={colIndex === 0 ? 'th' : undefined}
                  scope={colIndex === 0 ? 'row' : undefined}
                >
                  <TableContentColumnContent column={column} data={row} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

const EmptyTable = () => {
  return (
    <Stack alignContent="center" justifyContent="center" p="50px" gap="20px">
      <Typography variant="h6" fontWeight={600} color="main" textAlign="center">
        Henüz bir veri bulunmamaktadır.
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
  );
};

const LoadingTable = () => {
  return (
    <Stack alignContent="center" justifyContent="center" p="50px" gap="20px">
      <Typography variant="h6" fontWeight={600} color="main" textAlign="center">
        Yükleniyor...
      </Typography>
      <CircularProgress
        color="primary"
        sx={{
          width: '100px',
          height: '100px',
          alignSelf: 'center',
        }}
      />
    </Stack>
  );
};

type TableProps<T> = TableContentProps<T> & {
  title: string;
  tableDivSx?: SxProps;
  fullWidth?: boolean;
  loading?: boolean;
};

const Table = <T,>({
  data,
  columns,
  title,
  tableDivSx,
  fullWidth,
  loading,
}: TableProps<T>) => {
  return (
    <Stack id="table-wrapper">
      <Typography variant="h4" fontWeight={600} color="main">
        {title}
      </Typography>
      <Divider />
      <Stack
        id="table-div"
        sx={{
          maxWidth: {
            xs: `calc(100vw - 100px)`,
            md: `calc(54vw - 200px)`,
          },
          width: fullWidth
            ? { xs: 'calc(100vw - 100px)', md: 'calc(54vw - 200px)' }
            : undefined,
          ...tableDivSx,
        }}
      >
        {loading ? (
          <LoadingTable />
        ) : data.length === 0 ? (
          <EmptyTable />
        ) : (
          <TableContent data={data} columns={columns} />
        )}
      </Stack>
    </Stack>
  );
};

type UyeColumnType = {
  image: string;
  name: string;
  bolum: string;
  role: string;
};

export const userColumns: Column<UyeColumnType>[] = [
  { header: ' ', accessor: 'image', align: 'center' },
  { header: 'Üye Adı', accessor: 'name' },
  { header: 'Bölüm', accessor: 'bolum' },
  { header: 'Rol', accessor: 'role' },
];

export const eventColumns: Column<EventBaseType>[] = [
  { header: ' ', accessor: 'image', align: 'center' },
  { header: 'Etkinlik Adı', accessor: 'name' },
  { header: 'Tarih', accessor: 'eventDate', align: 'center' },
  { header: 'Yer', accessor: 'location', align: 'center' },
];

export const announcementColumns: Column<AnnouncementType>[] = [
  { header: 'Duyuru Başlığı', accessor: 'title' },
  { header: 'Duyuru Açıklaması', accessor: 'description' },
  { header: 'Duyuru Tarihi', accessor: 'date' },
];

export const clubColumns: Column<ClubBaseType>[] = [
  { header: ' ', accessor: 'image', align: 'center' },
  { header: 'Kulüp Adı', accessor: 'name' },
  { header: 'Kulüp Açıklaması', accessor: 'description' },
];

export default Table;
