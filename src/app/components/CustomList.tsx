import { Typography } from '@mui/material';
import { ReportProps } from '../interface';

type CustomListPrps = {
  report: ReportProps;
};

export default function CustomList({ report }: CustomListPrps) {
  return (
    <ul
      style={{
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <li>
        <Typography variant="h5">
          BPA compuesto últimos 5 años (4 periodos): {report.fiveYearsValue}%
        </Typography>
      </li>
      <li>
        <Typography variant="h5">
          Incremento BPA del último año: {report.lastYearValue}%
        </Typography>
      </li>
      <li>
        <Typography variant="h5">PER: {report.PER}</Typography>
      </li>
      <li>
        <Typography variant="h5">
          PEG histórico: {report.historicalPEG}
        </Typography>
      </li>
      <li>
        <Typography variant="h5">
          PEG último año: {report.lastYearPEG}
        </Typography>
      </li>
      <li>
        <Typography variant="h5">PEG futuro: {report.fowardPEG}</Typography>
      </li>
    </ul>
  );
}
