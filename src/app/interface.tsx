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
