export interface UserMetrics {
  sector: string;
  ageRange: string;
  city: string;
  salary: number;
  currency: string;
  netWorth: number;
  rent: number;
}

export interface PercentileData {
  salary: number;
  netWorth: number;
  rent: number;
}

export interface GlobalStats {
  avgSalary: number;
  medianSalary: number;
  avgNetWorth: number;
  medianNetWorth: number;
  avgRent: number;
  medianRent: number;
}

export interface FilterOptions {
  region?: string;
  ageGroup?: string;
  sector?: string;
}
