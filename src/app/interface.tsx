export type COMPANY_DATA = {
  annualEarnings: [
    {
      fiscalDateEnding: string;
      reportedEPS: string;
    },
  ];
  quarterlyEarnings: [
    {
      estimatedEPS: string;
      fiscalDateEnding: string;
      reportTime: string;
      reportedDate: string;
      reportedEPS: string;
      surprise: string;
      surprisePercentage: string;
    },
  ];
  symbol: string;
};
