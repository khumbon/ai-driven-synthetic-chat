import { generateReportData } from './generateReportData';

export const generateReport = async () => {
  try {
    const reportData = generateReportData();
    return reportData;
  } catch (error) {
    console.error('Error generating report data:', error);
  }
};

generateReport();
