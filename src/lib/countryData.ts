// Official salary data for multiple countries
// All salary values in local currency (annual gross salary)

export interface CountrySalaryData {
  country: string;
  countryCode: string;
  year: number;
  currency: string;
  mean: number;
  median: number;
  p10: number;
  p25: number;
  p75: number;
  p90: number;
  source: string;
}

// Spain Data - INE (Instituto Nacional de Estadística) 2023
// Source: Annual Salary Structure Survey
export const spainData: CountrySalaryData = {
  country: "Spain",
  countryCode: "ES",
  year: 2023,
  currency: "EUR",
  mean: 28049.94,
  median: 23349.0,
  p10: 11466.88,
  p25: 16632.97,
  p75: 34991.64,
  p90: 49836.0,
  source: "INE - Encuesta Anual de Estructura Salarial 2023"
};

// United States Data - BLS (Bureau of Labor Statistics) 2023
// Source: Occupational Employment and Wage Statistics
// Note: Using full-time worker median estimates
export const usaData: CountrySalaryData = {
  country: "United States",
  countryCode: "US",
  year: 2023,
  currency: "USD",
  mean: 63795,      // Mean annual wage (BLS May 2023)
  median: 48060,    // Median annual wage (BLS May 2023)
  p10: 29000,       // Estimated 10th percentile
  p25: 36000,       // Estimated 25th percentile (Q1)
  p75: 72000,       // Estimated 75th percentile (Q3)
  p90: 101250,      // Estimated 90th percentile
  source: "BLS - Occupational Employment and Wage Statistics 2023"
};

// United Kingdom Data - ONS (Office for National Statistics) 2023
// Source: Annual Survey of Hours and Earnings (ASHE)
// Values in GBP (British Pounds)
export const ukData: CountrySalaryData = {
  country: "United Kingdom",
  countryCode: "GB",
  year: 2023,
  currency: "GBP",
  mean: 35828,      // Mean annual earnings (ONS 2023)
  median: 34963,    // Median annual earnings (ONS 2023)
  p10: 19461,       // 10th percentile (ONS 2023)
  p25: 25000,       // 25th percentile (ONS 2023)
  p75: 47106,       // 75th percentile (ONS 2023)
  p90: 63472,       // 90th percentile (ONS 2023)
  source: "ONS - Annual Survey of Hours and Earnings 2023"
};

// All available countries
export const availableCountries = {
  spain: spainData,
  usa: usaData,
  uk: ukData,
};

export type CountryCode = keyof typeof availableCountries;

// Calculate percentile for a given salary in a country
export function calculateCountryPercentile(salary: number, countryCode: CountryCode): number {
  const data = availableCountries[countryCode];
  
  if (!data) return 50; // Default to median if no data
  
  // Determine percentile based on where salary falls
  if (salary <= data.p10) return 10;
  if (salary <= data.p25) {
    // Linear interpolation between P10 and P25
    return 10 + ((salary - data.p10) / (data.p25 - data.p10)) * 15;
  }
  if (salary <= data.median) {
    // Linear interpolation between P25 and P50
    return 25 + ((salary - data.p25) / (data.median - data.p25)) * 25;
  }
  if (salary <= data.p75) {
    // Linear interpolation between P50 and P75
    return 50 + ((salary - data.median) / (data.p75 - data.median)) * 25;
  }
  if (salary <= data.p90) {
    // Linear interpolation between P75 and P90
    return 75 + ((salary - data.p75) / (data.p90 - data.p75)) * 15;
  }
  
  // Above P90
  return Math.min(99, 90 + ((salary - data.p90) / (data.p90 * 0.2)) * 10);
}

// Get country salary statistics
export function getCountryStats(countryCode: CountryCode): CountrySalaryData | null {
  return availableCountries[countryCode] || null;
}

// Currency conversion rates (approximate - in production use real-time API)
export const currencyConversionToUSD: { [key: string]: number } = {
  USD: 1.0,
  EUR: 1.09,    // 1 EUR = 1.09 USD
  GBP: 1.27,    // 1 GBP = 1.27 USD
  JPY: 0.0067,  // 1 JPY = 0.0067 USD
  AUD: 0.65,    // 1 AUD = 0.65 USD
  CAD: 0.74,    // 1 CAD = 0.74 USD
  SGD: 0.74,    // 1 SGD = 0.74 USD
};

// Convert salary to target currency
export function convertCurrency(
  amount: number, 
  fromCurrency: string, 
  toCurrency: string
): number {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to USD first
  const amountInUSD = amount * (currencyConversionToUSD[fromCurrency] || 1);
  
  // Then to target currency
  const toRate = currencyConversionToUSD[toCurrency] || 1;
  return amountInUSD / toRate;
}
