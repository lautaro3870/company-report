'use client';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import {
  ANNUAL_EARNINGS,
  COMPANY_DATA,
  QUEARTERLY_EARNINGS,
  ReportProps,
} from './interface';
import { COMPANY_INFO, DATA } from './constant';
import CustomTable from './components/CustomTable';
import CustomList from './components/CustomList';
import ClearIcon from '@mui/icons-material/Clear';
import Swal from 'sweetalert2';

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
    Beta: 0,
    Description: '',
  });
  const [annualEarnings, setAnnualEarnings] = useState<ANNUAL_EARNINGS[]>([]);
  const [quarterlyEarnings, setQuarterlyEarnings] = useState<
    QUEARTERLY_EARNINGS[]
  >([]);

  const calculateCAGR = (data: any, years: number, field: any) => {
    const ratio = data[0].reportedEPS / data[data.length - 1].reportedEPS;
    const cagr = (Math.pow(ratio, 1 / years) - 1) * 100;

    setReport((prev) => ({
      ...prev,
      [field]: Number(cagr.toFixed(2)),
    }));
    return Number(cagr.toFixed(2));
  };

  const calculatePEG = (
    data: any,
    fiveYearsCarg: number,
    lastYearValue: number,
  ) => {
    const historicalPEG = (Number(data?.PERatio) / fiveYearsCarg).toFixed(2);
    setReport((prev) => ({
      ...prev,
      historicalPEG: Number(historicalPEG),
      PER: Number(data?.PERatio),
      lastYearPEG: Number(
        (Number(data?.PERatio) / Number(lastYearValue)).toFixed(2),
      ),
      fowardPEG: Number(data?.PEGRatio),
      Beta: Number(data?.Beta),
      Description: data?.Description,
    }));
  };

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const _makeFetchCall = async () => {
    setIsLoading(true);
    if (process.env.NEXT_PUBLIC_ENVIROMENT === 'prod') {
      const url1 = `https://www.alphavantage.co/query?function=EARNINGS&symbol=${simbol}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`;
      const url2 = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${simbol}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`;

      const response1 = await fetch(url1);
      const data1 = await response1.json();

      if (data1?.Information) {
        Swal.fire(
          'Se alcanzó el limite de peticiones por día. Esperar hasta mañana',
        );
      }
      await sleep(1600);
      const response2 = await fetch(url2);
      setIsLoading(false);

      return {
        historicalData: data1 as COMPANY_DATA,
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

    const filteredHistoricalData = historicalData.annualEarnings.filter(
      (data: ANNUAL_EARNINGS) =>
        !data.fiscalDateEnding.includes(new Date().getFullYear().toString()),
    );

    setError(!Object.keys(filteredHistoricalData).length);

    if (Object.keys(filteredHistoricalData).length) {
      setAnnualEarnings(filteredHistoricalData.slice(0, 5));
      const fiveYearsCarg = calculateCAGR(
        filteredHistoricalData.slice(0, 5),
        4,
        'fiveYearsValue',
      );
      setQuarterlyEarnings(historicalData.quarterlyEarnings.slice(0, 5));
      const lastYearCarg = calculateCAGR(
        historicalData.quarterlyEarnings.slice(0, 5),
        1,
        'lastYearValue',
      );
      calculatePEG(companyInfo, fiveYearsCarg || 1, lastYearCarg || 1);
    }
  };

  return (
    <div>
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '2rem',
          marginBottom: '1rem',
          gap: 3,
        }}
      >
        <TextField
          id="simbol"
          variant="outlined"
          placeholder="Simbolo"
          error={error}
          value={simbol}
          onChange={(e) => {
            setError(false);
            setSimbol(e.target.value.toUpperCase());
          }}
          label={error ? 'Simbolo incorrecto' : ''}
          slotProps={{
            input: {
              endAdornment: simbol && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setSimbol('');
                      document.getElementById('simbol')?.focus();
                    }}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
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
          <Box>
            <CustomList report={report} />
            <br />
            <CustomTable
              annualEarnings={annualEarnings}
              quarterlyEarnings={quarterlyEarnings}
            />
            <br />
          </Box>
        )}
      </Container>
    </div>
  );
}
