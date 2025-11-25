import { UserMetrics, GlobalStats, PercentileData } from "@/types/metrics";

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

// Get global statistics
export function getGlobalStats(filters?: { sector?: string; ageRange?: string; city?: string }): GlobalStats {
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
  
  const salaries = filteredData.map(d => d.salary);
  const netWorths = filteredData.map(d => d.netWorth);
  const rents = filteredData.map(d => d.rent);
  
  return {
    avgSalary: Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length),
    medianSalary: getMedian(salaries),
    avgNetWorth: Math.round(netWorths.reduce((a, b) => a + b, 0) / netWorths.length),
    medianNetWorth: getMedian(netWorths),
    avgRent: Math.round(rents.reduce((a, b) => a + b, 0) / rents.length),
    medianRent: getMedian(rents),
  };
}

// Calculate user percentiles
export function calculateUserPercentiles(userMetrics: UserMetrics, filters?: { sector?: string; ageRange?: string; city?: string }): PercentileData {
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
  
  const salaries = filteredData.map(d => d.salary);
  const netWorths = filteredData.map(d => d.netWorth);
  const rents = filteredData.map(d => d.rent);
  
  return {
    salary: calculatePercentile(userMetrics.salary, salaries),
    netWorth: calculatePercentile(userMetrics.netWorth, netWorths),
    rent: calculatePercentile(userMetrics.rent, rents),
  };
}

function getMedian(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

// Get distribution data for charts
export function getDistributionData(metric: 'salary' | 'netWorth' | 'rent', filters?: { sector?: string; ageRange?: string; city?: string }) {
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
  
  const values = filteredData.map(d => d[metric]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  const bucketSize = range / 5;
  
  const buckets = Array.from({ length: 5 }, (_, i) => {
    const start = min + (i * bucketSize);
    const end = start + bucketSize;
    const count = values.filter(v => v >= start && v < end).length;
    return {
      range: `${Math.round(start / 1000)}k-${Math.round(end / 1000)}k`,
      count
    };
  });
  
  return buckets;
}
