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

export type Column<T> = {
  header: string;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  accessor: keyof T | ((data: T) => React.ReactNode);
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
                  {column.accessor === 'image' ? (
                    <Image
                      src={row[column.accessor] as string}
                      width="30px"
                      height="30px"
                      variant="circular"
                    />
                  ) : typeof column.accessor === 'function' ? (
                    (column.accessor(row) as React.ReactNode)
                  ) : (
                    (row[column.accessor] as React.ReactNode)
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
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
        <TableContent data={data} columns={columns} />
      </Stack>
    </Stack>
  );
};

export default Table;
