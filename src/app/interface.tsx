export type COMPANY_DATA = {
  annualEarnings: [ANNUAL_EARNINGS];
  quarterlyEarnings: [QUEARTERLY_EARNINGS];
  symbol: string;
};

export type ANNUAL_EARNINGS = {
  fiscalDateEnding: string;
  reportedEPS: string;
};

export type QUEARTERLY_EARNINGS = {
  estimatedEPS: string;
  fiscalDateEnding: string;
  reportTime: string;
  reportedDate: string;
  reportedEPS: string;
  surprise: string;
  surprisePercentage: string;
};

export type ReportProps = {
  fiveYearsValue: number;
  lastYearValue: number;
  historicalPEG: number;
  lastYearPEG: number;
  fowardPEG: number;
  PER: number;
  Beta: number;
  QuarterlyRevenueGrowthYOY: string;
  GrossMargin: string;
  Symbol: string;
};

export const COLUMNS: { key: keyof ReportProps; label: string }[] = [
  { key: 'Symbol', label: 'Symbol'},
  { key: 'fiveYearsValue', label: '5Y EPS Growth' },
  { key: 'lastYearValue', label: 'Last Year EPS Growth' },
  { key: 'historicalPEG', label: 'Historical PEG' },
  { key: 'lastYearPEG', label: 'Last Year PEG' },
  { key: 'fowardPEG', label: 'Forward PEG' },
  { key: 'Beta', label: 'Beta' },
  { key: 'QuarterlyRevenueGrowthYOY', label: 'Rev Growth YOY' },
  { key: 'GrossMargin', label: 'Gross Margin' },
];
