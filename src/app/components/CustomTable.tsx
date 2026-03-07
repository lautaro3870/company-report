import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ANNUAL_EARNINGS, QUEARTERLY_EARNINGS } from '../interface';
import { Box } from '@mui/material';

// Tabla genérica reutilizable
type EarningsRow = {
  fiscalDateEnding: string;
  reportedEPS: string | number;
};

type EarningsTableProps = {
  data: EarningsRow[];
  label: string; // "Año" | "Mes"
};

type CustomTableProps = {
  annualEarnings: ANNUAL_EARNINGS[];
  quarterlyEarnings: QUEARTERLY_EARNINGS[];
};

function EarningsTable({ data, label }: EarningsTableProps) {
  return (
    <TableContainer component={Paper} sx={{ maxWidth: 500, mx: 'auto' }}>
      <Table aria-label={`${label} earnings table`}>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'primary.main' }}>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
              {label}
            </TableCell>
            <TableCell
              align="right"
              sx={{ color: 'white', fontWeight: 'bold' }}
            >
              EPS
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={row.fiscalDateEnding}
              sx={{
                backgroundColor: index % 2 === 0 ? 'grey.50' : 'white',
                '&:last-child td, &:last-child th': { border: 0 },
                '&:hover': {
                  backgroundColor: 'primary.light',
                  cursor: 'pointer',
                },
              }}
            >
              <TableCell>{row.fiscalDateEnding}</TableCell>
              <TableCell align="right">
                <strong>{row.reportedEPS}</strong>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function CustomTable({
  annualEarnings,
  quarterlyEarnings,
}: CustomTableProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
      <EarningsTable data={annualEarnings} label="Año" />
      <EarningsTable data={quarterlyEarnings} label="Mes" />
    </Box>
  );
}
