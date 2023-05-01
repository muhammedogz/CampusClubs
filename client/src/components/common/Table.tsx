import ZoomOutSharpIcon from '@mui/icons-material/ZoomOutSharp';
import {
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

export type Column<T> = {
  header: string;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  accessor: keyof T | ((data: T) => React.ReactNode);
  slug?: string;
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

  const slug = (data as any)?.slug;

  return slug ? (
    <Link to={slug}>
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
        Henüz bir data bulunmamaktadır.
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

type TableProps<T> = TableContentProps<T> & {
  title: string;
  tableDivSx?: SxProps;
  fullWidth?: boolean;
};

const Table = <T,>({
  data,
  columns,
  title,
  tableDivSx,
  fullWidth,
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
        {data.length === 0 ? (
          <EmptyTable />
        ) : (
          <TableContent data={data} columns={columns} />
        )}
      </Stack>
    </Stack>
  );
};

export default Table;
