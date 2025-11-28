import { UserMetrics, GlobalStats, PercentileData } from "@/types/metrics";
import { 
  calculateCountryPercentile, 
  getCountryStats, 
  convertCurrency,
  CountryCode,
  availableCountries 
} from "./countryData";

// Mock database of user submissions
const mockDatabase: UserMetrics[] = [
  // Tech sector
  { sector: "Technology", ageRange: "25-34", city: "San Francisco", salary: 120000, currency: "USD", netWorth: 150000, rent: 3000 },
  { sector: "Technology", ageRange: "25-34", city: "New York", salary: 110000, currency: "USD", netWorth: 120000, rent: 2800 },
  { sector: "Technology", ageRange: "35-44", city: "Seattle", salary: 150000, currency: "USD", netWorth: 300000, rent: 2500 },
  { sector: "Technology", ageRange: "25-34", city: "Austin", salary: 95000, currency: "USD", netWorth: 80000, rent: 1800 },
  { sector: "Technology", ageRange: "45-54", city: "San Francisco", salary: 180000, currency: "USD", netWorth: 500000, rent: 3500 },
  
  // Finance sector
  { sector: "Finance", ageRange: "25-34", city: "New York", salary: 130000, currency: "USD", netWorth: 200000, rent: 3200 },
  { sector: "Finance", ageRange: "35-44", city: "London", salary: 95000, currency: "GBP", netWorth: 250000, rent: 2200 },
  { sector: "Finance", ageRange: "25-34", city: "Singapore", salary: 85000, currency: "SGD", netWorth: 150000, rent: 2500 },
  { sector: "Finance", ageRange: "45-54", city: "New York", salary: 200000, currency: "USD", netWorth: 800000, rent: 4000 },
  
  // Healthcare sector
  { sector: "Healthcare", ageRange: "25-34", city: "Boston", salary: 75000, currency: "USD", netWorth: 50000, rent: 2000 },
  { sector: "Healthcare", ageRange: "35-44", city: "Chicago", salary: 90000, currency: "USD", netWorth: 120000, rent: 1800 },
  { sector: "Healthcare", ageRange: "45-54", city: "Los Angeles", salary: 110000, currency: "USD", netWorth: 250000, rent: 2400 },
  
  // Education sector
  { sector: "Education", ageRange: "25-34", city: "Boston", salary: 55000, currency: "USD", netWorth: 30000, rent: 1500 },
  { sector: "Education", ageRange: "35-44", city: "Portland", salary: 65000, currency: "USD", netWorth: 80000, rent: 1600 },
  { sector: "Education", ageRange: "45-54", city: "Seattle", salary: 75000, currency: "USD", netWorth: 150000, rent: 1800 },
  
  // Marketing sector
  { sector: "Marketing", ageRange: "25-34", city: "Los Angeles", salary: 70000, currency: "USD", netWorth: 60000, rent: 2000 },
  { sector: "Marketing", ageRange: "35-44", city: "New York", salary: 95000, currency: "USD", netWorth: 140000, rent: 2600 },
  { sector: "Marketing", ageRange: "25-34", city: "Miami", salary: 65000, currency: "USD", netWorth: 45000, rent: 1700 },
];

export const sectors = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "Engineering",
  "Legal",
  "Retail",
  "Manufacturing",
  "Other"
];

export const ageRanges = [
  "18-24",
  "25-34",
  "35-44",
  "45-54",
  "55-64",
  "65+"
];

export const cities = [
  "San Francisco",
  "New York",
  "London",
  "Singapore",
  "Seattle",
  "Austin",
  "Boston",
  "Chicago",
  "Los Angeles",
  "Miami",
  "Portland",
  "Toronto",
  "Sydney",
  "Berlin",
  "Tokyo",
  "Madrid",
  "Barcelona",
  "Other"
];

export const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
];

// Calculate percentile
export function calculatePercentile(value: number, dataset: number[]): number {
  const sorted = [...dataset].sort((a, b) => a - b);
  const index = sorted.findIndex(v => v >= value);
  if (index === -1) return 100;
  return Math.round((index / sorted.length) * 100);
}

