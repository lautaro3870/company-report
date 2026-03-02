'use client';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { use, useState } from 'react';
import { COMPANY_DATA } from './interface';
import { COMPANY_INFO, DATA } from './constant';

type ReportProps = {
  fiveYearsValue: number;
  lastYearValue: number;
  historicalPEG: number;
  lastYearPEG: number;
  fowardPEG: number;
  PER: number;
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [simbol, setSimbol] = useState('');
  const [error, setError] = useState(false);
  const [report, setReport] = useState<ReportProps>({
    fiveYearsValue: 0,
    lastYearValue: 0,
    fowardPEG: 0,
    historicalPEG: 0,
    lastYearPEG: 0,
    PER: 0,
  });

  const calculateCAGR = (data: any, years: number, field: any) => {
    const ratio = data[0].reportedEPS / data[data.length - 1].reportedEPS;
    const cagr = (Math.pow(ratio, 1 / years) - 1) * 100;

    setReport((prev) => ({
      ...prev,
      [field]: Number(cagr.toFixed(2)),
    }));
    if (years === 4) {
      return Number(cagr.toFixed(2));
    }
  };

  const calculatePEG = (data: any, cagr: number) => {
    const historicalPEG = (Number(data?.PERatio) / cagr).toFixed(2);
    setReport((prev) => ({
      ...prev,
      historicalPEG: Number(historicalPEG),
      PER: Number(data?.PERatio),
      lastYearPEG: Number((Number(data?.PERatio) / Number(data?.PEGRatio)).toFixed(2)),
      fowardPEG: Number(data?.PEGRatio)
    }));
  };

  const _makeFetchCall = async () => {
    setIsLoading(true);
    if (process.env.NEXT_PUBLIC_ENVIROMENT === 'prod') {
      const url1 = `https://www.alphavantage.co/query?function=EARNINGS&symbol=${simbol}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`;
      const url2 = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${simbol}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`;

      const response1 = await fetch(url1);
      const response2 = await fetch(url2);
      setIsLoading(false);

      return {
        historicalData: (await response1.json()) as COMPANY_DATA,
        companyInfo: await response2.json(),
      };
    } else {
      setIsLoading(false);
      return {
        historicalData: DATA,
        companyInfo: COMPANY_INFO,
      };
    }
  };

  const getCompanyReport = async () => {
    if (!simbol) {
      setError(true);
      return;
    }

    const { companyInfo, historicalData } = await _makeFetchCall();

    setError(!Object.keys(historicalData).length);

    if (Object.keys(historicalData).length) {
      const carg = calculateCAGR(
        historicalData.annualEarnings.slice(0, 5),
        4,
        'fiveYearsValue',
      );
      calculateCAGR(
        historicalData.quarterlyEarnings.slice(0, 5),
        1,
        'lastYearValue',
      );
      calculatePEG(companyInfo, carg || 1);
    }
  };

  return (
    <div>
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '5rem',
          marginBottom: '1rem',
          gap: 3,
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Simbolo"
          error={error}
          value={simbol}
          onChange={(e) => {
            setError(false);
            setSimbol(e.target.value.toUpperCase());
          }}
          label={error ? 'Simbolo incorrecto' : ''}
        />{' '}
        <Button variant="contained" onClick={getCompanyReport}>
          Buscar
        </Button>
      </Container>
      <Container>
        <hr />
      </Container>
      <Container>
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '50vh',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              marginLeft: {
                lg: '5rem',
              },
            }}
          >
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
                  BPA compuesto últimos 5 años (4 periodos):{' '}
                  {report.fiveYearsValue}%
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
                <Typography variant="h5">
                  PEG futuro: {report.fowardPEG}
                </Typography>
              </li>
            </ul>
          </Box>
        )}
      </Container>
    </div>
  );
}
