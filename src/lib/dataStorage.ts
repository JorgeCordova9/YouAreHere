// Future-ready data storage functions
// This will be activated when Supabase is configured

import { UserMetrics } from "@/types/metrics";
import { supabase } from "./supabase";

/**
 * Save user metrics to database (anonymous)
 * This stores submissions for future statistical analysis
 * but does NOT immediately include them in comparison calculations
 */
export async function saveUserMetrics(metrics: UserMetrics): Promise<boolean> {
  try {
    // Check if Supabase is configured
    const isSupabaseConfigured = 
      import.meta.env.VITE_SUPABASE_URL && 
      import.meta.env.VITE_SUPABASE_ANON_KEY &&
      import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co';

    if (!isSupabaseConfigured) {
      console.log('Supabase not configured - data saved locally only');
      return false;
    }

    // Save anonymously to database (using global_metrics table)
    const { error } = await supabase
      .from('global_metrics')
      .insert({
        sector: metrics.sector,
        age_range: metrics.ageRange,
        city: metrics.city,
        salary: metrics.salary,
        currency: metrics.currency,
        net_worth: metrics.netWorth,
        rent: metrics.rent,
        industry: metrics.sector, // Map sector to industry field
        // Note: No user ID or identifying information
      });

    if (error) {
      console.error('Error saving to database:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving user metrics:', error);
    return false;
  }
}

/**
 * Configuration flag to control whether user submissions
 * should be included in statistical calculations
 * 
 * Set this to true only when you have:
 * 1. Sufficient user data (e.g., 100+ submissions per category)
 * 2. Data validation and cleaning processes in place
 * 3. Outlier detection implemented
 */
export const USE_USER_DATA_IN_STATS = false;

/**
 * Minimum submissions required before including user data in statistics
 * This prevents small sample sizes from skewing results
 */
export const MIN_SUBMISSIONS_FOR_STATS = 100;

/**
 * Get user submission count for a specific filter combination
 * Used to determine if we have enough data to show user-based statistics
 */
export async function getUserSubmissionCount(filters?: {
  sector?: string;
  ageRange?: string;
  city?: string;
  region?: string;
}): Promise<number> {
  try {
    const isSupabaseConfigured = 
      import.meta.env.VITE_SUPABASE_URL && 
      import.meta.env.VITE_SUPABASE_ANON_KEY &&
      import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co';

    if (!isSupabaseConfigured) {
      return 0;
    }

    let query = supabase
      .from('global_metrics')
      .select('*', { count: 'exact', head: true });

    if (filters?.sector) {
      query = query.eq('sector', filters.sector);
    }
    if (filters?.ageRange) {
      query = query.eq('age_range', filters.ageRange);
    }
    if (filters?.city) {
      query = query.eq('city', filters.city);
    }

    const { count, error } = await query;

    if (error) {
      console.error('Error getting submission count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error fetching submission count:', error);
    return 0;
  }
}

/**
 * Future function: Get user submissions for statistical analysis
 * This will be used when USE_USER_DATA_IN_STATS is enabled
 */
export async function getUserSubmissionsForStats(filters?: {
  sector?: string;
  ageRange?: string;
  city?: string;
}): Promise<UserMetrics[]> {
  if (!USE_USER_DATA_IN_STATS) {
    return [];
  }

  try {
    const isSupabaseConfigured = 
      import.meta.env.VITE_SUPABASE_URL && 
      import.meta.env.VITE_SUPABASE_ANON_KEY &&
      import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co';

    if (!isSupabaseConfigured) {
      return [];
    }

    // Check if we have enough submissions
    const count = await getUserSubmissionCount(filters);
    if (count < MIN_SUBMISSIONS_FOR_STATS) {
      console.log(`Not enough submissions (${count}/${MIN_SUBMISSIONS_FOR_STATS}) - using official data only`);
      return [];
    }

    const query = supabase
      .from('global_metrics')
      .select('*');

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching submissions:', error);
      return [];
    }

    // Filter in memory to avoid TypeScript complexity with chained queries
    let filteredData = data || [];
    
    if (filters?.sector) {
      filteredData = filteredData.filter(item => item.sector === filters.sector);
    }
    if (filters?.ageRange) {
      filteredData = filteredData.filter(item => item.age_range === filters.ageRange);
    }
    if (filters?.city) {
      filteredData = filteredData.filter(item => item.city === filters.city);
    }

    // Map database fields to UserMetrics interface
    return filteredData.map(item => ({
      sector: item.sector,
      ageRange: item.age_range,
      city: item.city,
      salary: item.salary,
      currency: item.currency,
      netWorth: item.net_worth,
      rent: item.rent,
    }));
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    return [];
  }
}