// Get statistics from official country data
export function getGlobalStats(filters: { countryData: CountryCode }): GlobalStats {
  const countryStats = getCountryStats(filters.countryData);
  
  if (!countryStats) {
    // Fallback to Spain if country not found
    const fallback = getCountryStats('spain')!;
    return {
      avgSalary: Math.round(fallback.mean),
      medianSalary: Math.round(fallback.median),
      avgNetWorth: Math.round(fallback.mean * 3), // Estimate: 3x annual salary
      medianNetWorth: Math.round(fallback.median * 2.5), // Estimate: 2.5x annual salary
      avgRent: Math.round(fallback.mean / 12 * 0.3), // Estimate: 30% of monthly salary
      medianRent: Math.round(fallback.median / 12 * 0.3),
    };
  }
  
  return {
    avgSalary: Math.round(countryStats.mean),
    medianSalary: Math.round(countryStats.median),
    avgNetWorth: Math.round(countryStats.mean * 3), // Estimate: 3x annual salary
    medianNetWorth: Math.round(countryStats.median * 2.5), // Estimate: 2.5x annual salary
    avgRent: Math.round(countryStats.mean / 12 * 0.3), // Estimate: 30% of monthly salary
    medianRent: Math.round(countryStats.median / 12 * 0.3),
  };
}

// Calculate user percentiles using official country data
export function calculateUserPercentiles(userMetrics: UserMetrics, filters: { countryData: CountryCode }): PercentileData {
  const countryStats = getCountryStats(filters.countryData);
  
  if (!countryStats) {
    // Fallback if country not found
    return {
      salary: 50,
      netWorth: 50,
      rent: 50,
    };
  }
  
  // Convert user's salary to the country's currency for comparison
  const salaryInCountryCurrency = convertCurrency(
    userMetrics.salary,
    userMetrics.currency,
    countryStats.currency
  );
  const salaryPercentile = Math.round(calculateCountryPercentile(salaryInCountryCurrency, filters.countryData));
  
  // For netWorth and rent, use mock data (can be enhanced later)
  let filteredData = [...mockDatabase];
  if (filters?.sector) {
    filteredData = filteredData.filter(d => d.sector === filters.sector);
  }
  if (filters?.ageRange) {
    filteredData = filteredData.filter(d => d.ageRange === filters.ageRange);
  }
  if (filters?.city) {
    filteredData = filteredData.filter(d => d.city === filters.city);
  }
  
  const netWorths = filteredData.map(d => d.netWorth);
  const rents = filteredData.map(d => d.rent);
  
  return {
    salary: salaryPercentile,
    netWorth: calculatePercentile(userMetrics.netWorth, netWorths),
    rent: calculatePercentile(userMetrics.rent, rents),
  };
}

function getMedian(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

// Get distribution data for charts based on country percentiles
export function getDistributionData(metric: 'salary' | 'netWorth' | 'rent', filters: { countryData: CountryCode }) {
  const countryStats = getCountryStats(filters.countryData);
  
  if (!countryStats) {
    // Return empty buckets if no data
    return [];
  }
  
  // Create distribution based on country percentiles
  if (metric === 'salary') {
    return [
      { range: `0-${Math.round(countryStats.p10 / 1000)}k`, count: 10 },
      { range: `${Math.round(countryStats.p10 / 1000)}k-${Math.round(countryStats.p25 / 1000)}k`, count: 15 },
      { range: `${Math.round(countryStats.p25 / 1000)}k-${Math.round(countryStats.median / 1000)}k`, count: 25 },
      { range: `${Math.round(countryStats.median / 1000)}k-${Math.round(countryStats.p75 / 1000)}k`, count: 25 },
      { range: `${Math.round(countryStats.p75 / 1000)}k-${Math.round(countryStats.p90 / 1000)}k`, count: 15 },
      { range: `${Math.round(countryStats.p90 / 1000)}k+`, count: 10 },
    ];
  }
  
  // For netWorth and rent, create estimated distributions
  const multiplier = metric === 'netWorth' ? 3 : 0.025; // 3x salary for netWorth, ~2.5% for monthly rent
  return [
    { range: `0-${Math.round(countryStats.p10 * multiplier / 1000)}k`, count: 10 },
    { range: `${Math.round(countryStats.p10 * multiplier / 1000)}k-${Math.round(countryStats.p25 * multiplier / 1000)}k`, count: 15 },
    { range: `${Math.round(countryStats.p25 * multiplier / 1000)}k-${Math.round(countryStats.median * multiplier / 1000)}k`, count: 25 },
    { range: `${Math.round(countryStats.median * multiplier / 1000)}k-${Math.round(countryStats.p75 * multiplier / 1000)}k`, count: 25 },
    { range: `${Math.round(countryStats.p75 * multiplier / 1000)}k-${Math.round(countryStats.p90 * multiplier / 1000)}k`, count: 15 },
    { range: `${Math.round(countryStats.p90 * multiplier / 1000)}k+`, count: 10 },
  ];
}
