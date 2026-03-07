import { Typography } from '@mui/material';
import { ReportProps } from '../interface';

type CustomListPrps = {
  report: ReportProps;
};

export default function CustomList({ report }: CustomListPrps) {
  const _getMultiplier = () => {
    const multipliers: Record<string, string> = {
      '0': '0',
      low: '2.75',
      high: '3.25',
    };

    if (report.Beta === 0) return multipliers['0'];
    return report.Beta <= 1.95 ? multipliers['low'] : multipliers['high'];
  };

  return (
    <div>
      <Typography variant="body1">{report.Description}</Typography>
      <br />
      <div
        style={{
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <Typography variant="h5">
          BPA compuesto últimos 5 años (4 periodos): {report.fiveYearsValue}%
        </Typography>
        <Typography variant="h5">
          Incremento BPA del último año: {report.lastYearValue}%
        </Typography>
        <Typography variant="h5">PER: {report.PER}</Typography>
        <Typography variant="h5">
          PEG histórico: {report.historicalPEG}
        </Typography>
        <Typography variant="h5">
          PEG último año: {report.lastYearPEG}
        </Typography>
        <Typography variant="h5">PEG futuro: {report.fowardPEG}</Typography>
        <Typography variant="h5">BETA: {report.Beta}</Typography>
        <Typography variant="h5">Multiplicador: {_getMultiplier()}</Typography>
      </div>
    </div>
  );
}
