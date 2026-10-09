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
  COLUMNS,
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
    QuarterlyRevenueGrowthYOY: '',
    GrossMargin: '',
    Symbol: '',
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
    const { metric } = data;
    const historicalPEG = (Number(metric?.peTTM) / fiveYearsCarg).toFixed(2);
    setReport((prev) => ({
      ...prev,
      historicalPEG: Number(historicalPEG),
      PER: Number(metric?.peTTM),
      lastYearPEG: Number(
        (Number(metric?.peTTM) / Number(lastYearValue)).toFixed(2),
      ),
      fowardPEG: Number(metric?.forwardPEG),
      Beta: Number(metric?.beta),
      QuarterlyRevenueGrowthYOY: metric?.revenueGrowthQuarterlyYoy.toFixed(2),
      GrossMargin: metric?.grossMarginTTM.toFixed(2),
      Symbol: simbol,
    }));
  };

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const _makeFetchCall = async () => {
    setIsLoading(true);
    if (process.env.NEXT_PUBLIC_ENVIROMENT === 'prod') {
      const url1 = `https://www.alphavantage.co/query?function=EARNINGS&symbol=${simbol}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`;
      const url2 = `https://finnhub.io/api/v1/stock/metric?symbol=AAPL&metric=all&token=${process.env.NEXT_PUBLIC_API_KEY2}`;

      const response1 = await fetch(url1);
      const data1 = await response1.json();

      if (data1?.Information) {
        Swal.fire(
          'Se alcanzó el limite de peticiones por día. Esperar hasta mañana',
        );
      }
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
      setAnnualEarnings(filteredHistoricalData.slice(0, 6));
      const fiveYearsCarg = calculateCAGR(
        filteredHistoricalData.slice(0, 6),
        5,
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

  const formatValue = (value: number | string): string => {
    if (typeof value === 'number') {
      return value.toString();
    }
    return value ?? '';
  };

  const copyReportsForExcel = async (reports: ReportProps[]) => {
    if (reports.length === 0) return;

    const dataRows = reports.map((report) =>
      COLUMNS.map((col) => formatValue(report[col.key])).join('\t'),
    );

    const tsv = dataRows.join('\n');

    try {
      await navigator.clipboard.writeText(tsv);
      console.log('Copiado al portapapeles');
    } catch (err) {
      console.warn('Clipboard API falló, usando fallback:', err);
      const textarea = document.createElement('textarea');
      textarea.value = tsv;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
      } finally {
        document.body.removeChild(textarea);
      }
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
          onClick={(e: any) => {
            if (e.target?.type) e?.target?.select();
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
          onKeyUp={(e) => {
            if (e.key === 'Enter') getCompanyReport();
          }}
        />{' '}
        <Button variant="contained" onClick={getCompanyReport}>
          Buscar
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#139901' }}
          onClick={() => copyReportsForExcel([report])}
        >
          Copiar
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
