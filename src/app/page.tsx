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
import { DATA } from './constant';

type ReportProps = {
  fiveYearsValue: number;
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [simbol, setSimbol] = useState('');
  const [error, setError] = useState(false);
  const [report, setReport] = useState<ReportProps>({ fiveYearsValue: 0 });

  const calculationOfLastFiveYearsCAGR = (data: any) => {
    const result = data[0].reportedEPS / data[data.length - 1].reportedEPS;
    const result2 = Math.pow(result, 0.25);
    const final = (result2 - 1) * 100;
    setReport((prev) => ({
      ...prev,
      fiveYearsValue: Number(final.toFixed(2)),
    }));
  };

  const _makeFetchCall = async () => {
    setIsLoading(true);
    if (process.env.ENVIROMENT === 'prod') {
      const url = `https://www.alphavantage.co/query?function=EARNINGS&symbol=${simbol}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`;
      const response = await fetch(url);
      setIsLoading(false);
      return (await response.json()) as COMPANY_DATA;
    } else {
      setIsLoading(false);
      return DATA;
    }
  };

  const getCompanyReport = async () => {
    const data = await _makeFetchCall();
    setError(!Object.keys(data).length);

    if (Object.keys(data).length) {
      calculationOfLastFiveYearsCAGR(data.annualEarnings.slice(0, 5));
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
          onChange={(e) => {
            setError(false);
            setSimbol(e.target.value);
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
                  Incremento BPA del último año: 10%
                </Typography>
              </li>
              <li>
                <Typography variant="h5">PER: 22,5</Typography>
              </li>
              <li>
                <Typography variant="h5">PEG: 34</Typography>
              </li>
            </ul>
          </Box>
        )}
      </Container>
    </div>
  );
}
